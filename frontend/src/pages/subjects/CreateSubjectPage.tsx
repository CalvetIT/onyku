import { useNavigate } from 'react-router-dom'
import { useCreateSubject } from '../../hooks/useSubjects'
import { SubjectForm, FormData } from '../../components/SubjectForm'

const API_BASE_URL = 'http://localhost:4000/subjects'

export function CreateSubjectPage() {
  const navigate = useNavigate()
  const createSubject = useCreateSubject()

  const handleSubmit = async (formData: FormData) => {
    try {
      // First create in GraphQL
      const result = await createSubject.mutateAsync(formData)
      
      // Then persist to database
      await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      })
      
      navigate('/subjects')
    } catch (error) {
      console.error('Failed to create subject:', error)
    }
  }

  return (
    <SubjectForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/subjects')}
      title="Create Subject"
      submitButtonText="Create Subject"
      mode="create"
    />
  )
} 