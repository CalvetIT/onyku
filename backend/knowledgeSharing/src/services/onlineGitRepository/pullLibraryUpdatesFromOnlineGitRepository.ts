import { Task } from '../../domain/entities/Task'
import { TaskStatus } from '../../domain/enums/TaskStatus'
import { OnlineGitRepositorySpecification } from '../../domain/entities/OnlineGitRepositorySpecification'
import { TaskService } from '../task/TaskService'
import { LibraryLocalFolderService } from '../libraryLocalFolder/LibraryLocalFolderService'
import { DistributionMethod } from '../../domain/enums/DistributionMethod'
import simpleGit from 'simple-git'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'

const libraryLocalFolderService = new LibraryLocalFolderService()
const taskService = new TaskService()

function extractRepoInfo(repositoryUrl: string): { owner: string; name: string } {
    const match = repositoryUrl.match(/(?:github|gitlab)\.com\/([^\/]+)\/([^\/\.]+)/)
    if (!match) {
        throw new Error('Invalid repository URL format')
    }
    return { owner: match[1], name: match[2] }
}

export async function pullLibraryUpdatesFromOnlineGitRepository(
    specification: OnlineGitRepositorySpecification
): Promise<Task> {
    // Validate specification
    if (specification.distributionMethod !== DistributionMethod.SUBSCRIBED) {
        throw new Error('Cannot pull updates: Library is not in SUBSCRIBED mode')
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

        // Pull changes
        const git = simpleGit(repoPath)
        
        // Set the remote URL with authentication (in case token was updated)
        await git.remote(['set-url', 'origin', specification.getAuthUrl()])
        
        // Pull latest changes
        await git.pull('origin', 'main')

        // Import updated library with MERGE strategy
        await libraryLocalFolderService.importLibraryClone(
            repoPath,
            IdConflictPolicy.MERGE
        )

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