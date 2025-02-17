import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInputObjectType } from 'graphql'

export const SubjectType = new GraphQLObjectType({
    name: 'Subject',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        libraryId: { type: GraphQLString }
    }
})

export const SubjectInput = new GraphQLInputObjectType({
    name: 'SubjectInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        libraryId: { type: GraphQLString }
    }
}) 