import { Task } from '../../domain/entities/Task'
import { TaskStatus } from '../../domain/enums/TaskStatus'
import { TaskService } from '../task/TaskService'
import { LibraryService } from '../library/LibraryService'
import { SubjectService } from '../subject/SubjectService'
import { QuestionService } from '../question/QuestionService'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs/promises'
import * as path from 'path'

const taskService = new TaskService()
const libraryService = new LibraryService()
const subjectService = new SubjectService()
const questionService = new QuestionService()

export async function exportLibraryCloneToLocalFolder(libraryId: string, folderPath: string): Promise<Task> {
    // Create and start task
    const task = new Task()
    task.id = uuidv4()
    task.status = TaskStatus.PROCESSING
    task.createdAt = new Date()
    await taskService.createTask(task)

    try {
        // Get library
        const library = await libraryService.getById(libraryId)
        if (!library) {
            throw new Error('Library not found')
        }

        // Create folder structure
        await fs.mkdir(folderPath, { recursive: true })
        await fs.mkdir(path.join(folderPath, 'subjects'), { recursive: true })

        // Write library.json
        await fs.writeFile(
            path.join(folderPath, 'library.json'),
            JSON.stringify(library, null, 2)
        )

        // Get and write subjects
        const subjects = await subjectService.getByLibraryId(libraryId)
        for (const subject of subjects) {
            const subjectFolder = path.join(folderPath, 'subjects', subject.id)
            await fs.mkdir(subjectFolder, { recursive: true })
            await fs.mkdir(path.join(subjectFolder, 'questions'), { recursive: true })

            // Write subject.json
            await fs.writeFile(
                path.join(subjectFolder, 'subject.json'),
                JSON.stringify(subject, null, 2)
            )

            // Get and write questions
            const questions = await questionService.getBySubjectId(subject.id)
            for (const question of questions) {
                await fs.writeFile(
                    path.join(subjectFolder, 'questions', `${question.id}.json`),
                    JSON.stringify(question, null, 2)
                )
            }
        }

        task.status = TaskStatus.COMPLETED
        await taskService.updateTask(task)
        return task

    } catch (error) {
        task.status = TaskStatus.FAILED
        await taskService.updateTask(task)
        throw error
    }
} 