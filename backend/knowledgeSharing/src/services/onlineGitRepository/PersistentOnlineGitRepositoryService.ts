import { AppDataSource } from '../../typeorm/data-source'
import { OnlineGitRepositorySpecificationTypeOrmEntity } from '../../typeorm/entity/OnlineGitRepositorySpecificationTypeOrmEntity'
import { OnlineGitRepositorySpecification } from '../../domain/entities/OnlineGitRepositorySpecification'

export class PersistentOnlineGitRepositoryService {
    private repository = AppDataSource.getRepository(OnlineGitRepositorySpecificationTypeOrmEntity)

    private toDomainEntity(entity: OnlineGitRepositorySpecificationTypeOrmEntity): OnlineGitRepositorySpecification {
        const spec = new OnlineGitRepositorySpecification({
            libraryId: entity.libraryId,
            distributionMethod: entity.distributionMethod,
            provider: entity.provider,
            repositoryUrl: entity.repositoryUrl,
            visibility: entity.visibility,
        })
        spec.id = entity.id
        spec.personalAccessTokenEncrypted = entity.personalAccessTokenEncrypted
        spec.createdAt = entity.createdAt
        spec.lastSyncAt = entity.lastSyncAt
        return spec
    }

    async save(specification: OnlineGitRepositorySpecification): Promise<void> {
        const entity = this.repository.create(specification)
        await this.repository.save(entity)
    }

    async update(specification: OnlineGitRepositorySpecification): Promise<void> {
        await this.repository.save(specification)
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id)
    }

    async getAll(): Promise<OnlineGitRepositorySpecification[]> {
        const entities = await this.repository.find()
        return entities.map(entity => this.toDomainEntity(entity))
    }

    async getById(id: string): Promise<OnlineGitRepositorySpecification | null> {
        const entity = await this.repository.findOne({ where: { id } })
        return entity ? this.toDomainEntity(entity) : null
    }

    async getByLibraryId(libraryId: string): Promise<OnlineGitRepositorySpecification | null> {
        const entity = await this.repository.findOne({ where: { libraryId } })
        return entity ? this.toDomainEntity(entity) : null
    }

    async loadOnlineGitRepositorySpecifications(): Promise<OnlineGitRepositorySpecification[]> {
        const entities = await this.repository.find()
        return entities.map(entity => this.toDomainEntity(entity))
    }
} 