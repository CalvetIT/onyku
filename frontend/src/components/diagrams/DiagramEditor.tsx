import React from 'react'
import { DiagramPreview } from './DiagramPreview'
import { DiagramEditorProps } from './types'

export function DiagramEditor({ 
    diagram, 
    onUpdate, 
    onDelete, 
    isPreviewOpen, 
    onTogglePreview 
}: DiagramEditorProps) {
    const handleDiagramCodeChange = (newCode: string) => {
        // Close preview when code changes
        if (isPreviewOpen) {
            onTogglePreview()
        }
        onUpdate({ diagramCode: newCode })
    }

    return (
        <div style={{ 
            marginBottom: '15px', 
            padding: '15px', 
            border: '1px solid #ccc', 
            borderRadius: '4px' 
        }}>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    value={diagram.title}
                    onChange={e => onUpdate({ title: e.target.value })}
                    placeholder="Diagram Title"
                    style={{ 
                        width: '100%',
                        padding: '8px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        border: '1px solid #ccc'
                    }}
                />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <textarea
                    value={diagram.diagramCode}
                    onChange={e => handleDiagramCodeChange(e.target.value)}
                    style={{ 
                        flex: 1, 
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid #ccc',
                        minHeight: '100px',
                        fontFamily: 'monospace'
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {!isPreviewOpen && (
                        <button
                            type="button"
                            onClick={onTogglePreview}
                            style={{ 
                                padding: '8px', 
                                backgroundColor: '#4CAF50', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer' 
                            }}
                        >
                            Preview
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onDelete}
                        style={{ 
                            padding: '8px', 
                            backgroundColor: '#ff4444', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>

            {isPreviewOpen && (
                <DiagramPreview
                    diagram={diagram}
                    onClose={onTogglePreview}
                />
            )}
        </div>
    )
} 