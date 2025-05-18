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
    console.log(`[Git Push] Extracting repo info from URL: ${repositoryUrl}`)
    const match = repositoryUrl.match(/(?:github|gitlab)\.com\/([^\/]+)\/([^\/\.]+)/)
    if (!match) {
        console.error(`[Git Push] Failed to extract repo info: Invalid URL format`)
        throw new Error('Invalid repository URL format')
    }
    return { owner: match[1], name: match[2] }
}

export async function pushLibraryUpdatesToOnlineGitRepository(
    specification: OnlineGitRepositorySpecification
): Promise<Task> {
    console.log(`[Git Push] Starting push updates for library ${specification.libraryId}`)
    console.log(`[Git Push] Repository URL: ${specification.repositoryUrl}`)
    console.log(`[Git Push] Provider: ${specification.provider}`)
    
    // Validate specification
    if (specification.distributionMethod !== DistributionMethod.PUBLISHED) {
        console.error(`[Git Push] Invalid distribution method: ${specification.distributionMethod}`)
        throw new Error('Cannot push updates: Library is not in PUBLISHED mode')
    }

    // Create task
    const taskId = uuidv4()
    const task = await taskService.createTask({
        id: taskId,
        status: TaskStatus.PROCESSING,
        createdAt: new Date()
    })
    console.log(`[Git Push] Created task ${taskId}`)

    try {
        // Get repository path
        const { owner, name } = extractRepoInfo(specification.repositoryUrl)
        const repoPath = path.join(process.cwd(), 'data/git-repos', `${owner}-${name}`)
        console.log(`[Git Push] Local repository path: ${repoPath}`)
        
        const git = simpleGit(repoPath)

        // Check if repo exists and initialize/clone if needed
        const repoExists = await fs.access(repoPath).then(() => true).catch(() => false)
        console.log(`[Git Push] Repository exists locally: ${repoExists}`)
        
        if (!repoExists) {
            console.log(`[Git Push] Repository not found locally, creating directory and cloning`)
            await fs.mkdir(repoPath, { recursive: true })
            console.log(`[Git Push] Cloning repository from: ${specification.repositoryUrl}`)
            try {
                await git.clone(specification.getAuthUrl(), repoPath)
                console.log(`[Git Push] Repository cloned successfully`)
            } catch (error: any) {
                console.error(`[Git Push] Clone error:`, error.message)
                throw error
            }
            
            // Configure git
            console.log(`[Git Push] Configuring git user`)
            await git.addConfig('user.name', 'Library Sync Bot')
            await git.addConfig('user.email', 'library-sync@noreply.local')
        } else {
            console.log(`[Git Push] Repository exists, pulling latest changes`)
            try {
                await git.pull('origin', 'main')
                console.log(`[Git Push] Successfully pulled latest changes`)
            } catch (error: any) {
                console.error(`[Git Push] Pull error:`, error.message)
                throw error
            }
        }

        // Empty the working directory (preserving .git)
        console.log(`[Git Push] Cleaning working directory`)
        const files = await fs.readdir(repoPath)
        for (const file of files) {
            if (file !== '.git') {
                const filePath = path.join(repoPath, file)
                await fs.rm(filePath, { recursive: true, force: true })
            }
        }
        console.log(`[Git Push] Working directory cleaned`)

        // Export library to the folder
        console.log(`[Git Push] Exporting library to working directory`)
        await libraryLocalFolderService.exportLibraryClone(
            specification.libraryId,
            repoPath
        )
        console.log(`[Git Push] Library export completed`)

        // Add all changes
        console.log(`[Git Push] Adding changes to git`)
        await git.add('.')
        
        // Check if there are changes to commit
        const status = await git.status()
        console.log(`[Git Push] Git status:`, {
            staged: status.staged,
            modified: status.modified,
            created: status.created,
            deleted: status.deleted
        })

        if (status.staged.length > 0 || status.modified.length > 0 || status.created.length > 0 || status.deleted.length > 0) {
            console.log(`[Git Push] Changes detected, committing`)
            try {
                await git.commit('Update library content')
                console.log(`[Git Push] Changes committed successfully`)
            } catch (error: any) {
                console.error(`[Git Push] Commit error:`, error.message)
                throw error
            }

            console.log(`[Git Push] Pushing changes to remote`)
            try {
                await git.push('origin', 'main')
                console.log(`[Git Push] Changes pushed successfully`)
            } catch (error: any) {
                console.error(`[Git Push] Push error:`, error.message)
                throw error
            }
        } else {
            console.log(`[Git Push] No changes detected, skipping commit and push`)
        }

        // Update task status
        task.status = TaskStatus.COMPLETED
        await taskService.updateTask(task)
        console.log(`[Git Push] Task marked as completed`)

        return task
    } catch (error: any) {
        console.error(`[Git Push] Error during push:`, error.message)
        task.status = TaskStatus.FAILED
        await taskService.updateTask(task)
        console.log(`[Git Push] Task marked as failed`)
        throw error
    }
} 