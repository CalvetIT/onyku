import { Question } from '../../domain/entities/Question'
import { questions } from '../../index'

export class InMemoryQuestionService {
    async getAll(): Promise<Question[]> {
        return questions.map(q => ({
            ...q,
            relatedConcepts: Array.isArray(q.relatedConcepts) ? q.relatedConcepts : [],
            potentialReplies: Array.isArray(q.potentialReplies) ? q.potentialReplies : [],
            potentialKeyConsiderations: Array.isArray(q.potentialKeyConsiderations) ? q.potentialKeyConsiderations : [],
            diagrams: Array.isArray(q.diagrams) ? q.diagrams : []
        }))
    }

    async getById(id: string): Promise<Question | undefined> {
        const question = questions.find(q => q.id === id)
        if (!question) return undefined

        return {
            ...question,
            relatedConcepts: Array.isArray(question.relatedConcepts) ? question.relatedConcepts : [],
            potentialReplies: Array.isArray(question.potentialReplies) ? question.potentialReplies : [],
            potentialKeyConsiderations: Array.isArray(question.potentialKeyConsiderations) ? question.potentialKeyConsiderations : [],
            diagrams: Array.isArray(question.diagrams) ? question.diagrams : []
        }
    }

    async create(question: Question): Promise<Question> {
        const newQuestion = {
            ...question,
            relatedConcepts: Array.isArray(question.relatedConcepts) ? question.relatedConcepts : [],
            potentialReplies: Array.isArray(question.potentialReplies) ? question.potentialReplies : [],
            potentialKeyConsiderations: Array.isArray(question.potentialKeyConsiderations) ? question.potentialKeyConsiderations : [],
            diagrams: Array.isArray(question.diagrams) ? question.diagrams : []
        }
        questions.push(newQuestion)
        return newQuestion
    }

    async update(id: string, updatedQuestion: Partial<Question>): Promise<Question> {
        const index = questions.findIndex(q => q.id === id)
        if (index === -1) throw new Error('Question not found')
        
        const existingQuestion = questions[index]
        const mergedQuestion = {
            ...existingQuestion,
            ...updatedQuestion,
            relatedConcepts: Array.isArray(updatedQuestion.relatedConcepts) 
                ? updatedQuestion.relatedConcepts 
                : (existingQuestion.relatedConcepts || []),
            potentialReplies: Array.isArray(updatedQuestion.potentialReplies) 
                ? updatedQuestion.potentialReplies 
                : (existingQuestion.potentialReplies || []),
            potentialKeyConsiderations: Array.isArray(updatedQuestion.potentialKeyConsiderations) 
                ? updatedQuestion.potentialKeyConsiderations 
                : (existingQuestion.potentialKeyConsiderations || []),
            diagrams: Array.isArray(updatedQuestion.diagrams)
                ? updatedQuestion.diagrams
                : (existingQuestion.diagrams || [])
        }
        
        questions[index] = mergedQuestion
        return mergedQuestion
    }

    async delete(id: string): Promise<boolean> {
        const index = questions.findIndex(q => q.id === id)
        if (index === -1) return false
        
        questions.splice(index, 1)
        return true
    }

    async initializeWithData(loadedQuestions: Question[]): Promise<void> {
        // Clear existing data
        questions.length = 0
        // Add new data with array initialization
        questions.push(...loadedQuestions.map(q => ({
            ...q,
            relatedConcepts: Array.isArray(q.relatedConcepts) ? q.relatedConcepts : [],
            potentialReplies: Array.isArray(q.potentialReplies) ? q.potentialReplies : [],
            potentialKeyConsiderations: Array.isArray(q.potentialKeyConsiderations) ? q.potentialKeyConsiderations : [],
            diagrams: Array.isArray(q.diagrams) ? q.diagrams : []
        })))
    }
} 