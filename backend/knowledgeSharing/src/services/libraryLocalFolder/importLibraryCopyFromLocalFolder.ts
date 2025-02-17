import { Task } from '../../domain/entities/Task'
import { TaskStatus } from '../../domain/enums/TaskStatus'
import { TaskService } from '../task/TaskService'
import { LibraryService } from '../library/LibraryService'
import { SubjectService } from '../subject/SubjectService'
import { QuestionService } from '../question/QuestionService'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Library } from '../../domain/entities/Library'
import { Subject } from '../../domain/entities/Subject'
import { Question } from '../../domain/entities/Question'

const taskService = new TaskService()
const libraryService = new LibraryService()
const subjectService = new SubjectService()
const questionService = new QuestionService()

export async function importLibraryCopyFromLocalFolder(
    folderPath: string
): Promise<Task> {
    // Create and start task
    const task = new Task()
    task.id = uuidv4()
    task.status = TaskStatus.PROCESSING
    task.createdAt = new Date()
    await taskService.createTask(task)

    try {
        // Read and copy library.json
        const libraryData = JSON.parse(
            await fs.readFile(path.join(folderPath, 'library.json'), 'utf-8')
        ) as Library
        const newLibraryId = uuidv4()
        const newLibrary: Library = { ...libraryData, id: newLibraryId }

        console.log('Library data:', newLibrary) // Debug log

        // Map to store old ID to new ID mappings
        const idMap = new Map<string, string>()
        idMap.set(libraryData.id, newLibraryId)

        // Check if subjects folder exists
        const subjectsPath = path.join(folderPath, 'subjects')
        let hasSubjectsFolder = false
        try {
            await fs.access(subjectsPath)
            hasSubjectsFolder = true
        } catch {
            console.log('No subjects folder found') // Debug log
        }

        // Collect all subjects and questions if they exist
        const newSubjects: Subject[] = []
        const newQuestions: Question[] = []

        if (hasSubjectsFolder) {
            // Scan subjects folder
            const subjectFolders = await fs.readdir(subjectsPath)
            
            for (const subjectFolder of subjectFolders) {
                const subjectJsonPath = path.join(subjectsPath, subjectFolder, 'subject.json')
                try {
                    const subjectData = JSON.parse(
                        await fs.readFile(subjectJsonPath, 'utf-8')
                    ) as Subject
                    
                    // Create new ID for subject
                    const newSubjectId = uuidv4()
                    idMap.set(subjectData.id, newSubjectId)
                    
                    const newSubject: Subject = {
                        ...subjectData,
                        id: newSubjectId,
                        libraryId: newLibraryId
                    }
                    newSubjects.push(newSubject)

                    // Check if questions folder exists for this subject
                    const questionsPath = path.join(subjectsPath, subjectFolder, 'questions')
                    let hasQuestionsFolder = false
                    try {
                        await fs.access(questionsPath)
                        hasQuestionsFolder = true
                    } catch {
                        console.log(`No questions folder found for subject ${subjectFolder}`) // Debug log
                        continue // Skip questions for this subject
                    }

                    if (hasQuestionsFolder) {
                        // Scan questions
                        const questionFiles = await fs.readdir(questionsPath)
                        
                        for (const questionFile of questionFiles) {
                            const questionData = JSON.parse(
                                await fs.readFile(path.join(questionsPath, questionFile), 'utf-8')
                            ) as Question
                            
                            // Create new ID for question
                            const newQuestionId = uuidv4()
                            idMap.set(questionData.id, newQuestionId)
                            
                            const newQuestion: Question = {
                                ...questionData,
                                id: newQuestionId,
                                subjectId: newSubjectId
                            }
                            newQuestions.push(newQuestion)
                        }
                    }
                } catch (error) {
                    console.log(`Error reading subject ${subjectFolder}:`, error) // Debug log
                    continue // Skip this subject if there's an error
                }
            }
        }

        // Update references using idMap
        // (This would be where you update any cross-references in your entities)

        // Check for conflicts
        const conflicts = {
            libraryConflict: await libraryService.getById(newLibraryId),
            subjectConflicts: await Promise.all(
                newSubjects.map(s => subjectService.getById(s.id))
            ),
            questionConflicts: await Promise.all(
                newQuestions.map(q => questionService.getById(q.id))
            )
        }

        console.log('Conflicts:', conflicts)

        const hasConflicts = conflicts.libraryConflict || 
            conflicts.subjectConflicts.some((s) => s !== null && s !== undefined) ||
            conflicts.questionConflicts.some((q) => q !== null && q !== undefined)

        if (hasConflicts) {
            task.status = TaskStatus.FAILED
            await taskService.updateTask(task)
            return task
        }

        // Create new library
        await libraryService.create(newLibrary)

        // Create new subjects
        for (const subject of newSubjects) {
            await subjectService.create(subject)
        }

        // Create new questions
        for (const question of newQuestions) {
            await questionService.create(question)
        }

        task.status = TaskStatus.COMPLETED
        await taskService.updateTask(task)
        return task

    } catch (error) {
        console.error('Import error:', error) // Debug log
        task.status = TaskStatus.FAILED
        await taskService.updateTask(task)
        return task
    }
} 