import { GraphQLEnumType } from 'graphql'
import { GitProvider } from '../../domain/enums/GitProvider'
import { Visibility } from '../../domain/enums/Visibility'
import { DistributionMethod } from '../../domain/enums/DistributionMethod'

export const GitProviderType = new GraphQLEnumType({
    name: 'GitProvider',
    description: 'Available Git providers',
    values: {
        GITHUB: { value: GitProvider.GITHUB },
        GITLAB: { value: GitProvider.GITLAB }
    }
})

export const VisibilityType = new GraphQLEnumType({
    name: 'Visibility',
    description: 'Repository visibility options',
    values: {
        PUBLIC: { value: Visibility.PUBLIC },
        PRIVATE: { value: Visibility.PRIVATE }
    }
})

export const DistributionMethodType = new GraphQLEnumType({
    name: 'DistributionMethod',
    description: 'Method of library distribution',
    values: {
        PUBLISHED: { value: DistributionMethod.PUBLISHED },
        SUBSCRIBED: { value: DistributionMethod.SUBSCRIBED }
    }
}) 