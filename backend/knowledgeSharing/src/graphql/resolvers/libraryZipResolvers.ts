import { GraphQLID, GraphQLNonNull } from 'graphql'
import { LibraryZipService } from '../../services/libraryZip/LibraryZipService'
import { TaskType } from '../types/TaskType'
import { TransferFileMetadataType } from '../types/TransferFileMetadataType'
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'
import { IdConflictPolicyType } from '../types/IdConflictPolicyType'

const libraryZipService = new LibraryZipService()

export const libraryZipResolvers = {
    mutations: {
        importLibraryCloneFromZip: {
            type: TaskType,
            args: {
                transferFileId: { type: new GraphQLNonNull(GraphQLID) },
                idConflictPolicy: { type: IdConflictPolicyType, defaultValue: IdConflictPolicy.DO_NOT_MERGE }
            },
            resolve: async (_: any, { transferFileId, idConflictPolicy }: { transferFileId: string, idConflictPolicy: IdConflictPolicy }) => {
                return await libraryZipService.importLibraryCloneFromUploadedZipFile(transferFileId, idConflictPolicy)
            }
        },

        importLibraryCopyFromZip: {
            type: TaskType,
            args: {
                transferFileId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_: any, { transferFileId }: { transferFileId: string }) => {
                return await libraryZipService.importLibraryCopyFromUploadedZipFile(transferFileId)
            }
        },

        exportLibraryCopyAsZip: {
            type: TransferFileMetadataType,
            args: {
                libraryId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_: any, { libraryId }: { libraryId: string }) => {
                return await libraryZipService.exportLibraryCopyForDownloadAsZipFile(libraryId)
            }
        },

        exportLibraryCloneAsZip: {
            type: TransferFileMetadataType,
            args: {
                libraryId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_: any, { libraryId }: { libraryId: string }) => {
                return await libraryZipService.exportLibraryCloneForDownloadAsZipFile(libraryId)
            }
        }
    }
} 