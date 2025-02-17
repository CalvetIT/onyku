import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetLibraries } from '../hooks/useLibraries'

export interface FormData {
  name: string
  description?: string
  libraryId?: string  // Optional
}

interface SubjectFormProps {
  onSubmit: (data: FormData) => Promise<void>
  onCancel: () => void
  title: string
  submitButtonText: string
  mode: 'create' | 'edit'
  initialData?: FormData
}

const defaultFormData: FormData = {
  name: '',
  description: '',
  libraryId: undefined  // Default to undefined
}

export function SubjectForm({ 
  onSubmit, 
  onCancel,
  title, 
  submitButtonText, 
  mode, 
  initialData = defaultFormData 
}: SubjectFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(initialData)
  const { data: libraries } = useGetLibraries()

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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? undefined : value  // Convert empty string to undefined for libraryId
    }))
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>{title}</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>Library:</label>
          <select
            name="libraryId"
            value={formData.libraryId || ''}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            <option value="">No Library (Orphaned)</option>
            {libraries?.map(library => (
              <option key={library.id} value={library.id}>
                {library.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              minHeight: '100px'
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {submitButtonText}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 