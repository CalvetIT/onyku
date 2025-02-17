import { 
    GraphQLObjectType, 
    GraphQLInputObjectType, 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLEnumType 
} from 'graphql'

// Enums
export const VisibilityEnum = new GraphQLEnumType({
    name: 'Visibility',
    values: {
        PUBLIC: { value: 'PUBLIC' },
        PRIVATE: { value: 'PRIVATE' }
    }
})

export const GitProviderEnum = new GraphQLEnumType({
    name: 'GitProvider',
    values: {
        GITHUB: { value: 'GITHUB' },
        GITLAB: { value: 'GITLAB' }
    }
})

export const DistributionMethodEnum = new GraphQLEnumType({
    name: 'DistributionMethod',
    values: {
        PUBLISHED: { value: 'PUBLISHED' },
        SUBSCRIBED: { value: 'SUBSCRIBED' }
    }
})

// Main Types
export const GitLibraryDistributionSpecificationType = new GraphQLObjectType({
    name: 'GitLibraryDistributionSpecification',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        libraryId: { type: new GraphQLNonNull(GraphQLString) },
        distributionMethod: { type: DistributionMethodEnum },
        provider: { type: GitProviderEnum },
        repositoryUrl: { type: GraphQLString },
        repositoryLocalPath: { type: GraphQLString },
        personalAccessTokenEncrypted: { type: new GraphQLNonNull(GraphQLString) },
        visibility: { type: VisibilityEnum },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        lastSyncAt: { type: GraphQLString }
    }
})

// Input for publishing
export const PublishLibraryInput = new GraphQLInputObjectType({
    name: 'PublishLibraryInput',
    fields: {
        libraryId: { type: new GraphQLNonNull(GraphQLString) },
        token: { type: new GraphQLNonNull(GraphQLString) },
        repositoryName: { type: new GraphQLNonNull(GraphQLString) },
        repositoryOwner: { type: new GraphQLNonNull(GraphQLString) },
        visibility: { type: VisibilityEnum, defaultValue: 'PRIVATE' },
        provider: { type: GitProviderEnum, defaultValue: 'GITHUB' }
    }
})

// Input for subscribing
export const SubscribeToLibraryInput = new GraphQLInputObjectType({
    name: 'SubscribeToLibraryInput',
    fields: {
        repositoryUrl: { type: new GraphQLNonNull(GraphQLString) },
        token: { type: new GraphQLNonNull(GraphQLString) },
        provider: { type: GitProviderEnum, defaultValue: 'GITHUB' }
    }
}) 