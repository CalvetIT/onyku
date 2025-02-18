import { useGetOnlineGitRepositorySpecifications } from '../../hooks/useGetOnlineGitRepositorySpecifications'
import { useGetLibraries } from '../../hooks/useLibraries'
import { useNavigate } from 'react-router-dom'
import { DistributionMethod } from '../../enums/DistributionMethod'

export function PublishedLibrariesPage() {
  const { data: specifications, isLoading: isLoadingSpecs } = useGetOnlineGitRepositorySpecifications()
  const { data: libraries, isLoading: isLoadingLibs } = useGetLibraries()
  const navigate = useNavigate()

  if (isLoadingSpecs || isLoadingLibs) return <div>Loading...</div>

  const publishedSpecs = specifications?.filter(
    spec => spec.distributionMethod === DistributionMethod.PUBLISHED
  ) || []

  // Combine specifications with library details
  const publishedLibraries = publishedSpecs.map(spec => {
    const library = libraries?.find(lib => lib.id === spec.libraryId)
    return {
      ...spec,
      name: library?.name || 'Unknown Library',
      description: library?.description || ''
    }
  })

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl">Published Libraries</h1>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate('/libraries-published/publish')}
        >
          Publish New Library
        </button>
      </div>

      <div className="grid gap-4">
        {publishedLibraries.map(library => (
          <div key={library.id} className="border p-4 rounded">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{library.name}</h3>
                <p className="text-gray-600 mt-1">{library.description}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-500">
                  <p>Repository: {library.repositoryUrl}</p>
                  <p>Provider: {library.provider}</p>
                  <p>Last Synced: {library.lastSyncAt ? new Date(library.lastSyncAt).toLocaleString() : 'Never'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => navigate(`/libraries-published/push/${library.libraryId}`)}
                >
                  Push Updates
                </button>
              </div>
            </div>
          </div>
        ))}
        {publishedLibraries.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No published libraries found. Click "Publish New Library" to get started.
          </div>
        )}
      </div>
    </div>
  )
} 