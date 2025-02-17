import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { TransferFileMetadata } from "../../domain/entities/TransferFileMetadata"

@Entity('transfer_file_metadata')
export class TransferFileMetadataTypeOrmEntity implements TransferFileMetadata {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column()
    filename!: string

    @Column()
    mimeType!: string

    @Column()
    size!: number

    @Column()
    path!: string

    @CreateDateColumn()
    createdAt!: Date

    @Column()
    isServerGenerated!: boolean
} 