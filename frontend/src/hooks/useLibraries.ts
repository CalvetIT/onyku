import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { GraphQLClient, gql } from 'graphql-request'

const API_URL = 'http://localhost:4000/graphql'
const graphQLClient = new GraphQLClient(API_URL)

// Get all libraries
export function useGetLibraries() {
  return useQuery<any[]>({
    queryKey: ['libraries'],
    queryFn: async () => {
      const { getLibraries } = await graphQLClient.request(gql`
        query GetLibraries {
          getLibraries {
            id
            name
            description
            maintainer
          }
        }
      `)
      return getLibraries
    }
  })
}

// Create library mutation
export function useCreateLibrary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (libraryData: any) => {
      const { createLibrary } = await graphQLClient.request(gql`
        mutation CreateLibrary($input: LibraryInput!) {
          createLibrary(input: $input) {
            id
            name
            description
            maintainer
          }
        }
      `, { input: libraryData })
      return createLibrary
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraries'] })
    }
  })
}

// Delete library mutation
export function useDeleteLibrary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { deleteLibrary } = await graphQLClient.request(gql`
        mutation DeleteLibrary($id: ID!) {
          deleteLibrary(id: $id)
        }
      `, { id })
      return deleteLibrary
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraries'] })
    }
  })
}

// Edit library mutation
export function useEditLibrary() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: any }) => {
      const { updateLibrary } = await graphQLClient.request(gql`
        mutation UpdateLibrary($id: ID!, $input: LibraryInput!) {
          updateLibrary(id: $id, input: $input) {
            id
            name
            description
            maintainer
          }
        }
      `, { id, input })
      return updateLibrary
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraries'] })
    }
  })
} 