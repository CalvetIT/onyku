import { useNavigate, useParams } from 'react-router-dom'
import { useGetOnlineGitRepositorySpecifications } from '../../hooks/useGetOnlineGitRepositorySpecifications'
import { useGetLibraries } from '../../hooks/useLibraries'
import { usePullLibraryUpdatesFromGit } from '../../hooks/usePullLibraryUpdatesFromGit'
import { useState } from 'react'

export function SubscribedLibrarySyncPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: specifications, isLoading: isLoadingSpecs } = useGetOnlineGitRepositorySpecifications()
  const { data: libraries, isLoading: isLoadingLibs } = useGetLibraries()
  const pullUpdates = usePullLibraryUpdatesFromGit()
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  if (isLoadingSpecs || isLoadingLibs) return <div>Loading...</div>

  const specification = specifications?.find(spec => spec.id === id)
  const library = libraries?.find(lib => lib.id === specification?.libraryId)

  if (!specification || !library) {
    return <div>Library not found</div>
  }

  const handleSync = async () => {
    try {
      setSyncStatus('Syncing...')
      const result = await pullUpdates.mutateAsync(library.id)
      setSyncStatus(`Sync ${result.status.toLowerCase()}`)
    } catch (error) {
      console.error('Failed to sync library:', error)
      setSyncStatus('Sync failed')
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Sync Subscribed Library</h1>
      
      <div style={{ 
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <div style={{ 
          display: 'grid',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div>
            <strong>Library Name: </strong> 
            {library.name}
          </div>
          <div>
            <strong>Library ID: </strong> 
            {specification.libraryId}
          </div>
          <div>
            <strong>Library Description: </strong> 
            {library.description}
          </div>
          <div>
            <strong>Maintainer: </strong> 
            {library.maintainer || 'Not specified'}
          </div>
          <div>
            <strong>Repository URL: </strong> 
            <a 
              href={specification.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2196F3' }}
            >
              {specification.repositoryUrl}
            </a>
          </div>
          <div>
            <strong>Provider: </strong> 
            {specification.provider}
          </div>
          <div>
            <strong>Visibility: </strong> 
            {specification.visibility}
          </div>
          <div>
            <strong>Created: </strong> 
            {specification.createdAt 
              ? new Date(Number(specification.createdAt)).toLocaleString()
              : 'Unknown'}
          </div>
          <div>
            <strong>Last Synced: </strong> 
            {specification.lastSyncAt 
              ? new Date(Number(specification.lastSyncAt)).toLocaleString()
              : 'Never synced'}
          </div>
        </div>

        {syncStatus && (
          <div style={{ 
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: syncStatus.includes('failed') ? '#ffebee' : '#e8f5e9',
            borderRadius: '4px',
            color: syncStatus.includes('failed') ? '#c62828' : '#2e7d32'
          }}>
            {syncStatus}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate('/libraries-subscribed')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Back
          </button>
          <button
            onClick={handleSync}
            disabled={pullUpdates.isPending}
            style={{
              padding: '8px 16px',
              backgroundColor: pullUpdates.isPending ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pullUpdates.isPending ? 'default' : 'pointer'
            }}
          >
            {pullUpdates.isPending ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      </div>
    </div>
  )
} 