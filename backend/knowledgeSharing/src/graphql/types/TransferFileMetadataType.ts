import { 
    GraphQLObjectType, 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID,
    GraphQLInt,
    GraphQLBoolean
} from 'graphql'

export const TransferFileMetadataType = new GraphQLObjectType({
    name: 'TransferFileMetadata',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        filename: { type: new GraphQLNonNull(GraphQLString) },
        mimeType: { type: new GraphQLNonNull(GraphQLString) },
        size: { type: new GraphQLNonNull(GraphQLInt) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        isServerGenerated: { type: new GraphQLNonNull(GraphQLBoolean) }
    }
}) 