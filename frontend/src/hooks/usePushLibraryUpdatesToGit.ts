import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql'
import { gql } from 'graphql-request'

interface PushLibraryUpdatesResponse {
  id: string
  status: string
}

const PUSH_LIBRARY_UPDATES = gql`
  mutation PushLibraryUpdates($libraryId: ID!) {
    pushLibraryUpdatesToGit(libraryId: $libraryId) {
      id
      status
    }
  }
`

export function usePushLibraryUpdatesToGit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (libraryId: string) => {
      const response = await graphqlClient.request(PUSH_LIBRARY_UPDATES, {
        libraryId
      })
      return response.pushLibraryUpdatesToGit as PushLibraryUpdatesResponse
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['onlineGitRepositorySpecifications'] })
    }
  })
} 