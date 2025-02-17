import { useNavigate, useParams } from 'react-router-dom'
import { useGetSubjects } from '../../hooks/useSubjects'

export function ViewSubjectPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: subjects, isLoading } = useGetSubjects()
  
  const subject = subjects?.find(s => s.id === id)

  if (isLoading) return <div>Loading...</div>
  if (!subject) return <div>Subject not found</div>

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>View Subject</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>{subject.name}</h2>
        {subject.description && (
          <p style={{ marginBottom: '10px', color: '#666' }}>{subject.description}</p>
        )}
        {subject.libraryId && (
          <p style={{ color: '#666' }}>Library: {subject.libraryId}</p>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => navigate('/subjects')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Subjects
        </button>
      </div>
    </div>
  )
} 