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
    console.log(`[Git Publish] Extracting repo info from URL: ${repositoryUrl}`)
    const match = repositoryUrl.match(/(?:github|gitlab)\.com\/([^\/]+)\/([^\/\.]+)/)
    if (!match) {
        console.error(`[Git Publish] Failed to extract repo info: Invalid URL format`)
        throw new Error('Invalid repository URL format')
    }
    return { owner: match[1], name: match[2] }
}

function getLocalRepoPath(repositoryUrl: string): string {
    const { owner, name } = extractRepoInfo(repositoryUrl)
    const repoPath = path.join(process.cwd(), 'data/git-repos', `${owner}-${name}`)
    console.log(`[Git Publish] Local repo path: ${repoPath}`)
    return repoPath
}

export async function publishLibraryToOnlineGitRepository(
    specification: OnlineGitRepositorySpecification
): Promise<Task> {
    console.log(`[Git Publish] Starting publish for library ${specification.libraryId} to ${specification.provider}`)
    console.log(`[Git Publish] Repository URL: ${specification.repositoryUrl}`)
    console.log(`[Git Publish] Visibility: ${specification.visibility}`)
    console.log(`[Git Publish] Distribution Method: ${specification.distributionMethod}`)

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
        console.log(`[Git Publish] Library export completed`)

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
            console.log(`[Git Publish] Repository visibility: ${specification.visibility}`)
            try {
                interface GitHubApiResponse {
                    html_url: string;
                    [key: string]: any;
                }
                
                const requestData = {
                    name: name,
                    private: specification.visibility === 'PRIVATE',
                    auto_init: false,
                    description: `Library repository created by Knowledge Sharing tool`
                };
                console.log(`[Git Publish] GitHub API request data:`, JSON.stringify(requestData, null, 2));
                
                // First, try to get the repository to check if it exists
                try {
                    console.log(`[Git Publish] Checking if repository already exists at: https://api.github.com/repos/${owner}/${name}`)
                    interface GitHubRepoResponse {
                        html_url: string;
                        [key: string]: any;
                    }
                    const checkResponse = await axios.get<GitHubRepoResponse>(
                        `https://api.github.com/repos/${owner}/${name}`,
                        {
                            headers: {
                                'Authorization': `token ${token}`,
                                'Accept': 'application/vnd.github.v3+json'
                            }
                        }
                    );
                    console.log(`[Git Publish] Repository already exists: ${checkResponse.data.html_url}`);
                    throw new Error(`Repository ${owner}/${name} already exists`);
                } catch (checkError: any) {
                    if (checkError.response?.status !== 404) {
                        console.error(`[Git Publish] Error checking repository:`, {
                            status: checkError.response?.status,
                            statusText: checkError.response?.statusText,
                            data: checkError.response?.data,
                            message: checkError.message
                        });
                        throw checkError;
                    }
                    // If 404, proceed with creation
                    console.log(`[Git Publish] Repository does not exist, proceeding with creation`);
                }
                
                // Determine if we're creating in an organization or user account
                const isOrganization = owner !== 'christophecalvet'; // Add any other personal accounts if needed
                const createEndpoint = isOrganization 
                    ? `https://api.github.com/orgs/${owner}/repos`
                    : 'https://api.github.com/user/repos';
                
                console.log(`[Git Publish] Creating repository using endpoint: ${createEndpoint}`);
                const response = await axios.post<GitHubApiResponse>(
                    createEndpoint,
                    requestData,
                    {
                        headers: {
                            'Authorization': `token ${token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                )
                console.log(`[Git Publish] GitHub API Response Status: ${response.status}`)
                console.log(`[Git Publish] GitHub API Response Headers:`, JSON.stringify(response.headers, null, 2))
                console.log(`[Git Publish] GitHub repository created successfully: ${response.data.html_url}`)

                // Update the repository URL if it's different from what we expected
                const actualRepoUrl = response.data.html_url;
                const actualOwner = actualRepoUrl.split('/')[3]; // Get the actual owner from the URL
                specification.repositoryUrl = actualRepoUrl;
                console.log(`[Git Publish] Repository owner in URL: ${owner}, Actual owner: ${actualOwner}`);

                // Verify the repository was created using the actual owner
                console.log(`[Git Publish] Verifying repository creation`)
                const verifyResponse = await axios.get<GitHubApiResponse>(
                    `https://api.github.com/repos/${actualOwner}/${name}`,
                    {
                        headers: {
                            'Authorization': `token ${token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                console.log(`[Git Publish] Repository verified: ${verifyResponse.data.html_url}`);

                // Note: The specification URL has been updated and will be saved by the calling service
                console.log(`[Git Publish] Repository URL updated to: ${actualRepoUrl}`);
            } catch (error: any) {
                console.error(`[Git Publish] GitHub API Error Details:`, {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    message: error.message,
                    requestUrl: 'https://api.github.com/user/repos',
                    requestedRepoName: name,
                    visibility: specification.visibility,
                    tokenLength: token.length,
                    tokenPrefix: token.substring(0, 4) + '...'
                })
                throw new Error(`Failed to create GitHub repository: ${error.response?.data?.message || error.message}`)
            }
        }

        // Initialize git and push
        console.log(`[Git Publish] Initializing local git repository`)
        const git = simpleGit(repoPath)
        await git.init()
        console.log(`[Git Publish] Configuring git user`)
        await git.addConfig('user.name', owner)
        await git.addConfig('user.email', 'noreply@github.com')
        
        console.log(`[Git Publish] Adding files to git`)
        await git.add('.')
        const status = await git.status()
        console.log(`[Git Publish] Git status:`, {
            staged: status.staged,
            modified: status.modified,
            created: status.created,
            deleted: status.deleted
        })
        
        console.log(`[Git Publish] Committing files`)
        await git.commit('Initial library export')
        
        console.log(`[Git Publish] Adding remote origin`)
        const authUrl = specification.getAuthUrl()
        console.log(`[Git Publish] Using authenticated URL (redacted token)`)
        await git.addRemote('origin', authUrl)
        
        console.log(`[Git Publish] Pushing to remote`)
        try {
            await git.push(['-u', 'origin', 'main'])
            console.log(`[Git Publish] Push completed successfully`)
        } catch (error: any) {
            console.error(`[Git Publish] Git push error:`, error.message)
            throw error
        }

        // Update task status
        task.status = TaskStatus.COMPLETED
        await taskService.updateTask(task)
        console.log(`[Git Publish] Task marked as completed`)

        return task
    } catch (error: any) {
        console.error(`[Git Publish] Error during publishing:`, error.message)
        task.status = TaskStatus.FAILED
        await taskService.updateTask(task)
        console.log(`[Git Publish] Task marked as failed`)
        throw error
    }
} 