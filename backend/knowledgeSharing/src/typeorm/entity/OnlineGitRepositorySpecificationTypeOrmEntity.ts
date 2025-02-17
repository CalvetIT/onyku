import { Entity, PrimaryColumn, Column } from 'typeorm'
import { GitProvider } from '../../domain/enums/GitProvider'
import { Visibility } from '../../domain/enums/Visibility'
import { DistributionMethod } from '../../domain/enums/DistributionMethod'

@Entity('online_git_repository_specification')
export class OnlineGitRepositorySpecificationTypeOrmEntity {
    @PrimaryColumn()
    id: string

    @Column()
    libraryId: string

    @Column({
        type: "enum",
        enum: GitProvider
    })
    provider: GitProvider

    @Column()
    repositoryUrl: string

    @Column({ nullable: true })
    personalAccessTokenEncrypted?: string

    @Column({
        type: "enum",
        enum: Visibility
    })
    visibility: Visibility

    @Column({
        type: "enum",
        enum: DistributionMethod
    })
    distributionMethod: DistributionMethod

    @Column()
    createdAt: Date

    @Column({ nullable: true })
    lastSyncAt?: Date
} 