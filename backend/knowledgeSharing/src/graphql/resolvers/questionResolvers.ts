import { GraphQLNonNull, GraphQLList, GraphQLID, GraphQLBoolean } from 'graphql'
import { QuestionType, QuestionInput } from '../types/QuestionType'
import { QuestionService } from '../../services/question/QuestionService'

const questionService = new QuestionService()

export const questionResolvers = {
    queries: {
        getQuestions: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionType))),
            resolve: async () => {
                const questions = await questionService.getAll()
                return questions.map(q => ({
                    ...q,
                    relatedConcepts: q.relatedConcepts || [],
                    potentialReplies: q.potentialReplies || [],
                    potentialKeyConsiderations: q.potentialKeyConsiderations || []
                }))
            }
        },
        getQuestion: {
            type: QuestionType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_source: any, { id }: { id: string }) => {
                const question = await questionService.getById(id)
                if (!question) return null
                return {
                    ...question,
                    relatedConcepts: question.relatedConcepts || [],
                    potentialReplies: question.potentialReplies || [],
                    potentialKeyConsiderations: question.potentialKeyConsiderations || []
                }
            }
        }
    },

    mutations: {
        createQuestion: {
            type: QuestionType,
            args: {
                input: { type: new GraphQLNonNull(QuestionInput) }
            },
            resolve: async (_source: any, { input }: { input: any }) => {
                const question = await questionService.create(input)
                return {
                    ...question,
                    relatedConcepts: question.relatedConcepts || [],
                    potentialReplies: question.potentialReplies || [],
                    potentialKeyConsiderations: question.potentialKeyConsiderations || []
                }
            }
        },
        updateQuestion: {
            type: QuestionType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: { type: new GraphQLNonNull(QuestionInput) }
            },
            resolve: async (_source: any, { id, input }: { id: string, input: any }) => {
                console.log('4. Resolver updateQuestion - Input:', { id, input })
                
                const question = await questionService.update(id, input)
                console.log('5. Resolver updateQuestion - After service:', question)
                
                const result = {
                    ...question,
                    relatedConcepts: question.relatedConcepts || [],
                    potentialReplies: question.potentialReplies || [],
                    potentialKeyConsiderations: question.potentialKeyConsiderations || []
                }
                
                console.log('6. Resolver updateQuestion - Final result:', result)
                return result
            }
        },
        deleteQuestion: {
            type: new GraphQLNonNull(GraphQLBoolean),
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: async (_source: any, { id }: { id: string }) => {
                return await questionService.delete(id)
            }
        }
    }
} 