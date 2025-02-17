import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { Library as DomainLibrary } from "../../domain/entities/Library"

@Entity()
export class LibraryEntity implements DomainLibrary {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({ nullable: true })
    description?: string

    @Column({ nullable: true })
    maintainer?: string
} 