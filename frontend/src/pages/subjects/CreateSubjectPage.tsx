import { useNavigate } from 'react-router-dom'
import { useCreateSubject } from '../../hooks/useSubjects'
import { SubjectForm, FormData } from '../../components/SubjectForm'

export function CreateSubjectPage() {
  const navigate = useNavigate()
  const createSubject = useCreateSubject()

  const handleSubmit = async (formData: FormData) => {
    try {
      await createSubject.mutateAsync(formData)
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