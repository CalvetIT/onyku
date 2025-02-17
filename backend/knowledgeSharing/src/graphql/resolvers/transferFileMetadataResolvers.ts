import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLBoolean } from 'graphql'
import { TransferFileService } from '../../services/transferFile/TransferFileService'
import { TransferFileMetadataType } from '../types/TransferFileMetadataType'

const transferFileService = new TransferFileService()

export const transferFileMetadataResolvers = {
    queries: {
        getTransferFileMetadata: {
            type: TransferFileMetadataType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (_: any, { id }: { id: string }) => 
                transferFileService.getById(id)
        },
        getTransferFileMetadatas: {
            type: new GraphQLList(new GraphQLNonNull(TransferFileMetadataType)),
            resolve: () => 
                transferFileService.getAll()
        }
    },
    mutations: {
        deleteTransferFile: {
            type: GraphQLBoolean,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_: any, { id }: { id: string }) => {
                try {
                    await transferFileService.deleteFile(id)
                    return true
                } catch (error) {
                    console.error('Delete error:', error)
                    return false
                }
            }
        }
    }
} 