import React from 'react'
import Mermaid from 'react-mermaid2'
import { DiagramPreviewProps, detectDiagramType } from './types'

export function DiagramPreview({ diagram, onClose }: DiagramPreviewProps) {
    const type = detectDiagramType(diagram.diagramCode)

    if (type === 'mermaid') {
        const mermaidCode = diagram.diagramCode
            .replace(/```mermaid\n?/, '')
            .replace(/```$/, '')
            .trim()

        return (
            <div style={{ marginTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ 
                            padding: '4px 8px', 
                            backgroundColor: '#ccc', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                        }}
                    >
                        Close Preview
                    </button>
                </div>
                <Mermaid chart={mermaidCode} />
            </div>
        )
    }

    return (
        <div style={{ color: 'red', marginTop: '5px' }}>
            Invalid diagram format. Must start with ```mermaid and end with ```
        </div>
    )
} 