import { useNavigate, useParams } from 'react-router-dom'
import { useGetLibraries } from '../../hooks/useLibraries'

export function ViewLibraryPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: libraries, isLoading } = useGetLibraries()
  
  const library = libraries?.find(l => l.id === id)

  if (isLoading) return <div>Loading...</div>
  if (!library) return <div>Library not found</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>View Library</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{library.name}</h2>
        {library.description && (
          <p style={{ marginBottom: '10px', color: '#666' }}>{library.description}</p>
        )}
        {library.maintainer && (
          <p style={{ color: '#666' }}>Maintainer: {library.maintainer}</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => navigate('/libraries')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Libraries
        </button>
      </div>
    </div>
  )
} 