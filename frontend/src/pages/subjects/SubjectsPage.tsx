import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGetSubjects, useDeleteSubject } from '../../hooks/useSubjects'

const API_BASE_URL = 'http://localhost:4000/subjects'

export function SubjectsPage() {
  const navigate = useNavigate()
  const { data: subjects } = useGetSubjects()
  const deleteSubject = useDeleteSubject()
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        // First delete in GraphQL
        await deleteSubject.mutateAsync(id)
        
        // Then delete from database
        await fetch(`${API_BASE_URL}/delete/${id}`, {
          method: 'DELETE'
        })
        
        setSelectedSubjectId(null)
      } catch (error) {
        console.error('Failed to delete subject:', error)
      }
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Subjects</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Subjects List */}
        <div style={{ 
          flex: 1,
          maxHeight: '500px', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          borderRadius: '4px' 
        }}>
          {subjects?.map(subject => (
            <div 
              key={subject.id}
              onClick={() => setSelectedSubjectId(subject.id)}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                backgroundColor: selectedSubjectId === subject.id ? '#e3f2fd' : 'white',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{subject.name}</div>
              {subject.libraryId && <div style={{ color: '#666' }}>Library: {subject.libraryId}</div>}
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
            onClick={() => navigate('/subjects/create')}
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
            onClick={() => selectedSubjectId && navigate(`/subjects/${selectedSubjectId}`)}
            disabled={!selectedSubjectId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedSubjectId ? '#4CAF50' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedSubjectId ? 'pointer' : 'default'
            }}
          >
            View
          </button>
          <button
            onClick={() => selectedSubjectId && navigate(`/subjects/${selectedSubjectId}/edit`)}
            disabled={!selectedSubjectId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedSubjectId ? '#2196F3' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedSubjectId ? 'pointer' : 'default'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => selectedSubjectId && handleDelete(selectedSubjectId)}
            disabled={!selectedSubjectId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedSubjectId ? '#ff4444' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedSubjectId ? 'pointer' : 'default'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
} 