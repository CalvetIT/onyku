import { GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLEnumType } from 'graphql'
import { Task } from '../../domain/entities/Task'
import { TaskStatus } from '../../domain/enums/TaskStatus'

const TaskStatusType = new GraphQLEnumType({
    name: 'TaskStatus',
    description: 'Status of a task',
    values: {
        PROCESSING: { value: TaskStatus.PROCESSING },
        COMPLETED: { value: TaskStatus.COMPLETED },
        FAILED: { value: TaskStatus.FAILED }
    }
})

export const TaskType = new GraphQLObjectType({
    name: 'Task',
    description: 'A task representing an ongoing or completed operation',
    fields: {
        id: { 
            type: new GraphQLNonNull(GraphQLString),
            description: 'Unique identifier of the task'
        },
        status: { 
            type: new GraphQLNonNull(TaskStatusType),
            description: 'Current status of the task'
        },
        createdAt: {
            type: new GraphQLNonNull(GraphQLString),
            description: 'When the task was created',
            resolve: (task: Task) => task.createdAt.toISOString()
        }
    }
}) 