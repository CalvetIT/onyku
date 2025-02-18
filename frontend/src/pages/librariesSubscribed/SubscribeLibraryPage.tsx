import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubscribeToLibraryFromGit } from '../../hooks/useSubscribeToLibraryFromGit'
import { GitProvider } from '../../enums/GitProvider'
import { Visibility } from '../../enums/Visibility'

export function SubscribeLibraryPage() {
  const navigate = useNavigate()
  const subscribe = useSubscribeToLibraryFromGit()
  const [repositoryUrl, setRepositoryUrl] = useState('')
  const [provider, setProvider] = useState<GitProvider>(GitProvider.GITHUB)
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PUBLIC)
  const [personalAccessToken, setPersonalAccessToken] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await subscribe.mutateAsync({
        repositoryUrl,
        provider,
        visibility,
        personalAccessToken: personalAccessToken || undefined
      })
      navigate('/libraries-subscribed')
    } catch (error: any) {
      setError(error.message || 'Failed to subscribe to library')
    }
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Subscribe to Library</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Repository URL:
          </label>
          <input
            type="text"
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
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Git Provider:
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
            <option value={GitProvider.GITHUB}>GitHub</option>
            <option value={GitProvider.GITLAB}>GitLab</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Visibility:
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
            <option value={Visibility.PUBLIC}>Public</option>
            <option value={Visibility.PRIVATE}>Private</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Personal Access Token (required for private repositories):
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
            placeholder="ghp_xxxxxxxxxxxx"
          />
        </div>

        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            type="button"
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
            Cancel
          </button>
          <button
            type="submit"
            disabled={subscribe.isPending}
            style={{
              padding: '8px 16px',
              backgroundColor: subscribe.isPending ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: subscribe.isPending ? 'default' : 'pointer'
            }}
          >
            {subscribe.isPending ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  )
} 