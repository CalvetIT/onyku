import { v4 as uuidv4 } from 'uuid'
import { encrypt, decrypt } from '../../utils/encryption'
import { GitProvider } from '../enums/GitProvider'
import { Visibility } from '../enums/Visibility'
import { DistributionMethod } from '../enums/DistributionMethod'

export class OnlineGitRepositorySpecification {
    id: string
    libraryId: string
    distributionMethod: DistributionMethod
    provider: GitProvider
    repositoryUrl: string
    personalAccessTokenEncrypted?: string
    visibility: Visibility
    createdAt: Date
    lastSyncAt?: Date

    constructor(params: {
        libraryId: string
        distributionMethod: DistributionMethod
        provider: GitProvider
        repositoryUrl: string
        personalAccessToken?: string
        visibility: Visibility
    }) {
        this.id = uuidv4()
        this.libraryId = params.libraryId
        this.distributionMethod = params.distributionMethod
        this.provider = params.provider
        this.repositoryUrl = params.repositoryUrl
        this.personalAccessTokenEncrypted = params.personalAccessToken ? encrypt(params.personalAccessToken) : undefined
        this.visibility = params.visibility
        this.createdAt = new Date()
    }

    getAuthUrl(): string {
        // For public repos without token, return the original URL
        if (this.visibility === Visibility.PUBLIC && !this.personalAccessTokenEncrypted) {
            return this.repositoryUrl
        }

        // For repos with token (public or private), add authentication
        const token = decrypt(this.personalAccessTokenEncrypted!)
        switch (this.provider) {
            case GitProvider.GITHUB:
                return this.repositoryUrl.replace('https://', `https://${token}@`)
            case GitProvider.GITLAB:
                return this.repositoryUrl.replace('https://', `https://oauth2:${token}@`)
            default:
                throw new Error(`Unsupported git provider: ${this.provider}`)
        }
    }
} 