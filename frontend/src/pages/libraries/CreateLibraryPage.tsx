import { useNavigate } from 'react-router-dom'
import { useCreateLibrary } from '../../hooks/useLibraries'
import { LibraryForm, FormData } from '../../components/LibraryForm'

const API_BASE_URL = 'http://localhost:4000/libraries'

export function CreateLibraryPage() {
  const navigate = useNavigate()
  const createLibrary = useCreateLibrary()

  const handleSubmit = async (formData: FormData) => {
    try {
      await createLibrary.mutateAsync(formData)
      navigate('/libraries')
    } catch (error) {
      console.error('Failed to create library:', error)
    }
  }

  return (
    <LibraryForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/libraries')}
      title="Create Library"
      submitButtonText="Create Library"
      mode="create"
    />
  )
} 