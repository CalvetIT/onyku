import { Subject } from '../../domain/entities/Subject'
import { subjects } from '../../index'

export class InMemorySubjectService {
    async create(subject: Subject): Promise<Subject> {
        subjects.push(subject)
        return subject
    }

    async update(id: string, updatedSubject: Subject): Promise<Subject> {
        const index = subjects.findIndex(sub => sub.id === id)
        if (index === -1) throw new Error('Subject not found')
        
        subjects[index] = {
            ...subjects[index],
            ...updatedSubject
        }
        
        return subjects[index]
    }

    async delete(id: string): Promise<boolean> {
        const index = subjects.findIndex(sub => sub.id === id)
        if (index === -1) return false
        
        subjects.splice(index, 1)
        return true
    }

    async getAll(): Promise<Subject[]> {
        return subjects
    }

    async getById(id: string): Promise<Subject | undefined> {
        return subjects.find(sub => sub.id === id)
    }

    async initializeWithData(loadedSubjects: Subject[]): Promise<void> {
        // Clear existing data
        subjects.length = 0
        // Add new data
        subjects.push(...loadedSubjects)
    }
} 