import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql'
import { gql } from 'graphql-request'

interface PullLibraryUpdatesResponse {
  id: string
  status: string
}

const PULL_LIBRARY_UPDATES = gql`
  mutation PullLibraryUpdates($libraryId: ID!) {
    pullLibraryUpdatesFromGit(libraryId: $libraryId) {
      id
      status
    }
  }
`

export function usePullLibraryUpdatesFromGit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (libraryId: string) => {
      const response = await graphqlClient.request(PULL_LIBRARY_UPDATES, {
        libraryId
      })
      return response.pullLibraryUpdatesFromGit as PullLibraryUpdatesResponse
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['onlineGitRepositorySpecifications'] })
      queryClient.invalidateQueries({ queryKey: ['libraries'] })
    }
  })
} 