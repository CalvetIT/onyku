import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Quality, Impact } from '../types/enums'
import { useGetSubjects } from '../hooks/useSubjects'

interface RelatedConcept {
    searchQueryDefinition: string
    relationDescription: string
}

export interface FormData {
    id?: string
    question: string
    potentialReplies: Array<{
        exampleReply: string
        potentialRequirements: string[]
        potentialConstraints: string[]
        potentialAssumptions: string[]
        potentialRisks: string[]
        arguments: Array<{
            argument: string
            qualityImpacts: Array<{
                quality: Quality
                impact: Impact
                notes: string
            }>
        }>
    }>
    potentialKeyConsiderations: Array<{
        description: string
        externalReferences: string[]
    }>
    subjectId?: string
    relatedConcepts?: RelatedConcept[]
    notes: string
}

interface QuestionFormProps {
    initialData?: FormData
    onSubmit: (data: FormData) => Promise<void>
    title: string
    submitButtonText: string
    mode: 'create' | 'edit'
}

const defaultFormData: FormData = {
    question: '',
    potentialReplies: [],
    potentialKeyConsiderations: [],
    subjectId: undefined,
    relatedConcepts: [],
    notes: ''
}

export function QuestionForm({ initialData = defaultFormData, onSubmit, title, submitButtonText, mode }: QuestionFormProps) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormData>(initialData)
    const { data: subjects } = useGetSubjects()

    useEffect(() => {
        if (mode === 'edit' && initialData.id) {
            setFormData(initialData)
        } else {
            setFormData(defaultFormData)
        }
    }, [initialData, mode])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await onSubmit(formData)
        navigate('/questions')
    }

    // Related Concepts handlers
    const addRelatedConcept = () => {
        setFormData(prev => ({
            ...prev,
            relatedConcepts: [
                ...(prev.relatedConcepts || []),
                { searchQueryDefinition: '', relationDescription: '' }
            ]
        }))
    }

    const updateRelatedConcept = (index: number, field: keyof RelatedConcept, value: string) => {
        setFormData(prev => ({
            ...prev,
            relatedConcepts: prev.relatedConcepts?.map((concept, i) => 
                i === index ? { ...concept, [field]: value } : concept
            )
        }))
    }

    const removeRelatedConcept = (index: number) => {
        setFormData(prev => ({
            ...prev,
            relatedConcepts: prev.relatedConcepts?.filter((_, i) => i !== index)
        }))
    }

    // Potential Replies handlers
    const addPotentialReply = () => {
        setFormData(prev => ({
            ...prev,
            potentialReplies: [...prev.potentialReplies, {
                exampleReply: '',
                potentialRequirements: [],
                potentialConstraints: [],
                potentialAssumptions: [],
                potentialRisks: [],
                arguments: []
            }]
        }))
    }

    const deletePotentialReply = (replyIndex: number) => {
        setFormData(prev => ({
            ...prev,
            potentialReplies: prev.potentialReplies.filter((_, i) => i !== replyIndex)
        }))
    }

    const addItemToReply = (replyIndex: number, field: 'potentialRequirements' | 'potentialConstraints' | 'potentialAssumptions' | 'potentialRisks') => {
        setFormData(prev => {
            const newReplies = [...prev.potentialReplies]
            newReplies[replyIndex] = {
                ...newReplies[replyIndex],
                [field]: [...newReplies[replyIndex][field], '']
            }
            return { ...prev, potentialReplies: newReplies }
        })
    }

    const deleteItemFromReply = (replyIndex: number, field: 'potentialRequirements' | 'potentialConstraints' | 'potentialAssumptions' | 'potentialRisks', itemIndex: number) => {
        setFormData(prev => {
            const newReplies = [...prev.potentialReplies]
            newReplies[replyIndex] = {
                ...newReplies[replyIndex],
                [field]: newReplies[replyIndex][field].filter((_, i) => i !== itemIndex)
            }
            return { ...prev, potentialReplies: newReplies }
        })
    }

    // Arguments handlers
    const addArgument = (replyIndex: number) => {
        setFormData(prev => {
            const newReplies = [...prev.potentialReplies]
            newReplies[replyIndex] = {
                ...newReplies[replyIndex],
                arguments: [...newReplies[replyIndex].arguments, {
                    argument: '',
                    qualityImpacts: []
                }]
            }
            return { ...prev, potentialReplies: newReplies }
        })
    }

    const deleteArgument = (replyIndex: number, argumentIndex: number) => {
        setFormData(prev => {
            const newReplies = [...prev.potentialReplies]
            newReplies[replyIndex] = {
                ...newReplies[replyIndex],
                arguments: newReplies[replyIndex].arguments.filter((_, i) => i !== argumentIndex)
            }
            return { ...prev, potentialReplies: newReplies }
        })
    }

    // Quality Impacts handlers
    const addQualityImpact = (replyIndex: number, argumentIndex: number) => {
        setFormData(prev => {
            const newReplies = [...prev.potentialReplies]
            newReplies[replyIndex] = {
                ...newReplies[replyIndex],
                arguments: [
                    ...newReplies[replyIndex].arguments.slice(0, argumentIndex),
                    {
                        ...newReplies[replyIndex].arguments[argumentIndex],
                        qualityImpacts: [
                            ...newReplies[replyIndex].arguments[argumentIndex].qualityImpacts,
                            {
                                quality: Quality.availability,
                                impact: Impact.neutral,
                                notes: ''
                            }
                        ]
                    },
                    ...newReplies[replyIndex].arguments.slice(argumentIndex + 1)
                ]
            }
            return { ...prev, potentialReplies: newReplies }
        })
    }

    const deleteQualityImpact = (replyIndex: number, argumentIndex: number, impactIndex: number) => {
        setFormData(prev => {
            const newReplies = [...prev.potentialReplies]
            newReplies[replyIndex].arguments[argumentIndex].qualityImpacts = 
                newReplies[replyIndex].arguments[argumentIndex].qualityImpacts.filter((_, i) => i !== impactIndex)
            return { ...prev, potentialReplies: newReplies }
        })
    }

    const handleQualityImpactChange = (
        replyIndex: number, 
        argumentIndex: number, 
        impactIndex: number,
        field: 'quality' | 'impact' | 'notes',
        value: string
    ) => {
        setFormData(prev => {
            const newReplies = [...prev.potentialReplies]
            const impact = newReplies[replyIndex].arguments[argumentIndex].qualityImpacts[impactIndex]
            
            if (field === 'quality') {
                impact.quality = value as Quality
            } else if (field === 'impact') {
                impact.impact = value as Impact
            } else {
                impact.notes = value
            }
            
            return { ...prev, potentialReplies: newReplies }
        })
    }

    // Key Considerations handlers
    const addKeyConsideration = () => {
        setFormData(prev => ({
            ...prev,
            potentialKeyConsiderations: [...prev.potentialKeyConsiderations, {
                description: '',
                externalReferences: []
            }]
        }))
    }

    const deleteKeyConsideration = (index: number) => {
        setFormData(prev => ({
            ...prev,
            potentialKeyConsiderations: prev.potentialKeyConsiderations.filter((_, i) => i !== index)
        }))
    }

    const addExternalReference = (considerationIndex: number) => {
        setFormData(prev => {
            const newConsiderations = [...prev.potentialKeyConsiderations]
            newConsiderations[considerationIndex] = {
                ...newConsiderations[considerationIndex],
                externalReferences: [
                    ...newConsiderations[considerationIndex].externalReferences,
                    ''
                ]
            }
            return { ...prev, potentialKeyConsiderations: newConsiderations }
        })
    }

    const deleteExternalReference = (considerationIndex: number, referenceIndex: number) => {
        setFormData(prev => {
            const newConsiderations = [...prev.potentialKeyConsiderations]
            newConsiderations[considerationIndex].externalReferences = 
                newConsiderations[considerationIndex].externalReferences.filter((_, i) => i !== referenceIndex)
            return { ...prev, potentialKeyConsiderations: newConsiderations }
        })
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <h1>{title}</h1>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Subject ID Field */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Subject:</label>
                    <select
                        value={formData.subjectId || ''}
                        onChange={e => setFormData(prev => ({ 
                            ...prev, 
                            subjectId: e.target.value === '' ? undefined : e.target.value 
                        }))}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="">No Subject (Orphaned)</option>
                        {subjects?.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Question Field */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Question:</label>
                    <input
                        type="text"
                        value={formData.question}
                        onChange={e => setFormData(prev => ({ ...prev, question: e.target.value }))}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        required
                    />
                </div>

                {/* Potential Replies Section */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3>Potential Replies</h3>
                        <button
                            type="button"
                            onClick={addPotentialReply}
                            style={{ marginLeft: 'auto', padding: '4px 8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Add Reply
                        </button>
                    </div>

                    {formData.potentialReplies.map((reply, replyIndex) => (
                        <div key={replyIndex} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
                            {/* Reply Header */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #e0e0e0', paddingBottom: '15px' }}>
                                <input
                                    type="text"
                                    placeholder="Example Reply"
                                    value={reply.exampleReply}
                                    onChange={e => {
                                        const newReplies = [...formData.potentialReplies]
                                        newReplies[replyIndex] = { ...reply, exampleReply: e.target.value }
                                        setFormData(prev => ({ ...prev, potentialReplies: newReplies }))
                                    }}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => deletePotentialReply(replyIndex)}
                                    style={{ marginLeft: 'auto', padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Delete Reply
                                </button>
                            </div>

                            {/* Indented sections container */}
                            <div style={{ marginLeft: '20px' }}>
                                {/* Requirements Section */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, color: '#666' }}>Potential requirements leading to this reply</h4>
                                        <button
                                            type="button"
                                            onClick={() => addItemToReply(replyIndex, 'potentialRequirements')}
                                            style={{ marginLeft: '20px', padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Add Requirement
                                        </button>
                                    </div>
                                    {reply.potentialRequirements.map((req, reqIndex) => (
                                        <div key={reqIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                            <input
                                                type="text"
                                                value={req}
                                                onChange={e => {
                                                    const newReplies = [...formData.potentialReplies]
                                                    newReplies[replyIndex].potentialRequirements[reqIndex] = e.target.value
                                                    setFormData(prev => ({ ...prev, potentialReplies: newReplies }))
                                                }}
                                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteItemFromReply(replyIndex, 'potentialRequirements', reqIndex)}
                                                style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Constraints Section */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, color: '#666' }}>Potential constraints leading to this reply</h4>
                                        <button
                                            type="button"
                                            onClick={() => addItemToReply(replyIndex, 'potentialConstraints')}
                                            style={{ marginLeft: '20px', padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Add Constraint
                                        </button>
                                    </div>
                                    {reply.potentialConstraints.map((constraint, constraintIndex) => (
                                        <div key={constraintIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                            <input
                                                type="text"
                                                value={constraint}
                                                onChange={e => {
                                                    const newReplies = [...formData.potentialReplies]
                                                    newReplies[replyIndex].potentialConstraints[constraintIndex] = e.target.value
                                                    setFormData(prev => ({ ...prev, potentialReplies: newReplies }))
                                                }}
                                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteItemFromReply(replyIndex, 'potentialConstraints', constraintIndex)}
                                                style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Assumptions Section */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, color: '#666' }}>Potential assumptions leading to this reply</h4>
                                        <button
                                            type="button"
                                            onClick={() => addItemToReply(replyIndex, 'potentialAssumptions')}
                                            style={{ marginLeft: '20px', padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Add Assumption
                                        </button>
                                    </div>
                                    {reply.potentialAssumptions.map((assumption, assumptionIndex) => (
                                        <div key={assumptionIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                            <input
                                                type="text"
                                                value={assumption}
                                                onChange={e => {
                                                    const newReplies = [...formData.potentialReplies]
                                                    newReplies[replyIndex].potentialAssumptions[assumptionIndex] = e.target.value
                                                    setFormData(prev => ({ ...prev, potentialReplies: newReplies }))
                                                }}
                                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteItemFromReply(replyIndex, 'potentialAssumptions', assumptionIndex)}
                                                style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Risks Section */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, color: '#666' }}>Potential risks resulting from this reply</h4>
                                        <button
                                            type="button"
                                            onClick={() => addItemToReply(replyIndex, 'potentialRisks')}
                                            style={{ marginLeft: '20px', padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Add Risk
                                        </button>
                                    </div>
                                    {reply.potentialRisks.map((risk, riskIndex) => (
                                        <div key={riskIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                            <input
                                                type="text"
                                                value={risk}
                                                onChange={e => {
                                                    const newReplies = [...formData.potentialReplies]
                                                    newReplies[replyIndex].potentialRisks[riskIndex] = e.target.value
                                                    setFormData(prev => ({ ...prev, potentialReplies: newReplies }))
                                                }}
                                                style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => deleteItemFromReply(replyIndex, 'potentialRisks', riskIndex)}
                                                style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Arguments Section */}
                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                        <h4 style={{ margin: 0, color: '#666' }}>Arguments</h4>
                                        <button
                                            type="button"
                                            onClick={() => addArgument(replyIndex)}
                                            style={{ marginLeft: '20px', padding: '8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Add Argument
                                        </button>
                                    </div>
                                    {reply.arguments.map((arg, argIndex) => (
                                        <div key={argIndex} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '4px' }}>
                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Argument"
                                                    value={arg.argument}
                                                    onChange={e => {
                                                        const newReplies = [...formData.potentialReplies]
                                                        newReplies[replyIndex].arguments[argIndex].argument = e.target.value
                                                        setFormData(prev => ({ ...prev, potentialReplies: newReplies }))
                                                    }}
                                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => deleteArgument(replyIndex, argIndex)}
                                                    style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => addQualityImpact(replyIndex, argIndex)}
                                                    style={{ padding: '8px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Add Impact
                                                </button>
                                            </div>

                                            {/* Quality Impacts */}
                                            {arg.qualityImpacts.map((impact, impactIndex) => (
                                                <div key={impactIndex} style={{ marginLeft: '20px', marginBottom: '8px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                    <select
                                                        value={impact.quality}
                                                        onChange={e => handleQualityImpactChange(replyIndex, argIndex, impactIndex, 'quality', e.target.value)}
                                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    >
                                                        {Object.values(Quality).map(q => (
                                                            <option key={q} value={q}>{q}</option>
                                                        ))}
                                                    </select>
                                                    <select
                                                        value={impact.impact}
                                                        onChange={e => handleQualityImpactChange(replyIndex, argIndex, impactIndex, 'impact', e.target.value)}
                                                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    >
                                                        {Object.values(Impact).map(i => (
                                                            <option key={i} value={i}>{i}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        placeholder="Notes"
                                                        value={impact.notes}
                                                        onChange={e => handleQualityImpactChange(replyIndex, argIndex, impactIndex, 'notes', e.target.value)}
                                                        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteQualityImpact(replyIndex, argIndex, impactIndex)}
                                                        style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Key Considerations Section */}
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <h3>Key Considerations</h3>
                        <button
                            type="button"
                            onClick={addKeyConsideration}
                            style={{ marginLeft: 'auto', padding: '4px 8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Add Consideration
                        </button>
                    </div>
                    {formData.potentialKeyConsiderations.map((consideration, index) => (
                        <div key={index} style={{ 
                            marginBottom: '15px', 
                            padding: '15px', 
                            border: '1px solid #ccc', 
                            borderRadius: '4px' 
                        }}>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Description"
                                    value={consideration.description}
                                    onChange={e => {
                                        const newConsiderations = [...formData.potentialKeyConsiderations]
                                        newConsiderations[index] = { 
                                            ...consideration, 
                                            description: e.target.value 
                                        }
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            potentialKeyConsiderations: newConsiderations 
                                        }))
                                    }}
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => deleteKeyConsideration(index)}
                                    style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Delete
                                </button>
                            </div>

                            {/* External References Section */}
                            <div style={{ marginLeft: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h4 style={{ margin: 0, color: '#666' }}>External References</h4>
                                    <button
                                        type="button"
                                        onClick={() => addExternalReference(index)}
                                        style={{ marginLeft: '20px', padding: '4px 8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Add Reference
                                    </button>
                                </div>
                                {consideration.externalReferences.map((reference, refIndex) => (
                                                                       <div key={refIndex} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                                                                       <input
                                                                           type="text"
                                                                           placeholder="External Reference URL"
                                                                           value={reference}
                                                                           onChange={e => {
                                                                               const newConsiderations = [...formData.potentialKeyConsiderations]
                                                                               newConsiderations[index].externalReferences[refIndex] = e.target.value
                                                                               setFormData(prev => ({ 
                                                                                   ...prev, 
                                                                                   potentialKeyConsiderations: newConsiderations 
                                                                               }))
                                                                           }}
                                                                           style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                                       />
                                                                       <button
                                                                           type="button"
                                                                           onClick={() => deleteExternalReference(index, refIndex)}
                                                                           style={{ padding: '8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                                       >
                                                                           Delete
                                                                       </button>
                                                                   </div>
                                                               ))}
                                                           </div>
                                                       </div>
                                                   ))}
                                               </div>
                               
                                               {/* Related Concepts Section */}
                                               <div style={{ marginBottom: '20px' }}>
                                                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                       <h3>Related Concepts</h3>
                                                       <button
                                                           type="button"
                                                           onClick={addRelatedConcept}
                                                           style={{ marginLeft: 'auto', padding: '4px 8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                       >
                                                           Add Related Concept
                                                       </button>
                                                   </div>
                                                   {formData.relatedConcepts?.map((concept, index) => (
                                                       <div key={index} style={{ 
                                                           marginBottom: '15px', 
                                                           padding: '15px', 
                                                           border: '1px solid #ccc', 
                                                           borderRadius: '4px' 
                                                       }}>
                                                           <div style={{ marginBottom: '10px' }}>
                                                               <label style={{ display: 'block', marginBottom: '5px' }}>Search Query Definition:</label>
                                                               <input
                                                                   type="text"
                                                                   value={concept.searchQueryDefinition}
                                                                   onChange={e => updateRelatedConcept(index, 'searchQueryDefinition', e.target.value)}
                                                                   style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                               />
                                                           </div>
                                                           <div style={{ marginBottom: '10px' }}>
                                                               <label style={{ display: 'block', marginBottom: '5px' }}>Relation Description:</label>
                                                               <textarea
                                                                   value={concept.relationDescription}
                                                                   onChange={e => updateRelatedConcept(index, 'relationDescription', e.target.value)}
                                                                   style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '60px' }}
                                                               />
                                                           </div>
                                                           <button
                                                               type="button"
                                                               onClick={() => removeRelatedConcept(index)}
                                                               style={{ padding: '4px 8px', backgroundColor: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                           >
                                                               Remove
                                                           </button>
                                                       </div>
                                                   ))}
                                               </div>
                               
                                               {/* Notes Field */}
                                               <div style={{ marginBottom: '20px' }}>
                                                   <label style={{ display: 'block', marginBottom: '8px' }}>Notes:</label>
                                                   <textarea
                                                       value={formData.notes}
                                                       onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                                       style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px' }}
                                                   />
                                               </div>
                               
                                               {/* Action Buttons */}
                                               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                   <button 
                                                       type="submit" 
                                                       style={{ padding: '8px 16px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                   >
                                                       {submitButtonText}
                                                   </button>
                                                   <button
                                                       type="button"
                                                       onClick={() => navigate('/questions')}
                                                       style={{ padding: '8px 16px', backgroundColor: '#ccc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                                   >
                                                       Cancel
                                                   </button>
                                               </div>
                                           </form>
                                       </div>
                                   )
                               }
