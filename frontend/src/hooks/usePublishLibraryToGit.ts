import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql'
import { gql } from 'graphql-request'
import { GitProvider } from '../enums/GitProvider'
import { Visibility } from '../enums/Visibility'

interface PublishLibraryInput {
  libraryId: string
  provider: GitProvider
  repositoryUrl: string
  personalAccessToken: string
  visibility: Visibility
}

const PUBLISH_LIBRARY = gql`
  mutation PublishLibrary(
    $libraryId: ID!
    $provider: GitProvider!
    $repositoryUrl: String!
    $personalAccessToken: String!
    $visibility: Visibility!
  ) {
    publishLibraryToGit(
      libraryId: $libraryId
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

export function usePublishLibraryToGit() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (input: PublishLibraryInput) => {
      const response = await graphqlClient.request(PUBLISH_LIBRARY, input)
      return response.publishLibraryToGit
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraries'] })
    }
  })
} 