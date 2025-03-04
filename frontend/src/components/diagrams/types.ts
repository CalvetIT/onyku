// Core diagram data that will be stored in backend
export interface Diagram {
    title: string
    diagramCode: string
}

// Frontend-only type for display logic
export type DiagramType = 'mermaid' | 'unknown'

// Props for the components
export interface DiagramSectionProps {
    diagrams: Diagram[]
    onChange: (diagrams: Diagram[]) => void
}

export interface DiagramEditorProps {
    diagram: Diagram
    onUpdate: (updates: Partial<Diagram>) => void
    onDelete: () => void
    isPreviewOpen: boolean
    onTogglePreview: () => void
}

export interface DiagramPreviewProps {
    diagram: Diagram
    onClose: () => void
}

// Utility to detect diagram type from content
export function detectDiagramType(diagramCode: string): DiagramType {
    if (diagramCode.trim().startsWith('```mermaid')) {
        return 'mermaid'
    }
    return 'unknown'
} 