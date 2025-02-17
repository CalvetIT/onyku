import { PersistentQuestionService } from './PersistentQuestionService'
import { InMemoryQuestionService } from './InMemoryQuestionService'
import { Question } from '../../domain/entities/Question'

export class QuestionService {
    private static persistentService = new PersistentQuestionService()
    private static inMemoryService = new InMemoryQuestionService()
    
    private persistentService: PersistentQuestionService
    private inMemoryService: InMemoryQuestionService

    constructor() {
        this.persistentService = new PersistentQuestionService()
        this.inMemoryService = new InMemoryQuestionService()
    }

    public static async loadQuestions(): Promise<Question[]> {
        // Load from TypeORM
        const questions = await this.persistentService.loadAll()
        
        // Initialize in-memory array
        await this.inMemoryService.initializeWithData(questions)
        
        return questions
    }

    async create(input: Partial<Question>): Promise<Question> {
        const savedQuestion = await this.persistentService.save(input)
        await this.inMemoryService.create(savedQuestion)
        return savedQuestion
    }

    async update(id: string, input: Partial<Question>): Promise<Question> {
        const updatedQuestion = await this.persistentService.update(id, input)
        await this.inMemoryService.update(id, updatedQuestion)
        return updatedQuestion
    }

    async delete(id: string): Promise<boolean> {
        const success = await this.persistentService.delete(id)
        if (success) {
            await this.inMemoryService.delete(id)
        }
        return success
    }

    async getAll(): Promise<Question[]> {
        return this.inMemoryService.getAll()
    }

    async getById(id: string): Promise<Question | undefined> {
        return this.inMemoryService.getById(id)
    }

    async getBySubjectId(subjectId: string): Promise<Question[]> {
        return this.getAll().then(questions => 
            questions.filter(question => question.subjectId === subjectId)
        )
    }
} 