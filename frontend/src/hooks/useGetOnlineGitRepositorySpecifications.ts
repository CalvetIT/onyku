import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphql'
import { gql } from 'graphql-request'
import { GitProvider } from '../enums/GitProvider'
import { Visibility } from '../enums/Visibility'
import { DistributionMethod } from '../enums/DistributionMethod'

interface OnlineGitRepositorySpecification {
  id: string
  libraryId: string
  provider: GitProvider
  repositoryUrl: string
  visibility: Visibility
  distributionMethod: DistributionMethod
  createdAt: string
  lastSyncAt: string | null
}

const GET_SPECIFICATIONS = gql`
  query GetOnlineGitRepositorySpecifications {
    getOnlineGitRepositorySpecifications {
      id
      libraryId
      provider
      repositoryUrl
      visibility
      distributionMethod
      createdAt
      lastSyncAt
    }
  }
`

export function useGetOnlineGitRepositorySpecifications() {
  return useQuery({
    queryKey: ['onlineGitRepositorySpecifications'],
    queryFn: async () => {
      const response = await graphqlClient.request(GET_SPECIFICATIONS)
      return response.getOnlineGitRepositorySpecifications as OnlineGitRepositorySpecification[]
    }
  })
} 