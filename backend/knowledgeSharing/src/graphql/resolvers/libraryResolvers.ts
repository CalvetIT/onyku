import { GraphQLNonNull, GraphQLList, GraphQLID, GraphQLBoolean } from 'graphql'
import { LibraryType, LibraryInput } from '../types/LibraryType'
import { LibraryService } from '../../services/library/LibraryService'

const libraryService = new LibraryService()

export const libraryResolvers = {
    queries: {
        getLibraries: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(LibraryType))),
            resolve: () => libraryService.getAll()
        },
        getLibrary: {
            type: LibraryType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_source: any, { id }: { id: string }) => 
                libraryService.getById(id)
        }
    },

    mutations: {
        createLibrary: {
            type: LibraryType,
            args: {
                input: { type: new GraphQLNonNull(LibraryInput) }
            },
            resolve: async (_source: any, { input }: { input: any }) => {
                return await libraryService.create(input)
            }
        },
        updateLibrary: {
            type: LibraryType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: { type: new GraphQLNonNull(LibraryInput) }
            },
            resolve: async (_source: any, { id, input }: { id: string, input: any }) => {
                return await libraryService.update(id, input)
            }
        },
        deleteLibrary: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_source: any, { id }: { id: string }) => {
                return await libraryService.delete(id)
            }
        }
    }
} 