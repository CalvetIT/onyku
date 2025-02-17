import { Entity, PrimaryColumn, Column } from "typeorm"
import { Task } from "../../domain/entities/Task"
import { TaskStatus } from "../../domain/enums/TaskStatus"

@Entity()
export class TaskTypeOrmEntity implements Task {
    @PrimaryColumn()
    id: string

    @Column({
        type: "enum",
        enum: TaskStatus
    })
    status: TaskStatus

    @Column()
    createdAt: Date
} 