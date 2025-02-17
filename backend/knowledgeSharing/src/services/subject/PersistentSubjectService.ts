import { AppDataSource } from '../../typeorm/data-source'
import { SubjectEntity } from '../../typeorm/entity/Subject'
import { Subject } from '../../domain/entities/Subject'

export class PersistentSubjectService {
    private repository = AppDataSource.getRepository(SubjectEntity)

    async save(input: Partial<Subject>): Promise<Subject> {
        const subjectEntity = this.repository.create(input)
        return await this.repository.save(subjectEntity)
    }

    async update(id: string, input: Partial<Subject>): Promise<Subject> {
        await this.repository.update(id, input)
        const updated = await this.repository.findOne({ where: { id } })
        if (!updated) throw new Error('Subject not found after update')
        return updated
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id)
        return result.affected ? result.affected > 0 : false
    }

    async getAll(): Promise<Subject[]> {
        return await this.repository.find()
    }

    async getById(id: string): Promise<Subject | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async loadAll(): Promise<Subject[]> {
        return await this.repository.find()
    }
} 