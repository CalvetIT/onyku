import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'
import { DiagramPreviewProps, detectDiagramType } from './types'

export function DiagramPreview({ diagram, onClose }: DiagramPreviewProps) {
    const mermaidRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Initialize mermaid with modern config
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'monospace'
        })

        const renderDiagram = async () => {
            if (mermaidRef.current) {
                try {
                    mermaidRef.current.innerHTML = ''
                    const mermaidCode = diagram.diagramCode
                        .replace(/```mermaid\n?/, '')
                        .replace(/```$/, '')
                        .trim()
                    
                    console.log('Attempting to render:', mermaidCode)

                    // Modern way to render mermaid
                    const { svg, bindFunctions } = await mermaid.render(
                        'mermaid-diagram-' + Math.random().toString(36).substring(7),
                        mermaidCode
                    )

                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = svg
                        // Bind any interactive elements
                        if (bindFunctions) bindFunctions(mermaidRef.current)
                    }
                } catch (error) {
                    console.error('Mermaid render error:', error)
                    if (mermaidRef.current) {
                        mermaidRef.current.innerHTML = `<div style="color: red">Error rendering diagram: ${error instanceof Error ? error.message : 'Unknown error'}</div>`
                    }
                }
            }
        }

        renderDiagram()
    }, [diagram.diagramCode])

    const type = detectDiagramType(diagram.diagramCode)

    if (type === 'mermaid') {
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
                <div ref={mermaidRef} style={{ minHeight: '50px', backgroundColor: 'white' }}></div>
            </div>
        )
    }

    return (
        <div style={{ color: 'red', marginTop: '5px' }}>
            Invalid diagram format. Must start with ```mermaid and end with ```
        </div>
    )
} 