import { GraphQLObjectType, GraphQLSchema } from 'graphql'
import { questionResolvers } from './resolvers/questionResolvers'
import { libraryResolvers } from './resolvers/libraryResolvers'
import { subjectResolvers } from './resolvers/subjectResolvers'
import { onlineGitRepositoryResolvers } from './resolvers/onlineGitRepositoryResolvers'
import { transferFileMetadataResolvers } from './resolvers/transferFileMetadataResolvers'
import { libraryZipResolvers } from './resolvers/libraryZipResolvers'

const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        ...questionResolvers.queries,
        ...libraryResolvers.queries,
        ...subjectResolvers.queries,
        ...onlineGitRepositoryResolvers.queries,
        ...transferFileMetadataResolvers.queries
        // libraryZipResolvers doesn't have queries
    }
})

const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        ...questionResolvers.mutations,
        ...libraryResolvers.mutations,
        ...subjectResolvers.mutations,
        ...onlineGitRepositoryResolvers.mutations,
        ...transferFileMetadataResolvers.mutations,
        ...libraryZipResolvers.mutations
    }
})

export const schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
})