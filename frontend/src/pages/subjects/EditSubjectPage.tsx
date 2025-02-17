import { useNavigate, useParams } from 'react-router-dom'
import { useGetSubjects, useEditSubject } from '../../hooks/useSubjects'
import { SubjectForm, FormData } from '../../components/SubjectForm'

const API_BASE_URL = 'http://localhost:4000/subjects'

export function EditSubjectPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: subjects, isLoading } = useGetSubjects()
  const editSubject = useEditSubject()
  
  const subject = subjects?.find(s => s.id === id)

  if (isLoading) return <div>Loading...</div>
  if (!subject) return <div>Subject not found</div>

  const handleSubmit = async (formData: FormData) => {
    try {
      // Remove id from the input data for GraphQL
      const { id: _, ...inputWithoutId } = formData
      
      // First update in GraphQL
      const result = await editSubject.mutateAsync({ 
        id: id!, 
        input: inputWithoutId
      })
      
      // Then persist to database
      await fetch(`${API_BASE_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      })
      
      navigate('/subjects')
    } catch (error) {
      console.error('Failed to edit subject:', error)
    }
  }

  return (
    <SubjectForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/subjects')}
      title="Edit Subject"
      submitButtonText="Save Changes"
      mode="edit"
      initialData={subject}
    />
  )
} 