import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Subject as DomainSubject } from "../../domain/entities/Subject"

@Entity()
export class SubjectEntity implements DomainSubject {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({ nullable: true })
    description?: string

    @Column({ nullable: true })
    libraryId?: string
} 