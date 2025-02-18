import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePublishLibraryToGit } from '../../hooks/usePublishLibraryToGit'
import { useGetLibraries } from '../../hooks/useLibraries'
import { useGetOnlineGitRepositorySpecifications } from '../../hooks/useGetOnlineGitRepositorySpecifications'
import { GitProvider } from '../../enums/GitProvider'
import { Visibility } from '../../enums/Visibility'

export function PublishLibraryPage() {
  const navigate = useNavigate()
  const publishLibrary = usePublishLibraryToGit()
  const { data: libraries, isLoading: isLoadingLibs } = useGetLibraries()
  const { data: specifications, isLoading: isLoadingSpecs } = useGetOnlineGitRepositorySpecifications()

  const [selectedLibraryId, setSelectedLibraryId] = useState<string>('')
  const [provider, setProvider] = useState<GitProvider>(GitProvider.GITHUB)
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [personalAccessToken, setPersonalAccessToken] = useState('')
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PRIVATE)

  if (isLoadingLibs || isLoadingSpecs) return <div>Loading...</div>

  // Filter out libraries that are already published or subscribed
  const publishedLibraryIds = new Set(specifications?.map(spec => spec.libraryId) || [])
  const eligibleLibraries = libraries?.filter(lib => !publishedLibraryIds.has(lib.id)) || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLibraryId) return

    try {
      await publishLibrary.mutateAsync({
        libraryId: selectedLibraryId,
        provider,
        repositoryUrl,
        personalAccessToken,
        visibility
      })
      navigate('/libraries-published')
    } catch (error) {
      console.error('Failed to publish library:', error)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Publish Library to Git</h1>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Select Library
          </label>
          <select
            value={selectedLibraryId}
            onChange={(e) => setSelectedLibraryId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '4px'
            }}
            required
          >
            <option value="">Select a library...</option>
            {eligibleLibraries.map(library => (
              <option key={library.id} value={library.id}>
                {library.name} ({library.id})
              </option>
            ))}
          </select>
          {eligibleLibraries.length === 0 && (
            <div style={{ color: '#666', fontSize: '0.9em' }}>
              No eligible libraries found. All libraries are already published or subscribed.
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Git Provider
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as GitProvider)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            {Object.values(GitProvider).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Repository URL
          </label>
          <input
            type="url"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            placeholder="https://github.com/username/repository"
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Personal Access Token
          </label>
          <input
            type="password"
            value={personalAccessToken}
            onChange={(e) => setPersonalAccessToken(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            {Object.values(Visibility).map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/libraries-published')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={publishLibrary.isPending || !selectedLibraryId}
            style={{
              padding: '8px 16px',
              backgroundColor: publishLibrary.isPending || !selectedLibraryId ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: publishLibrary.isPending || !selectedLibraryId ? 'default' : 'pointer'
            }}
          >
            {publishLibrary.isPending ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </form>
    </div>
  )
} 