import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GraphQLClient, gql } from 'graphql-request'

const API_URL = 'http://localhost:4000/graphql'
const graphQLClient = new GraphQLClient(API_URL)

// Get all subjects
export function useGetSubjects() {
  return useQuery<any[]>({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { getSubjects } = await graphQLClient.request(gql`
        query GetSubjects {
          getSubjects {
            id
            name
            description
            libraryId
          }
        }
      `)
      return getSubjects
    }
  })
}

// Create subject mutation
export function useCreateSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subjectData: any) => {
      const { createSubject } = await graphQLClient.request(gql`
        mutation CreateSubject($input: SubjectInput!) {
          createSubject(input: $input) {
            id
            name
            description
            libraryId
          }
        }
      `, { input: subjectData })
      return createSubject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    }
  })
}

// Delete subject mutation
export function useDeleteSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { deleteSubject } = await graphQLClient.request(gql`
        mutation DeleteSubject($id: ID!) {
          deleteSubject(id: $id)
        }
      `, { id })
      return deleteSubject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    }
  })
}

// Edit subject mutation
export function useEditSubject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: any }) => {
      const { updateSubject } = await graphQLClient.request(gql`
        mutation UpdateSubject($id: ID!, $input: SubjectInput!) {
          updateSubject(id: $id, input: $input) {
            id
            name
            description
            libraryId
          }
        }
      `, { id, input })
      return updateSubject
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    }
  })
} 