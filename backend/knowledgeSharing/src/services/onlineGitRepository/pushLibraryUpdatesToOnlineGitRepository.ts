import { Task } from '../../domain/entities/Task'
import { TaskStatus } from '../../domain/enums/TaskStatus'
import { OnlineGitRepositorySpecification } from '../../domain/entities/OnlineGitRepositorySpecification'
import { TaskService } from '../task/TaskService'
import { LibraryLocalFolderService } from '../libraryLocalFolder/LibraryLocalFolderService'
import { DistributionMethod } from '../../domain/enums/DistributionMethod'
import simpleGit from 'simple-git'
import * as path from 'path'
import * as fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

const libraryLocalFolderService = new LibraryLocalFolderService()
const taskService = new TaskService()

function extractRepoInfo(repositoryUrl: string): { owner: string; name: string } {
    const match = repositoryUrl.match(/(?:github|gitlab)\.com\/([^\/]+)\/([^\/\.]+)/)
    if (!match) {
        throw new Error('Invalid repository URL format')
    }
    return { owner: match[1], name: match[2] }
}

export async function pushLibraryUpdatesToOnlineGitRepository(
    specification: OnlineGitRepositorySpecification
): Promise<Task> {
    // Validate specification
    if (specification.distributionMethod !== DistributionMethod.PUBLISHED) {
        throw new Error('Cannot push updates: Library is not in PUBLISHED mode')
    }

    // Create task
    const taskId = uuidv4()
    await taskService.createTask({
        id: taskId,
        status: TaskStatus.PROCESSING,
        createdAt: new Date()
    })

    try {
        // Get repository path
        const { owner, name } = extractRepoInfo(specification.repositoryUrl)
        const repoPath = path.join(process.cwd(), 'data/git-repos', `${owner}-${name}`)

        // Clean/create repository directory
        await fs.rm(repoPath, { recursive: true, force: true })
        await fs.mkdir(repoPath, { recursive: true })

        // Export library to the folder
        await libraryLocalFolderService.exportLibraryClone(
            specification.libraryId,
            repoPath
        )

        // Initialize git and push changes
        const git = simpleGit(repoPath)
        
        // Initialize git repository
        await git.init()
        
        // Configure git (using generic details since this is automated)
        await git.addConfig('user.name', 'Library Sync Bot')
        await git.addConfig('user.email', 'library-sync@noreply.local')

        // Add all files
        await git.add('.')
        
        // Commit changes
        await git.commit('Update library content')
        
        // Add remote and push
        await git.addRemote('origin', specification.getAuthUrl())
        await git.push('origin', 'main', ['--force']) // Using force to avoid conflicts

        // Update task status
        await taskService.updateTask({
            id: taskId,
            status: TaskStatus.COMPLETED,
            createdAt: new Date()
        })

        const tasks = await taskService.getTasks()
        const task = tasks.find(t => t.id === taskId)
        if (!task) throw new Error('Task not found')

        return task
    } catch (error: any) {
        // Handle failure
        await taskService.updateTask({
            id: taskId,
            status: TaskStatus.FAILED,
            createdAt: new Date()
        })

        const tasks = await taskService.getTasks()
        const task = tasks.find(t => t.id === taskId)
        if (!task) throw new Error('Task not found')

        throw error
    }
} 