import { GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } from 'graphql'
import { GitProviderType, VisibilityType } from '../types/SharedEnumTypes'
import { GitProvider } from '../../domain/enums/GitProvider'
import { Visibility } from '../../domain/enums/Visibility'
import { OnlineGitRepositoryService } from '../../services/onlineGitRepository/OnlineGitRepositoryService'
import { TaskType } from '../types/TaskType'
import { OnlineGitRepositorySpecificationType } from '../types/OnlineGitRepositorySpecificationType'

const onlineGitRepositoryService = new OnlineGitRepositoryService()

export const onlineGitRepositoryResolvers = {
    queries: {
        getOnlineGitRepositorySpecifications: {
            type: new GraphQLList(OnlineGitRepositorySpecificationType),
            description: 'Get all online git repository specifications',
            resolve: () => onlineGitRepositoryService.getAll()
        },
        getOnlineGitRepositorySpecification: {
            type: OnlineGitRepositorySpecificationType,
            description: 'Get an online git repository specification by ID',
            args: {
                id: { 
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'ID of the specification to retrieve'
                }
            },
            resolve: (_: any, { id }: { id: string }) => 
                onlineGitRepositoryService.getById(id)
        },
        getOnlineGitRepositorySpecificationByLibrary: {
            type: OnlineGitRepositorySpecificationType,
            description: 'Get an online git repository specification by library ID',
            args: {
                libraryId: { 
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'ID of the library to find specification for'
                }
            },
            resolve: (_: any, { libraryId }: { libraryId: string }) => 
                onlineGitRepositoryService.getByLibraryId(libraryId)
        }
    },

    mutations: {
        publishLibraryToGit: {
            type: TaskType,
            description: 'Publish a library to a Git repository',
            args: {
                libraryId: { 
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'ID of the library to publish'
                },
                provider: { 
                    type: GitProviderType,
                    defaultValue: GitProvider.GITHUB,
                    description: 'Git provider to use (defaults to GITHUB)'
                },
                repositoryUrl: { 
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'URL of the Git repository'
                },
                personalAccessToken: { 
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'Personal access token for authentication'
                },
                visibility: { 
                    type: VisibilityType,
                    defaultValue: Visibility.PRIVATE,
                    description: 'Repository visibility (defaults to PRIVATE)'
                }
            },
            resolve: async (_: any, args: {
                libraryId: string
                provider: GitProvider
                repositoryUrl: string
                personalAccessToken: string
                visibility: Visibility
            }) => {
                return await onlineGitRepositoryService.publishLibrary(args)
            }
        },

        subscribeToLibraryFromGit: {
            type: TaskType,
            description: 'Subscribe to a library from a Git repository',
            args: {
                provider: { 
                    type: GitProviderType,
                    defaultValue: GitProvider.GITHUB,
                    description: 'Git provider to use (defaults to GITHUB)'
                },
                repositoryUrl: { 
                    type: new GraphQLNonNull(GraphQLString),
                    description: 'URL of the Git repository'
                },
                personalAccessToken: { 
                    type: GraphQLString,
                    description: 'Personal access token for authentication (required for private repositories)'
                },
                visibility: { 
                    type: VisibilityType,
                    defaultValue: Visibility.PUBLIC,
                    description: 'Repository visibility (defaults to PUBLIC)'
                }
            },
            resolve: async (_: any, args: {
                provider: GitProvider
                repositoryUrl: string
                personalAccessToken?: string
                visibility: Visibility
            }) => {
                return await onlineGitRepositoryService.subscribeToLibrary(args)
            }
        },

        pushLibraryUpdatesToGit: {
            type: TaskType,
            description: 'Push local library updates to its associated Git repository',
            args: {
                libraryId: { 
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'ID of the library to push updates for'
                }
            },
            resolve: async (_: any, args: { libraryId: string }) => {
                return await onlineGitRepositoryService.pushLibraryUpdates(args.libraryId)
            }
        },

        pullLibraryUpdatesFromGit: {
            type: TaskType,
            description: 'Pull updates from a Git repository for a subscribed library',
            args: {
                libraryId: { 
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'ID of the library to pull updates for'
                }
            },
            resolve: async (_: any, args: { libraryId: string }) => {
                return await onlineGitRepositoryService.pullLibraryUpdates(args.libraryId)
            }
        }
    }
} 