import { useGetQuestions, useDeleteQuestion } from '../../hooks/useQuestions'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function QuestionsPage() {
  const navigate = useNavigate()
  const { data: questions } = useGetQuestions()
  const deleteQuestion = useDeleteQuestion()
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion.mutateAsync(id)
      } catch (error) {
        console.error('Failed to delete question:', error)
      }
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>IT Design Question Guidelines</h1>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Questions List */}
        <div style={{ 
          flex: 1,
          maxHeight: '500px', 
          overflowY: 'auto', 
          border: '1px solid #ccc', 
          borderRadius: '4px' 
        }}>
          {questions?.map(question => (
            <div 
              key={question.id}
              onClick={() => setSelectedQuestionId(question.id)}
              style={{
                padding: '12px',
                borderBottom: '1px solid #eee',
                backgroundColor: selectedQuestionId === question.id ? '#e3f2fd' : 'white',
                cursor: 'pointer'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{question.question}</div>
              <div style={{ color: '#666' }}>{question.notes}</div>
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
            onClick={() => navigate('/questions/create')}
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
            onClick={() => selectedQuestionId && navigate(`/questions/${selectedQuestionId}`)}
            disabled={!selectedQuestionId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedQuestionId ? '#4CAF50' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedQuestionId ? 'pointer' : 'default'
            }}
          >
            View
          </button>
          <button
            onClick={() => selectedQuestionId && navigate(`/questions/${selectedQuestionId}/edit`)}
            disabled={!selectedQuestionId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedQuestionId ? '#2196F3' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedQuestionId ? 'pointer' : 'default'
            }}
          >
            Edit
          </button>
          <button
            onClick={() => selectedQuestionId && handleDelete(selectedQuestionId)}
            disabled={!selectedQuestionId}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: selectedQuestionId ? '#ff4444' : '#ccc', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: selectedQuestionId ? 'pointer' : 'default'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
} 