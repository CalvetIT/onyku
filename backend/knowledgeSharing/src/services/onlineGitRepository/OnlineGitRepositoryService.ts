import { InMemoryOnlineGitRepositoryService } from './InMemoryOnlineGitRepositoryService'
import { PersistentOnlineGitRepositoryService } from './PersistentOnlineGitRepositoryService'
import { Task } from '../../domain/entities/Task'
import { publishLibraryToOnlineGitRepository } from './publishLibraryToOnlineGitRepository'
import { pushLibraryUpdatesToOnlineGitRepository } from './pushLibraryUpdatesToOnlineGitRepository'
import { subscribeToLibraryFromOnlineGitRepository } from './subscribeToLibraryFromOnlineGitRepository'
import { GitProvider } from '../../domain/enums/GitProvider'
import { Visibility } from '../../domain/enums/Visibility'
import { pullLibraryUpdatesFromOnlineGitRepository } from './pullLibraryUpdatesFromOnlineGitRepository'
import { OnlineGitRepositorySpecification } from '../../domain/entities/OnlineGitRepositorySpecification'

export class OnlineGitRepositoryService {
    private static persistentService = new PersistentOnlineGitRepositoryService()
    private static inMemoryService = new InMemoryOnlineGitRepositoryService()
    
    private inMemoryService: InMemoryOnlineGitRepositoryService
    private persistentService: PersistentOnlineGitRepositoryService

    constructor() {
        this.inMemoryService = new InMemoryOnlineGitRepositoryService()
        this.persistentService = new PersistentOnlineGitRepositoryService()
    }

    public static async loadOnlineGitRepositorySpecifications(): Promise<OnlineGitRepositorySpecification[]> {
        // Load from TypeORM
        const specifications = await this.persistentService.loadOnlineGitRepositorySpecifications()
        
        // Initialize in-memory array
        await this.inMemoryService.initializeWithData(specifications)
        
        return specifications
    }

    async getAll(): Promise<OnlineGitRepositorySpecification[]> {
        return this.inMemoryService.getAll()
    }

    async getById(id: string): Promise<OnlineGitRepositorySpecification | undefined> {
        return this.inMemoryService.getById(id)
    }

    async getByLibraryId(libraryId: string): Promise<OnlineGitRepositorySpecification | undefined> {
        return this.inMemoryService.getByLibraryId(libraryId)
    }

    async publishLibrary(params: {
        libraryId: string
        provider: GitProvider
        repositoryUrl: string
        personalAccessToken: string
        visibility: Visibility
    }): Promise<Task> {
        console.log(`[Git Service] Publishing library with params:`, {
            libraryId: params.libraryId,
            provider: params.provider,
            repositoryUrl: params.repositoryUrl,
            visibility: params.visibility
        });
        
        // 1. Create specification using InMemoryService
        const specification = await this.inMemoryService.createPublishedSpecification(params)
        console.log(`[Git Service] Created specification:`, {
            id: specification.id,
            libraryId: specification.libraryId,
            provider: specification.provider,
            repositoryUrl: specification.repositoryUrl,
            visibility: specification.visibility,
            hasToken: !!specification.personalAccessTokenEncrypted
        });

        // 2. Save to persistent storage
        await this.persistentService.save(specification)
        console.log(`[Git Service] Saved specification to persistent storage`);

        // 3. Call the publish function
        console.log(`[Git Service] Calling publishLibraryToOnlineGitRepository`);
        return publishLibraryToOnlineGitRepository(specification)
    }

    async pushLibraryUpdates(libraryId: string): Promise<Task> {
        // Get specification for this library
        const specification = await this.inMemoryService.getByLibraryId(libraryId)
        if (!specification) {
            throw new Error('No git repository specification found for this library')
        }

        // Update lastSyncAt
        specification.lastSyncAt = new Date()
        
        // Update in memory and persistent storage
        await this.inMemoryService.update(specification.id, specification)
        await this.persistentService.update(specification)

        // Push updates with updated specification
        return pushLibraryUpdatesToOnlineGitRepository(specification)
    }

    async subscribeToLibrary(params: {
        provider: GitProvider
        repositoryUrl: string
        personalAccessToken?: string
        visibility: Visibility
    }): Promise<Task> {
        // 1. Create initial specification without libraryId
        const specification = await this.inMemoryService.createSubscribedSpecification(params)

        // 2. Subscribe and get the new libraryId and task
        const { task, libraryId } = await subscribeToLibraryFromOnlineGitRepository(specification)

        // 3. Update specification with the new libraryId
        specification.libraryId = libraryId
        await this.inMemoryService.update(specification.id, specification)

        // 4. Save to persistent storage
        await this.persistentService.save(specification)

        return task
    }

    async pullLibraryUpdates(libraryId: string): Promise<Task> {
        // Get specification for this library
        const specification = await this.inMemoryService.getByLibraryId(libraryId)
        if (!specification) {
            throw new Error('No git repository specification found for this library')
        }

        // Update lastSyncAt
        specification.lastSyncAt = new Date()

        // Update in memory and persistent storage
        await this.inMemoryService.update(specification.id, specification)
        await this.persistentService.update(specification)

        // Pull updates with updated specification
        return pullLibraryUpdatesFromOnlineGitRepository(specification)
    }
} 