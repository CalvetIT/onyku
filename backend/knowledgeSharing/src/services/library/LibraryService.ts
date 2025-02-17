import { PersistentLibraryService } from './PersistentLibraryService'
import { InMemoryLibraryService } from './InMemoryLibraryService'
import { Library } from '../../domain/entities/Library'

export class LibraryService {
    private static persistentService = new PersistentLibraryService()
    private static inMemoryService = new InMemoryLibraryService()
    
    private persistentService: PersistentLibraryService
    private inMemoryService: InMemoryLibraryService

    constructor() {
        this.persistentService = new PersistentLibraryService()
        this.inMemoryService = new InMemoryLibraryService()
    }

    public static async loadLibraries(): Promise<Library[]> {
        console.log('[LibraryService] Starting loadLibraries')
        // Load from TypeORM
        const libraries = await this.persistentService.loadAll()
        console.log('[LibraryService] Loaded from persistent storage:', libraries)
        
        // Initialize in-memory array
        await this.inMemoryService.initializeWithData(libraries)
        console.log('[LibraryService] Initialized in-memory service with libraries')
        
        return libraries
    }

    async create(input: Partial<Library>): Promise<Library> {
        const savedLibrary = await this.persistentService.save(input)
        await this.inMemoryService.create(savedLibrary)
        return savedLibrary
    }

    async update(id: string, input: Partial<Library>): Promise<Library> {
        const updatedLibrary = await this.persistentService.update(id, input)
        await this.inMemoryService.update(id, updatedLibrary)
        return updatedLibrary
    }

    async delete(id: string): Promise<boolean> {
        const success = await this.persistentService.delete(id)
        if (success) {
            await this.inMemoryService.delete(id)
        }
        return success
    }

    async getAll(): Promise<Library[]> {
        return this.inMemoryService.getAll()
    }

    async getById(id: string): Promise<Library | undefined> {
        return this.inMemoryService.getById(id)
    }
}