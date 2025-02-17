import { useNavigate, useParams } from 'react-router-dom'
import { useGetQuestions, useEditQuestion } from '../../hooks/useQuestions'
import { QuestionForm, FormData } from '../../components/QuestionForm'

const API_BASE_URL = 'http://localhost:4000/questions'

export function EditQuestionPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: questions, isLoading } = useGetQuestions()
  const editQuestion = useEditQuestion()
  
  const question = questions?.find(q => q.id === id)

  if (isLoading) return <div>Loading...</div>
  if (!question) return <div>Question not found</div>

  const handleSubmit = async (formData: FormData) => {
    try {
      // Remove id from the input data for GraphQL
      const { id: _, ...inputWithoutId } = formData
      
      await editQuestion.mutateAsync({ 
        id: id!, 
        input: inputWithoutId
      })
      
      navigate('/questions')
    } catch (error) {
      console.error('Failed to edit question:', error)
    }
  }

  return (
    <QuestionForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/questions')}
      title="Edit Question"
      submitButtonText="Save Changes"
      mode="edit"
      initialData={question}
    />
  )
} 