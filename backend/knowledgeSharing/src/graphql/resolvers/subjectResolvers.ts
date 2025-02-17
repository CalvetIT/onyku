import { GraphQLNonNull, GraphQLList, GraphQLID, GraphQLBoolean } from 'graphql'
import { SubjectType, SubjectInput } from '../types/SubjectType'
import { SubjectService } from '../../services/subject/SubjectService'

const subjectService = new SubjectService()

export const subjectResolvers = {
    queries: {
        getSubjects: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(SubjectType))),
            resolve: () => subjectService.getAll()
        },
        getSubject: {
            type: SubjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_source: any, { id }: { id: string }) => 
                subjectService.getById(id)
        }
    },

    mutations: {
        createSubject: {
            type: SubjectType,
            args: {
                input: { type: new GraphQLNonNull(SubjectInput) }
            },
            resolve: async (_source: any, { input }: { input: any }) => {
                return await subjectService.create(input)
            }
        },
        updateSubject: {
            type: SubjectType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: { type: new GraphQLNonNull(SubjectInput) }
            },
            resolve: async (_source: any, { id, input }: { id: string, input: any }) => {
                return await subjectService.update(id, input)
            }
        },
        deleteSubject: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_source: any, { id }: { id: string }) => {
                return await subjectService.delete(id)
            }
        }
    }
} 