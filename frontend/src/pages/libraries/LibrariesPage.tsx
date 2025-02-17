import { useGetLibraries, useDeleteLibrary } from '../../hooks/useLibraries'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function LibrariesPage() {
  const navigate = useNavigate()
  const { data: libraries } = useGetLibraries()
  const deleteLibrary = useDeleteLibrary()
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this library?')) {
      try {
        await deleteLibrary.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete library:', error)
      }
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Libraries</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Libraries List */}
        <div style={{ 
          flex: 1,
          maxHeight: '500px', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          borderRadius: '4px' 
        }}>
          {libraries?.map(library => (
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
              <div style={{ color: '#666' }}>{library.maintainer}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div style={{ 
          width: '120px',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '10px' 
        }}>
          <button
            onClick={() => navigate('/libraries/create')}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#2196F3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create
          </button>
          <button
            onClick={() => selectedLibraryId && navigate(`/libraries/${selectedLibraryId}`)}
            disabled={!selectedLibraryId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedLibraryId ? '#4CAF50' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedLibraryId ? 'pointer' : 'default'
            }}
          >
            View
          </button>
          <button
            onClick={() => selectedLibraryId && navigate(`/libraries/${selectedLibraryId}/edit`)}
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
            Edit
          </button>
          <button
            onClick={() => selectedLibraryId && handleDelete(selectedLibraryId)}
            disabled={!selectedLibraryId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedLibraryId ? '#ff4444' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedLibraryId ? 'pointer' : 'default'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
} 