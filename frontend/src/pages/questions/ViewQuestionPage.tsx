import { useNavigate, useParams } from 'react-router-dom'
import { useGetQuestions } from '../../hooks/useQuestions'
import { useGetSubjects } from '../../hooks/useSubjects'

export function ViewQuestionPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: questions, isLoading } = useGetQuestions()
  const { data: subjects } = useGetSubjects()
  
  const question = questions?.find(q => q.id === id)
  const subject = subjects?.find(s => s.id === question?.subjectId)

  if (isLoading) return <div>Loading...</div>
  if (!question) return <div>Question not found</div>

  const handleBack = () => {
    navigate('/questions')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Subject */}
      {question.subjectId && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Subject</h2>
          <div>{subject?.name || 'Unknown Subject'}</div>
        </div>
      )}

      {/* Question */}
      <div style={{ marginBottom: '20px' }}>
        <h2>Question</h2>
        <div style={{ fontSize: '16px' }}>{question.question}</div>
      </div>

      {/* Potential Replies */}
      {question.potentialReplies.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Potential Replies</h2>
          {question.potentialReplies.map((reply, replyIndex) => (
            <div key={replyIndex} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '4px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>{reply.exampleReply}</div>

              {reply.potentialRequirements.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <h4>Requirements:</h4>
                  <ul style={{ margin: '0 0 10px 0' }}>
                    {reply.potentialRequirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {reply.potentialConstraints.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <h4>Constraints:</h4>
                  <ul style={{ margin: '0 0 10px 0' }}>
                    {reply.potentialConstraints.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}

              {reply.potentialAssumptions.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <h4>Assumptions:</h4>
                  <ul style={{ margin: '0 0 10px 0' }}>
                    {reply.potentialAssumptions.map((assumption, index) => (
                      <li key={index}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              )}

              {reply.potentialRisks.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                  <h4>Risks:</h4>
                  <ul style={{ margin: '0 0 10px 0' }}>
                    {reply.potentialRisks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {reply.arguments.length > 0 && (
                <div>
                  <h4>Arguments:</h4>
                  {reply.arguments.map((arg, argIndex) => (
                    <div key={argIndex} style={{ marginBottom: '10px', marginLeft: '20px' }}>
                      <div style={{ fontWeight: 'bold' }}>{arg.argument}</div>
                      {arg.qualityImpacts.length > 0 && (
                        <div style={{ marginLeft: '20px' }}>
                          <h5 style={{ margin: '8px 0' }}>Quality Impacts:</h5>
                          {arg.qualityImpacts.map((impact, impactIndex) => (
                            <div key={impactIndex} style={{ marginBottom: '5px' }}>
                              <span style={{ fontWeight: 'bold' }}>{impact.quality}</span>
                              {' → '}
                              <span>{impact.impact}</span>
                              {impact.notes && (
                                <span style={{ marginLeft: '10px', color: '#666' }}>({impact.notes})</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Key Considerations */}
      {question.potentialKeyConsiderations.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Key Considerations</h2>
          {question.potentialKeyConsiderations.map((consideration, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{consideration.description}</div>
              {consideration.externalReferences.length > 0 && (
                <div style={{ marginLeft: '20px' }}>
                  <h4>External References:</h4>
                  <ul style={{ margin: 0 }}>
                    {consideration.externalReferences.map((ref, refIndex) => (
                      <li key={refIndex}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Related Concepts */}
      {question.relatedConcepts && question.relatedConcepts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Related Concepts</h2>
          {question.relatedConcepts.map((concept, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Search Query Definition:</strong>
                <div>{concept.searchQueryDefinition}</div>
              </div>
              <div>
                <strong>Relation Description:</strong>
                <div>{concept.relationDescription}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {question.notes && (
        <div style={{ marginBottom: '20px' }}>
          <h2>Notes</h2>
          <div style={{ whiteSpace: 'pre-wrap' }}>{question.notes}</div>
        </div>
      )}

      {/* Return Button */}
      <button
        onClick={handleBack}
        style={{ 
          padding: '8px 16px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Back to Questions
      </button>
    </div>
  )
} 