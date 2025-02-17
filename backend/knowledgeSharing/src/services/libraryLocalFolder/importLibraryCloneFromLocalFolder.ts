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
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'

const taskService = new TaskService()
const libraryService = new LibraryService()
const subjectService = new SubjectService()
const questionService = new QuestionService()

export async function importLibraryCloneFromLocalFolder(
    folderPath: string,
    idConflictPolicy: IdConflictPolicy
): Promise<Task> {
    // Create and start task
    const task = new Task()
    task.id = uuidv4()
    task.status = TaskStatus.PROCESSING
    task.createdAt = new Date()
    await taskService.createTask(task)

    try {
        // Read library.json
        const libraryData = JSON.parse(
            await fs.readFile(path.join(folderPath, 'library.json'), 'utf-8')
        ) as Library

        console.log('Library data:', libraryData) // Debug log

        // Collect all IDs from the import folder
        const importIds = {
            libraryId: libraryData.id,
            subjectIds: new Set<string>(),
            questionIds: new Set<string>()
        }

        // Check if subjects folder exists
        const subjectsPath = path.join(folderPath, 'subjects')
        let hasSubjectsFolder = false
        try {
            await fs.access(subjectsPath)
            hasSubjectsFolder = true
        } catch {
            console.log('No subjects folder found') // Debug log
        }

        if (hasSubjectsFolder) {
            // Scan subjects folder
            const subjectFolders = await fs.readdir(subjectsPath)
            
            for (const subjectFolder of subjectFolders) {
                const subjectJsonPath = path.join(subjectsPath, subjectFolder, 'subject.json')
                try {
                    const subjectData = JSON.parse(
                        await fs.readFile(subjectJsonPath, 'utf-8')
                    ) as Subject
                    importIds.subjectIds.add(subjectData.id)

                    // Check if questions folder exists for this subject
                    const questionsPath = path.join(subjectsPath, subjectFolder, 'questions')
                    let hasQuestionsFolder = false
                    try {
                        await fs.access(questionsPath)
                        hasQuestionsFolder = true
                    } catch {
                        console.log(`No questions folder found for subject ${subjectFolder}`) // Debug log
                    }

                    if (hasQuestionsFolder) {
                        // Scan questions
                        const questionFiles = await fs.readdir(questionsPath)
                        
                        for (const questionFile of questionFiles) {
                            const questionData = JSON.parse(
                                await fs.readFile(path.join(questionsPath, questionFile), 'utf-8')
                            ) as Question
                            importIds.questionIds.add(questionData.id)
                        }
                    }
                } catch (error) {
                    console.log(`Error reading subject ${subjectFolder}:`, error) // Debug log
                    continue // Skip this subject if there's an error
                }
            }
        }

        // Check for conflicts
        const existingLibrary = await libraryService.getById(libraryData.id)
        console.log('Existing library:', existingLibrary)

        const conflicts = {
            libraryConflict: existingLibrary !== null && existingLibrary !== undefined,
            subjectConflicts: await Promise.all(
                Array.from(importIds.subjectIds).map(id => subjectService.getById(id))
            ),
            questionConflicts: await Promise.all(
                Array.from(importIds.questionIds).map(id => questionService.getById(id))
            )
        }

        console.log('Conflicts:', conflicts)

        const hasConflicts = conflicts.libraryConflict || 
            conflicts.subjectConflicts.some((s) => s !== null && s !== undefined) ||
            conflicts.questionConflicts.some((q) => q !== null && q !== undefined)

        if (hasConflicts && idConflictPolicy === IdConflictPolicy.DO_NOT_MERGE) {
            task.status = TaskStatus.FAILED
            await taskService.updateTask(task)
            return task
        }

        // Import library
        if (existingLibrary && idConflictPolicy === IdConflictPolicy.MERGE) {
            console.log('Merging library:', { existing: existingLibrary, new: libraryData })
            await libraryService.update(libraryData.id, {
                ...existingLibrary,
                ...libraryData,
                id: existingLibrary.id
            })
        } else {
            console.log('Creating new library:', libraryData)
            await libraryService.create(libraryData)
        }

        // Import subjects if they exist
        if (hasSubjectsFolder) {
            const subjectFolders = await fs.readdir(subjectsPath)
            
            for (const subjectFolder of subjectFolders) {
                try {
                    const subjectData = JSON.parse(
                        await fs.readFile(path.join(subjectsPath, subjectFolder, 'subject.json'), 'utf-8')
                    ) as Subject
                    
                    const existingSubject = await subjectService.getById(subjectData.id)
                    if (existingSubject) {
                        if (idConflictPolicy === IdConflictPolicy.MERGE) {
                            await subjectService.update(subjectData.id, {
                                ...existingSubject,
                                ...subjectData,
                                id: existingSubject.id
                            })
                        }
                    } else {
                        await subjectService.create(subjectData)
                    }

                    // Check if questions folder exists for this subject
                    const questionsPath = path.join(subjectsPath, subjectFolder, 'questions')
                    let hasQuestionsFolder = false
                    try {
                        await fs.access(questionsPath)
                        hasQuestionsFolder = true
                    } catch {
                        continue // Skip questions for this subject
                    }

                    if (hasQuestionsFolder) {
                        // Import questions
                        const questionFiles = await fs.readdir(questionsPath)
                        
                        for (const questionFile of questionFiles) {
                            const questionData = JSON.parse(
                                await fs.readFile(path.join(questionsPath, questionFile), 'utf-8')
                            ) as Question
                            
                            const existingQuestion = await questionService.getById(questionData.id)
                            if (existingQuestion) {
                                if (idConflictPolicy === IdConflictPolicy.MERGE) {
                                    await questionService.update(questionData.id, {
                                        ...existingQuestion,
                                        ...questionData,
                                        id: existingQuestion.id
                                    })
                                }
                            } else {
                                await questionService.create(questionData)
                            }
                        }
                    }
                } catch (error) {
                    console.log(`Error processing subject ${subjectFolder}:`, error)
                    continue // Skip this subject if there's an error
                }
            }
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