import { AppDataSource } from '../../typeorm/data-source'
import { TransferFileMetadataTypeOrmEntity } from '../../typeorm/entity/TransferFileMetadataTypeOrmEntity'
import { TransferFileMetadata } from '../../domain/entities/TransferFileMetadata'
import { transferFileMetadatas } from '../../index'
import * as mime from 'mime-types'
import path from 'path'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

export class TransferFileService {
    private persistentService = AppDataSource.getRepository(TransferFileMetadataTypeOrmEntity)
    private static TRANSFER_DIR = path.join(process.cwd(), 'storage', 'transferFiles')

    constructor() {
        if (!fs.existsSync(TransferFileService.TRANSFER_DIR)) {
            fs.mkdirSync(TransferFileService.TRANSFER_DIR, { recursive: true })
        }
    }

    async createFromUpload(file: Express.Multer.File): Promise<TransferFileMetadata> {
        const mimeType = mime.lookup(file.originalname) || 'application/octet-stream'
        
        const metadata = new TransferFileMetadata()
        metadata.id = uuidv4()
        metadata.filename = file.originalname
        metadata.mimeType = mimeType
        metadata.size = file.size
        metadata.path = file.path
        metadata.createdAt = new Date()
        metadata.isServerGenerated = false

        // Save to in-memory array
        transferFileMetadatas.push(metadata)
        
        // Persist to database
        await this.persistentService.save(metadata)
        
        return metadata
    }

    async createFromServerGeneratedFile(filePath: string): Promise<TransferFileMetadata> {
        const stats = fs.statSync(filePath)
        const mimeType = mime.lookup(filePath) || 'application/octet-stream'
        
        const metadata = new TransferFileMetadata()
        metadata.id = uuidv4()
        metadata.filename = path.basename(filePath)
        metadata.mimeType = mimeType
        metadata.size = stats.size
        metadata.path = filePath
        metadata.createdAt = new Date()
        metadata.isServerGenerated = true

        // Save to in-memory array
        transferFileMetadatas.push(metadata)
        
        // Persist to database
        await this.persistentService.save(metadata)
        
        return metadata
    }

    async getById(id: string): Promise<TransferFileMetadata | undefined> {
        return transferFileMetadatas.find(metadata => metadata.id === id)
    }

    async downloadFile(id: string): Promise<{ metadata: TransferFileMetadata; stream: fs.ReadStream }> {
        const metadata = await this.getById(id)
        if (!metadata) {
            throw new Error('File metadata not found')
        }

        if (!fs.existsSync(metadata.path)) {
            throw new Error('File not found on disk')
        }

        const stream = fs.createReadStream(metadata.path)
        return { metadata, stream }
    }

    async loadAllFromDatabase(): Promise<TransferFileMetadata[]> {
        const metadatas = await this.persistentService.find()
        // Update in-memory array
        transferFileMetadatas.length = 0
        transferFileMetadatas.push(...metadatas)
        return transferFileMetadatas
    }

    // Optional: Add cleanup method for old files
    async deleteFile(id: string): Promise<void> {
        const metadata = await this.getById(id)
        if (!metadata) {
            throw new Error('File metadata not found')
        }

        // Remove from disk if exists
        if (fs.existsSync(metadata.path)) {
            fs.unlinkSync(metadata.path)
        }

        // Remove from in-memory array
        const index = transferFileMetadatas.findIndex(m => m.id === id)
        if (index !== -1) {
            transferFileMetadatas.splice(index, 1)
        }

        // Remove from database
        await this.persistentService.delete(id)
    }

    static async loadTransferFileMetadatas(): Promise<TransferFileMetadata[]> {
        const repository = AppDataSource.getRepository(TransferFileMetadataTypeOrmEntity)
        const metadatas = await repository.find()
        
        // Initialize in-memory array
        transferFileMetadatas.length = 0
        transferFileMetadatas.push(...metadatas)
        
        return metadatas
    }

    getAll(): TransferFileMetadata[] {
        return transferFileMetadatas
    }
} 