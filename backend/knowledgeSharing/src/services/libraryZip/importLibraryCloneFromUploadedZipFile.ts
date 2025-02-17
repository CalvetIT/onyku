import { Task } from '../../domain/entities/Task'
import { TransferFileService } from '../transferFile/TransferFileService'
import { LibraryLocalFolderService } from '../libraryLocalFolder/LibraryLocalFolderService'
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'
import * as path from 'path'
import * as fs from 'fs/promises'
import AdmZip = require('adm-zip')
import rimraf = require('rimraf')
import { promisify } from 'util'

const rimrafAsync = promisify(rimraf)
const TEMP_EXTRACT_DIR = path.join(process.cwd(), 'storage', 'temp', 'libraryImport')
const transferFileService = new TransferFileService()
const libraryLocalFolderService = new LibraryLocalFolderService()

export async function importLibraryCloneFromUploadedZipFile(
    transferFileId: string,
    idConflictPolicy: IdConflictPolicy
): Promise<Task> {
    // Clean/create temp directory
    await rimrafAsync(TEMP_EXTRACT_DIR)
    await fs.mkdir(TEMP_EXTRACT_DIR, { recursive: true })

    try {
        // Get the uploaded ZIP file
        const { metadata } = await transferFileService.downloadFile(transferFileId)

        if (metadata.mimeType !== 'application/zip') {
            throw new Error('Uploaded file must be a ZIP file')
        }

        // Extract ZIP to temp directory
        const zip = new AdmZip(metadata.path)
        zip.extractAllTo(TEMP_EXTRACT_DIR, true)

        // Import from extracted folder using the service
        return await libraryLocalFolderService.importLibraryClone(TEMP_EXTRACT_DIR, idConflictPolicy)
    } finally {
        // Clean up temp directory
        await rimrafAsync(TEMP_EXTRACT_DIR)
    }
} 