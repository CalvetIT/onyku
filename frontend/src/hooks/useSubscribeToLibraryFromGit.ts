import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql'
import { gql } from 'graphql-request'
import { GitProvider } from '../enums/GitProvider'
import { Visibility } from '../enums/Visibility'

interface SubscribeToLibraryInput {
  provider: GitProvider
  repositoryUrl: string
  personalAccessToken?: string
  visibility: Visibility
}

interface SubscribeToLibraryResponse {
  id: string
  status: string
}

const SUBSCRIBE_TO_LIBRARY = gql`
  mutation SubscribeToLibrary(
    $provider: GitProvider!
    $repositoryUrl: String!
    $personalAccessToken: String
    $visibility: Visibility!
  ) {
    subscribeToLibraryFromGit(
      provider: $provider
      repositoryUrl: $repositoryUrl
      personalAccessToken: $personalAccessToken
      visibility: $visibility
    ) {
      id
      status
    }
  }
`

export function useSubscribeToLibraryFromGit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: SubscribeToLibraryInput) => {
      const response = await graphqlClient.request(SUBSCRIBE_TO_LIBRARY, input)
      return response.subscribeToLibraryFromGit as SubscribeToLibraryResponse
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['onlineGitRepositorySpecifications'] })
      queryClient.invalidateQueries({ queryKey: ['libraries'] })
    }
  })
} 