import { Task } from '../../domain/entities/Task'
import { tasks } from '../../index'

export class InMemoryTaskService {
    createTask(task: Task): Task {
        tasks.push(task)
        return task
    }

    getTaskById(id: string): Task | undefined {
        return tasks.find(task => task.id === id)
    }

    getTasks(): Task[] {
        return tasks
    }

    updateTask(task: Task): void {
        const index = tasks.findIndex(t => t.id === task.id)
        if (index !== -1) {
            tasks[index] = task
        }
    }

    deleteTask(id: string): void {
        const index = tasks.findIndex(task => task.id === id)
        if (index !== -1) {
            tasks.splice(index, 1)
        }
    }

    initializeWithData(newTasks: Task[]): void {
        tasks.length = 0
        tasks.push(...newTasks)
    }
} 