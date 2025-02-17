import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface FormData {
  name: string
  description?: string
  maintainer?: string
}

interface LibraryFormProps {
  onSubmit: (data: FormData) => Promise<void>
  title: string
  submitButtonText: string
  mode: 'create' | 'edit'
  initialData?: FormData
}

const defaultFormData: FormData = {
  name: '',
  description: '',
  maintainer: ''
}

export function LibraryForm({ 
  onSubmit, 
  title, 
  submitButtonText, 
  mode, 
  initialData = defaultFormData 
}: LibraryFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>(initialData)

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
    navigate('/libraries')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>{title}</h1>
      
      <form onSubmit={handleSubmit}>
        {/* Name Field */}
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

        {/* Description Field */}
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

        {/* Maintainer Field */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Maintainer
          </label>
          <input
            type="text"
            name="maintainer"
            value={formData.maintainer}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>

        {/* Action Buttons */}
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
            onClick={() => navigate('/libraries')}
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