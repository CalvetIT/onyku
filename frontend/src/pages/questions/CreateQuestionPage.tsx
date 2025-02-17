import { useNavigate } from 'react-router-dom'
import { useCreateQuestion } from '../../hooks/useQuestions'
import { QuestionForm, FormData } from '../../components/QuestionForm'

export function CreateQuestionPage() {
  const navigate = useNavigate()
  const createQuestion = useCreateQuestion()

  const handleSubmit = async (formData: FormData) => {
    try {
      await createQuestion.mutateAsync(formData)
      navigate('/questions')
    } catch (error) {
      console.error('Failed to create question:', error)
    }
  }

  return (
    <QuestionForm
      onSubmit={handleSubmit}
      onCancel={() => navigate('/questions')}
      title="Create Question"
      submitButtonText="Create Question"
      mode="create"
    />
  )
} 