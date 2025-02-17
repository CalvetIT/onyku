import { Task } from '../../domain/entities/Task'
import { TaskStatus } from '../../domain/enums/TaskStatus'
import { OnlineGitRepositorySpecification } from '../../domain/entities/OnlineGitRepositorySpecification'
import { LibraryLocalFolderService } from '../libraryLocalFolder/LibraryLocalFolderService'
import { LibraryService } from '../library/LibraryService'
import { TaskService } from '../task/TaskService'
import { decrypt } from '../../utils/encryption'
import simpleGit from 'simple-git'
import * as path from 'path'
import * as fs from 'fs/promises'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const libraryService = new LibraryService()
const libraryLocalFolderService = new LibraryLocalFolderService()
const taskService = new TaskService()

function extractRepoInfo(repositoryUrl: string): { owner: string; name: string } {
    const match = repositoryUrl.match(/(?:github|gitlab)\.com\/([^\/]+)\/([^\/\.]+)/)
    if (!match) {
        throw new Error('Invalid repository URL format')
    }
    return { owner: match[1], name: match[2] }
}

function getLocalRepoPath(repositoryUrl: string): string {
    const { owner, name } = extractRepoInfo(repositoryUrl)
    return path.join(process.cwd(), 'data/git-repos', `${owner}-${name}`)
}

export async function publishLibraryToOnlineGitRepository(
    specification: OnlineGitRepositorySpecification
): Promise<Task> {
    console.log(`[Git Publish] Starting publish for library ${specification.libraryId} to ${specification.provider}`)
    console.log(`[Git Publish] Repository URL: ${specification.repositoryUrl}`)
    console.log(`[Git Publish] Visibility: ${specification.visibility}`)

    // Create task
    const task = await taskService.createTask({
        id: uuidv4(),
        status: TaskStatus.PROCESSING,
        createdAt: new Date()
    })
    console.log(`[Git Publish] Created task ${task.id}`)

    try {
        // Extract repository owner and name from URL
        const { owner, name } = extractRepoInfo(specification.repositoryUrl)
        console.log(`[Git Publish] Repository info - Owner: ${owner}, Name: ${name}`)

        // Verify library exists
        const library = await libraryService.getById(specification.libraryId)
        if (!library) {
            console.error(`[Git Publish] Library ${specification.libraryId} not found`)
            throw new Error(`Library ${specification.libraryId} not found`)
        }
        console.log(`[Git Publish] Found library: ${library.name}`)

        // Create repository directory
        const repoPath = getLocalRepoPath(specification.repositoryUrl)
        console.log(`[Git Publish] Creating local repository at: ${repoPath}`)
        await fs.rm(repoPath, { recursive: true, force: true })
        await fs.mkdir(repoPath, { recursive: true })

        // Export library to folder
        console.log(`[Git Publish] Exporting library to local folder`)
        await libraryLocalFolderService.exportLibraryClone(specification.libraryId, repoPath)

        // Get decrypted token - Add null check
        if (!specification.personalAccessTokenEncrypted) {
            console.error(`[Git Publish] No personal access token provided`)
            throw new Error('Personal access token is required for publishing')
        }
        console.log(`[Git Publish] Personal access token verified (encrypted)`)
        const token = decrypt(specification.personalAccessTokenEncrypted)

        // Create remote repository
        if (specification.provider === 'GITHUB') {
            console.log(`[Git Publish] Creating GitHub repository: ${name}`)
            await axios.post(
                'https://api.github.com/user/repos',
                {
                    name: name,
                    private: specification.visibility === 'PRIVATE',
                    auto_init: false
                },
                {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            )
            console.log(`[Git Publish] GitHub repository created successfully`)
        }

        // Initialize git and push
        console.log(`[Git Publish] Initializing local git repository`)
        const git = simpleGit(repoPath)
        await git.init()
        await git.addConfig('user.name', owner)
        await git.addConfig('user.email', 'noreply@github.com')
        console.log(`[Git Publish] Adding files to git`)
        await git.add('.')
        console.log(`[Git Publish] Committing files`)
        await git.commit('Initial library export')
        console.log(`[Git Publish] Adding remote origin`)
        await git.addRemote('origin', specification.getAuthUrl())
        console.log(`[Git Publish] Pushing to remote`)
        await git.push(['-u', 'origin', 'main'])
        console.log(`[Git Publish] Push completed successfully`)

        // Update task status
        task.status = TaskStatus.COMPLETED
        await taskService.updateTask(task)
        console.log(`[Git Publish] Task marked as completed`)

        return task
    } catch (error: any) {
        // Handle failure
        console.error(`[Git Publish] Error occurred:`, error.message)
        task.status = TaskStatus.FAILED
        await taskService.updateTask(task)
        throw error
    }
} 