import { TransferFileService } from '../transferFile/TransferFileService'
import { LibraryLocalFolderService } from '../libraryLocalFolder/LibraryLocalFolderService'
import { TransferFileMetadata } from '../../domain/entities/TransferFileMetadata'
import * as path from 'path'
import * as fs from 'fs/promises'
import AdmZip = require('adm-zip')
import rimraf = require('rimraf')
import { promisify } from 'util'

const rimrafAsync = promisify(rimraf)
const TEMP_EXPORT_DIR = path.join(process.cwd(), 'storage', 'temp', 'libraryExport')
const transferFileService = new TransferFileService()
const libraryLocalFolderService = new LibraryLocalFolderService()

export async function exportLibraryCopyForDownloadAsZipFile(libraryId: string): Promise<TransferFileMetadata> {
    // Clean/create temp directory
    await rimrafAsync(TEMP_EXPORT_DIR)
    await fs.mkdir(TEMP_EXPORT_DIR, { recursive: true })

    try {
        // Export to temp directory using the service
        await libraryLocalFolderService.exportLibraryCopy(libraryId, TEMP_EXPORT_DIR)

        // Create ZIP file
        const zip = new AdmZip()
        zip.addLocalFolder(TEMP_EXPORT_DIR)
        
        // Generate ZIP file name
        const zipFileName = `library_copy_${libraryId}_${new Date().toISOString()}.zip`
        const zipFilePath = path.join(process.cwd(), 'storage', 'transferFiles', zipFileName)
        
        // Write ZIP file
        zip.writeZip(zipFilePath)

        // Create transfer file metadata
        return await transferFileService.createFromServerGeneratedFile(zipFilePath)
    } finally {
        // Clean up temp directory
        await rimrafAsync(TEMP_EXPORT_DIR)
    }
} 