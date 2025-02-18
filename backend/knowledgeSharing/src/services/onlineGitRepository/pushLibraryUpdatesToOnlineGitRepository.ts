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

async function emptyDirectory(directory: string): Promise<void> {
    const files = await fs.readdir(directory)
    for (const file of files) {
        if (file === '.git') continue // Preserve .git directory
        const filePath = path.join(directory, file)
        const stat = await fs.stat(filePath)
        if (stat.isDirectory()) {
            await fs.rm(filePath, { recursive: true })
        } else {
            await fs.unlink(filePath)
        }
    }
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
        const git = simpleGit(repoPath)

        // Check if repo exists and initialize/clone if needed
        const repoExists = await fs.access(repoPath).then(() => true).catch(() => false)
        if (!repoExists) {
            // Create directory and clone repository
            await fs.mkdir(repoPath, { recursive: true })
            await git.clone(specification.getAuthUrl(), repoPath)
            
            // Configure git
            await git.addConfig('user.name', 'Library Sync Bot')
            await git.addConfig('user.email', 'library-sync@noreply.local')
        } else {
            // Pull latest changes
            await git.pull('origin', 'main')
        }

        // Empty the working directory (preserving .git)
        await emptyDirectory(repoPath)

        // Export library to the folder
        await libraryLocalFolderService.exportLibraryClone(
            specification.libraryId,
            repoPath
        )

        // Add all changes
        await git.add('.')
        
        // Check if there are changes to commit
        const status = await git.status()
        if (!status.isClean()) {
            // Commit changes
            await git.commit('Update library content')
            
            // Push changes (without force)
            await git.push('origin', 'main')
        }

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