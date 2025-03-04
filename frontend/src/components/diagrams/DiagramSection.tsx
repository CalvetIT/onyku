import React from 'react'
import { DiagramEditor } from './DiagramEditor'
import { Diagram, DiagramSectionProps } from './types'

export function DiagramSection({ diagrams = [], onChange }: DiagramSectionProps) {
    const [openPreviews, setOpenPreviews] = React.useState<Record<number, boolean>>({})

    const addDiagram = () => {
        const newDiagram: Diagram = {
            title: '',
            diagramCode: '```mermaid\ngraph TD;\n    A-->B;\n```'
        }
        onChange([...diagrams, newDiagram])
    }

    const handleUpdate = (index: number, updates: Partial<Diagram>) => {
        const newDiagrams = [...diagrams]
        newDiagrams[index] = { ...newDiagrams[index], ...updates }
        onChange(newDiagrams)
    }

    const handleDelete = (index: number) => {
        onChange(diagrams.filter((_, i) => i !== index))
    }

    const togglePreview = (index: number) => {
        setOpenPreviews(prev => ({
            ...prev,
            [index]: !prev[index]
        }))
    }

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3>Diagrams</h3>
                <button
                    type="button"
                    onClick={addDiagram}
                    style={{ marginLeft: 'auto', padding: '4px 8px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Add Diagram
                </button>
            </div>
            
            {diagrams.map((diagram, index) => (
                <DiagramEditor
                    key={index}
                    diagram={diagram}
                    onUpdate={(updates) => handleUpdate(index, updates)}
                    onDelete={() => handleDelete(index)}
                    isPreviewOpen={!!openPreviews[index]}
                    onTogglePreview={() => togglePreview(index)}
                />
            ))}
        </div>
    )
} 