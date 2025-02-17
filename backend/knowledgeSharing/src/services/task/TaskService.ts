import { Task } from '../../domain/entities/Task'
import { InMemoryTaskService } from './InMemoryTaskService'
import { PersistentTaskService } from './PersistentTaskService'

export class TaskService {
    private static inMemoryService = new InMemoryTaskService()
    private static persistentService = new PersistentTaskService()
    private inMemoryService: InMemoryTaskService
    private persistentService: PersistentTaskService

    constructor() {
        this.inMemoryService = new InMemoryTaskService()
        this.persistentService = new PersistentTaskService()
    }

    async createTask(task: Task): Promise<Task> {
        const createdTask = this.inMemoryService.createTask(task)
        await this.persistentService.createTask(task)
        return createdTask
    }

    async getTaskById(id: string): Promise<Task | undefined> {
        return this.inMemoryService.getTaskById(id)
    }

    getTasks(): Task[] {
        return this.inMemoryService.getTasks()
    }

    async updateTask(task: Task): Promise<void> {
        this.inMemoryService.updateTask(task)
        await this.persistentService.updateTask(task)
    }

    async deleteTask(id: string): Promise<void> {
        this.inMemoryService.deleteTask(id)
        await this.persistentService.deleteTask(id)
    }

    static async loadTasks(): Promise<Task[]> {
        // Load from TypeORM
        const tasks = await this.persistentService.getTasks()
        
        // Initialize in-memory array
        await this.inMemoryService.initializeWithData(tasks)
        
        return tasks
    }
} 