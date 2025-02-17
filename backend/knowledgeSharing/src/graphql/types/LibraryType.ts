import { 
    GraphQLObjectType, 
    GraphQLInputObjectType,
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID 
} from 'graphql'

export const LibraryType = new GraphQLObjectType({
    name: 'Library',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        maintainer: { type: GraphQLString }
    }
})

export const LibraryInput = new GraphQLInputObjectType({
    name: 'LibraryInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        maintainer: { type: GraphQLString }
    }
}) 