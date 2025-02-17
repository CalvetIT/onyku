import { AppDataSource } from '../../typeorm/data-source'
import { QuestionEntity } from '../../typeorm/entity/Question'
import { Question } from '../../domain/entities/Question'
import { v4 as uuidv4 } from 'uuid'

export class PersistentQuestionService {
    private repository = AppDataSource.getRepository(QuestionEntity)

    private toEntity(question: Partial<Question>): QuestionEntity {
        const entity = new QuestionEntity()
        entity.id = this.isValidUUID(question.id) ? question.id! : uuidv4()
        entity.question = question.question!
        entity.notes = question.notes
        entity.subjectId = question.subjectId
        entity.potentialReplies = question.potentialReplies
        entity.potentialKeyConsiderations = question.potentialKeyConsiderations
        entity.relatedConcepts = question.relatedConcepts
        return entity
    }

    private isValidUUID(uuid: string | undefined): boolean {
        if (!uuid) return false
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        return uuidRegex.test(uuid)
    }

    async save(input: Partial<Question>): Promise<Question> {
        const entity = this.toEntity(input)
        return await this.repository.save(entity)
    }

    async update(id: string, input: Partial<Question>): Promise<Question> {
        await this.repository.update(id, this.toEntity({ ...input, id }))
        const updated = await this.repository.findOne({ where: { id } })
        if (!updated) throw new Error('Question not found after update')
        return updated
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id)
        return result.affected ? result.affected > 0 : false
    }

    async getAll(): Promise<Question[]> {
        return await this.repository.find()
    }

    async getById(id: string): Promise<Question | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async loadAll(): Promise<Question[]> {
        return await this.repository.find()
    }
} 