import { Task } from '../../domain/entities/Task'
import { TaskStatus } from '../../domain/enums/TaskStatus'
import { OnlineGitRepositorySpecification } from '../../domain/entities/OnlineGitRepositorySpecification'
import { TaskService } from '../task/TaskService'
import simpleGit from 'simple-git'
import * as path from 'path'
import * as fs from 'fs/promises'
import { LibraryLocalFolderService } from '../libraryLocalFolder/LibraryLocalFolderService'
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

export async function subscribeToLibraryFromOnlineGitRepository(
    specification: OnlineGitRepositorySpecification
): Promise<{ task: Task; libraryId: string }> {
    // Create task
    const taskId = uuidv4()
    await taskService.createTask({
        id: taskId,
        status: TaskStatus.PROCESSING,
        createdAt: new Date()
    })

    try {
        // Extract repository owner and name from URL
        const { owner, name } = extractRepoInfo(specification.repositoryUrl)

        // Create repository directory
        const repoPath = path.join(process.cwd(), 'data/git-repos', `${owner}-${name}`)
        await fs.rm(repoPath, { recursive: true, force: true })
        await fs.mkdir(repoPath, { recursive: true })

        // Clone the repository using the auth URL from specification
        const git = simpleGit(repoPath)
        await git.clone(specification.getAuthUrl(), repoPath)

        // Read library.json to get the libraryId
        const libraryJsonPath = path.join(repoPath, 'library.json')
        const libraryJson = JSON.parse(await fs.readFile(libraryJsonPath, 'utf-8'))
        const libraryId = libraryJson.id

        // Import library from the cloned repository with MERGE policy
        await libraryLocalFolderService.importLibraryClone(
            repoPath,
            IdConflictPolicy.MERGE
        )

        // Update task status and get the updated task
        await taskService.updateTask({
            id: taskId,
            status: TaskStatus.COMPLETED,
            createdAt: new Date()
        })

        const tasks = await taskService.getTasks()
        const task = tasks.find(t => t.id === taskId)
        if (!task) throw new Error('Task not found')

        return { task, libraryId }
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