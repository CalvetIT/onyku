import { AppDataSource } from '../../typeorm/data-source'
import { Task } from '../../domain/entities/Task'
import { TaskTypeOrmEntity } from '../../typeorm/entity/TaskTypeOrmEntity'

export class PersistentTaskService {
    private repository = AppDataSource.getRepository(TaskTypeOrmEntity)

    async createTask(task: Task): Promise<Task> {
        return await this.repository.save(task)
    }

    async getTaskById(id: string): Promise<Task | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async getTasks(): Promise<Task[]> {
        return await this.repository.find()
    }

    async updateTask(task: Task): Promise<void> {
        await this.repository.save(task)
    }

    async deleteTask(id: string): Promise<void> {
        await this.repository.delete(id)
    }
} 