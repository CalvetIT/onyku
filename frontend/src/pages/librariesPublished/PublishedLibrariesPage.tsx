import { useGetOnlineGitRepositorySpecifications } from '../../hooks/useGetOnlineGitRepositorySpecifications'
import { useGetLibraries } from '../../hooks/useLibraries'
import { useNavigate } from 'react-router-dom'
import { DistributionMethod } from '../../enums/DistributionMethod'
import { useState } from 'react'

export function PublishedLibrariesPage() {
  const { data: specifications, isLoading: isLoadingSpecs } = useGetOnlineGitRepositorySpecifications()
  const { data: libraries, isLoading: isLoadingLibs } = useGetLibraries()
  const navigate = useNavigate()
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null)

  if (isLoadingSpecs || isLoadingLibs) return <div>Loading...</div>

  const publishedSpecs = specifications?.filter(
    spec => spec.distributionMethod === DistributionMethod.PUBLISHED
  ) || []

  const publishedLibraries = publishedSpecs.map(spec => {
    const library = libraries?.find(lib => lib.id === spec.libraryId)
    return {
      ...spec,
      name: library?.name || 'Unknown Library',
      description: library?.description || ''
    }
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Published Libraries</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Libraries List */}
        <div style={{ 
          flex: 1,
          maxHeight: '500px', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          borderRadius: '4px' 
        }}>
          {publishedLibraries.map(library => (
            <div 
              key={library.id}
              onClick={() => setSelectedLibraryId(library.id)}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                backgroundColor: selectedLibraryId === library.id ? '#e3f2fd' : 'white',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{library.name}</div>
              <div style={{ color: '#666' }}>{library.description}</div>
              <div style={{ color: '#888', fontSize: '0.9em', marginTop: '4px' }}>
                {library.repositoryUrl}
              </div>
            </div>
          ))}
          {publishedLibraries.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No published libraries found
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          width: '120px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px' 
        }}>
          <button
            onClick={() => navigate('/libraries-published/publish')}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#2196F3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Publish
          </button>
          <button
            onClick={() => selectedLibraryId && navigate(`/libraries-published/${selectedLibraryId}/sync`)}
            disabled={!selectedLibraryId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedLibraryId ? '#2196F3' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedLibraryId ? 'pointer' : 'default'
            }}
          >
            Sync Menu
          </button>
        </div>
      </div>
    </div>
  )
} 