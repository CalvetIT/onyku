import { useNavigate, useParams } from 'react-router-dom'
import { useGetLibraries, useEditLibrary } from '../../hooks/useLibraries'
import { LibraryForm, FormData } from '../../components/LibraryForm'

export function EditLibraryPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: libraries, isLoading } = useGetLibraries()
  const editLibrary = useEditLibrary()
  
  const library = libraries?.find(l => l.id === id)

  if (isLoading) return <div>Loading...</div>
  if (!library) return <div>Library not found</div>

  const handleSubmit = async (formData: FormData) => {
    try {
      // Remove id from the input data for GraphQL
      const { id: _, ...inputWithoutId } = formData
      
      await editLibrary.mutateAsync({ 
        id: id!, 
        input: inputWithoutId
      })
      
      navigate('/libraries')
    } catch (error) {
      console.error('Failed to edit library:', error)
    }
  }

  return (
    <LibraryForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/libraries')}
      title="Edit Library"
      submitButtonText="Save Changes"
      mode="edit"
      initialData={library}
    />
  )
} 