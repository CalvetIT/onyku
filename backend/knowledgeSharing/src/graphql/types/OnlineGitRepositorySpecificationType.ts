import { GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLID } from 'graphql'
import { GitProviderType, VisibilityType, DistributionMethodType } from './SharedEnumTypes'

export const OnlineGitRepositorySpecificationType = new GraphQLObjectType({
    name: 'OnlineGitRepositorySpecification',
    description: 'Specification for an online git repository',
    fields: {
        id: { 
            type: new GraphQLNonNull(GraphQLID),
            description: 'Unique identifier of the specification'
        },
        libraryId: { 
            type: new GraphQLNonNull(GraphQLID),
            description: 'ID of the associated library'
        },
        provider: { 
            type: new GraphQLNonNull(GitProviderType),
            description: 'Git provider (GitHub, GitLab, etc.)'
        },
        repositoryUrl: { 
            type: new GraphQLNonNull(GraphQLString),
            description: 'URL of the git repository'
        },
        personalAccessTokenEncrypted: { 
            type: GraphQLString,
            description: 'Encrypted personal access token (optional for public repositories)'
        },
        visibility: { 
            type: new GraphQLNonNull(VisibilityType),
            description: 'Repository visibility (public/private)'
        },
        distributionMethod: {
            type: new GraphQLNonNull(DistributionMethodType),
            description: 'Method of distribution (PUBLISHED/SUBSCRIBED)'
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'Creation timestamp'
        },
        lastSyncAt: {
            type: GraphQLString,
            description: 'Last synchronization timestamp'
        }
    }
}) 