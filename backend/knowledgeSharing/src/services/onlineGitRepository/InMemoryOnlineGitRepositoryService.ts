import { OnlineGitRepositorySpecification } from '../../domain/entities/OnlineGitRepositorySpecification'
import { GitProvider } from '../../domain/enums/GitProvider'
import { Visibility } from '../../domain/enums/Visibility'
import { DistributionMethod } from '../../domain/enums/DistributionMethod'
import { onlineGitRepositorySpecifications } from '../../index'

export class InMemoryOnlineGitRepositoryService {
    async createPublishedSpecification(params: {
        libraryId: string
        provider: GitProvider
        repositoryUrl: string
        personalAccessToken: string
        visibility: Visibility
    }): Promise<OnlineGitRepositorySpecification> {
        const specification = new OnlineGitRepositorySpecification({
            ...params,
            distributionMethod: DistributionMethod.PUBLISHED
        })
        onlineGitRepositorySpecifications.push(specification)
        return specification
    }

    async create(specification: OnlineGitRepositorySpecification): Promise<OnlineGitRepositorySpecification> {
        onlineGitRepositorySpecifications.push(specification)
        return specification
    }

    async update(id: string, updatedSpecification: OnlineGitRepositorySpecification): Promise<OnlineGitRepositorySpecification> {
        const index = onlineGitRepositorySpecifications.findIndex(spec => spec.id === id)
        if (index === -1) throw new Error('Specification not found')
        
        onlineGitRepositorySpecifications[index] = updatedSpecification
        return onlineGitRepositorySpecifications[index]
    }

    async delete(id: string): Promise<boolean> {
        const index = onlineGitRepositorySpecifications.findIndex(spec => spec.id === id)
        if (index === -1) return false
        
        onlineGitRepositorySpecifications.splice(index, 1)
        return true
    }

    async getAll(): Promise<OnlineGitRepositorySpecification[]> {
        return onlineGitRepositorySpecifications
    }

    async getById(id: string): Promise<OnlineGitRepositorySpecification | undefined> {
        return onlineGitRepositorySpecifications.find(spec => spec.id === id)
    }

    async getByLibraryId(libraryId: string): Promise<OnlineGitRepositorySpecification | undefined> {
        return onlineGitRepositorySpecifications.find(spec => spec.libraryId === libraryId)
    }

    async initializeWithData(loadedSpecifications: OnlineGitRepositorySpecification[]): Promise<void> {
        // Clear existing data
        onlineGitRepositorySpecifications.length = 0
        // Add new data
        onlineGitRepositorySpecifications.push(...loadedSpecifications)
    }

    async createSubscribedSpecification(params: {
        provider: GitProvider
        repositoryUrl: string
        personalAccessToken?: string // Optional for public repos
        visibility: Visibility // Let the user specify if it's public or private
    }): Promise<OnlineGitRepositorySpecification> {
        // Validate that private repos have a token
        if (params.visibility === Visibility.PRIVATE && !params.personalAccessToken) {
            throw new Error('Personal access token is required for private repositories')
        }

        const specification = new OnlineGitRepositorySpecification({
            ...params,
            libraryId: '', // Will be populated later
            distributionMethod: DistributionMethod.SUBSCRIBED,
            personalAccessToken: params.personalAccessToken || '', // Empty string for public repos
            visibility: params.visibility
        })
        onlineGitRepositorySpecifications.push(specification)
        return specification
    }
} 