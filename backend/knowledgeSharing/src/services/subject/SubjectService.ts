import { Subject } from '../../domain/entities/Subject'
import { PersistentSubjectService } from './PersistentSubjectService'
import { InMemorySubjectService } from './InMemorySubjectService'

export class SubjectService {
    private static persistentService = new PersistentSubjectService()
    private static inMemoryService = new InMemorySubjectService()
    
    private persistentService: PersistentSubjectService
    private inMemoryService: InMemorySubjectService

    constructor() {
        this.persistentService = new PersistentSubjectService()
        this.inMemoryService = new InMemorySubjectService()
    }

    public static async loadSubjects(): Promise<Subject[]> {
        // Load from TypeORM
        const subjects = await this.persistentService.loadAll()
        
        // Initialize in-memory array
        await this.inMemoryService.initializeWithData(subjects)
        
        return subjects
    }

    async create(input: Partial<Subject>): Promise<Subject> {
        const savedSubject = await this.persistentService.save(input)
        await this.inMemoryService.create(savedSubject)
        return savedSubject
    }

    async update(id: string, input: Partial<Subject>): Promise<Subject> {
        const updatedSubject = await this.persistentService.update(id, input)
        await this.inMemoryService.update(id, updatedSubject)
        return updatedSubject
    }

    async delete(id: string): Promise<boolean> {
        const success = await this.persistentService.delete(id)
        if (success) {
            await this.inMemoryService.delete(id)
        }
        return success
    }

    async getAll(): Promise<Subject[]> {
        return this.inMemoryService.getAll()
    }

    async getById(id: string): Promise<Subject | undefined> {
        return this.inMemoryService.getById(id)
    }

    async getByLibraryId(libraryId: string): Promise<Subject[]> {
        return this.getAll().then(subjects => 
            subjects.filter(subject => subject.libraryId === libraryId)
        )
    }
} 