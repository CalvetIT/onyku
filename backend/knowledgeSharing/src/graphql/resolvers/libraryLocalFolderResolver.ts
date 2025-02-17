import { GraphQLID, GraphQLNonNull, GraphQLString } from 'graphql'
import { LibraryLocalFolderService } from '../../services/libraryLocalFolder/LibraryLocalFolderService'
import { TaskType } from '../types/TaskType'
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'
import { IdConflictPolicyType } from '../types/IdConflictPolicyType'

const libraryLocalFolderService = new LibraryLocalFolderService()

export const libraryLocalFolderResolvers = {
    mutations: {
        exportLibraryCopy: {
            type: TaskType,
            args: {
                libraryId: { type: new GraphQLNonNull(GraphQLID) },
                folderPath: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_: any, { libraryId, folderPath }: { libraryId: string, folderPath: string }) => {
                return await libraryLocalFolderService.exportLibraryCopy(libraryId, folderPath)
            }
        },

        exportLibraryClone: {
            type: TaskType,
            args: {
                libraryId: { type: new GraphQLNonNull(GraphQLID) },
                folderPath: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_: any, { libraryId, folderPath }: { libraryId: string, folderPath: string }) => {
                return await libraryLocalFolderService.exportLibraryClone(libraryId, folderPath)
            }
        },

        importLibraryCopy: {
            type: TaskType,
            args: {
                folderPath: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: async (_: any, { folderPath }: { folderPath: string }) => {
                return await libraryLocalFolderService.importLibraryCopy(folderPath)
            }
        },

        importLibraryClone: {
            type: TaskType,
            args: {
                folderPath: { type: new GraphQLNonNull(GraphQLString) },
                idConflictPolicy: { type: IdConflictPolicyType, defaultValue: IdConflictPolicy.DO_NOT_MERGE }
            },
            resolve: async (_: any, { folderPath, idConflictPolicy }: { folderPath: string, idConflictPolicy: IdConflictPolicy }) => {
                return await libraryLocalFolderService.importLibraryClone(folderPath, idConflictPolicy)
            }
        }
    }
} 