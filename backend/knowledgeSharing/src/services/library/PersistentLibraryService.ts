import { AppDataSource } from '../../typeorm/data-source'
import { LibraryEntity } from '../../typeorm/entity/Library'
import { Library } from '../../domain/entities/Library'

export class PersistentLibraryService {
    private repository = AppDataSource.getRepository(LibraryEntity)

    async save(input: Partial<Library>): Promise<Library> {
        const libraryEntity = this.repository.create(input)
        return await this.repository.save(libraryEntity)
    }

    async update(id: string, input: Partial<Library>): Promise<Library> {
        await this.repository.update(id, input)
        const updated = await this.repository.findOne({ where: { id } })
        if (!updated) throw new Error('Library not found after update')
        return updated
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.repository.delete(id)
        return result.affected ? result.affected > 0 : false
    }

    async getAll(): Promise<Library[]> {
        return await this.repository.find()
    }

    async getById(id: string): Promise<Library | null> {
        return await this.repository.findOne({ where: { id } })
    }

    async loadAll(): Promise<Library[]> {
        return await this.repository.find()
    }
} 