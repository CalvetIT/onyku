import { TaskStatus } from '../enums/TaskStatus'

export class Task {
    id: string
    status: TaskStatus
    createdAt: Date
} 