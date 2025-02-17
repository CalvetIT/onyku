import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GraphQLClient, gql } from 'graphql-request'

const API_URL = 'http://localhost:4000/graphql'
const graphQLClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
})

// Get all questions
export function useGetQuestions() {
  return useQuery<any[]>({
    queryKey: ['questions'],
    queryFn: async () => {
      const { getQuestions } = await graphQLClient.request(gql`
        query GetQuestions {
          getQuestions {
            id
            question
            subjectId
            relatedConcepts {
              searchQueryDefinition
              relationDescription
            }
            notes
            potentialReplies {
              exampleReply
              potentialRequirements
              potentialConstraints
              potentialAssumptions
              potentialRisks
              arguments {
                argument
                qualityImpacts {
                  quality
                  impact
                  notes
                }
              }
            }
            potentialKeyConsiderations {
              description
              externalReferences
            }
          }
        }
      `)
      return getQuestions
    }
  })
}

// Create question mutation
export function useCreateQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (questionData: any) => {
      const { createQuestion } = await graphQLClient.request(gql`
        mutation CreateQuestion($input: QuestionInput!) {
          createQuestion(input: $input) {
            id
            question
            subjectId
            relatedConcepts {
              searchQueryDefinition
              relationDescription
            }
            notes
            potentialReplies {
              exampleReply
              potentialRequirements
              potentialConstraints
              potentialAssumptions
              potentialRisks
              arguments {
                argument
                qualityImpacts {
                  quality
                  impact
                  notes
                }
              }
            }
            potentialKeyConsiderations {
              description
              externalReferences
            }
          }
        }
      `, { input: questionData })
      return createQuestion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    }
  })
}

// Delete question mutation
export function useDeleteQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { deleteQuestion } = await graphQLClient.request(gql`
        mutation DeleteQuestion($id: ID!) {
          deleteQuestion(id: $id)
        }
      `, { id })
      return deleteQuestion
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    }
  })
}

// Edit question mutation
export function useEditQuestion() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string, input: any }) => {
      console.log('7. Frontend mutation - Input:', { id, input })
      
      try {
        // First get the existing question to preserve structure
        const { getQuestion } = await graphQLClient.request(gql`
          query GetQuestion($id: ID!) {
            getQuestion(id: $id) {
              id
              question
              subjectId
              notes
              relatedConcepts {
                searchQueryDefinition
                relationDescription
              }
              potentialReplies {
                exampleReply
                potentialRequirements
                potentialConstraints
                potentialAssumptions
                potentialRisks
                arguments {
                  argument
                  qualityImpacts {
                    quality
                    impact
                    notes
                  }
                }
              }
              potentialKeyConsiderations {
                description
                externalReferences
              }
            }
          }
        `, { id })

        // Then perform the update
        const { updateQuestion } = await graphQLClient.request(gql`
          mutation UpdateQuestion($id: ID!, $input: QuestionInput!) {
            updateQuestion(id: $id, input: $input) {
              id
              question
              subjectId
              notes
              relatedConcepts {
                searchQueryDefinition
                relationDescription
              }
              potentialReplies {
                exampleReply
                potentialRequirements
                potentialConstraints
                potentialAssumptions
                potentialRisks
                arguments {
                  argument
                  qualityImpacts {
                    quality
                    impact
                    notes
                  }
                }
              }
              potentialKeyConsiderations {
                description
                externalReferences
              }
            }
          }
        `, { 
          id, 
          input: {
            ...input,
            relatedConcepts: input.relatedConcepts || [],
            potentialReplies: input.potentialReplies || [],
            potentialKeyConsiderations: input.potentialKeyConsiderations || []
          }
        })

        console.log('8. Frontend mutation - Response:', updateQuestion)
        return updateQuestion
      } catch (error) {
        console.error('9. Frontend mutation - Error:', error)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] })
    }
  })
} 