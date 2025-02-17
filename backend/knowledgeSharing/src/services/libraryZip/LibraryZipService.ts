import { Task } from '../../domain/entities/Task'
import { TransferFileMetadata } from '../../domain/entities/TransferFileMetadata'
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'
import { importLibraryCloneFromUploadedZipFile } from './importLibraryCloneFromUploadedZipFile'
import { importLibraryCopyFromUploadedZipFile } from './importLibraryCopyFromUploadedZipFile'
import { exportLibraryCopyForDownloadAsZipFile } from './exportLibraryCopyForDownloadAsZipFile'
import { exportLibraryCloneForDownloadAsZipFile } from './exportLibraryCloneForDownloadAsZipFile'

export class LibraryZipService {
    async importLibraryCloneFromUploadedZipFile(
        transferFileId: string,
        idConflictPolicy: IdConflictPolicy
    ): Promise<Task> {
        return importLibraryCloneFromUploadedZipFile(transferFileId, idConflictPolicy)
    }

    async importLibraryCopyFromUploadedZipFile(transferFileId: string): Promise<Task> {
        return importLibraryCopyFromUploadedZipFile(transferFileId)
    }

    async exportLibraryCopyForDownloadAsZipFile(libraryId: string): Promise<TransferFileMetadata> {
        return exportLibraryCopyForDownloadAsZipFile(libraryId)
    }

    async exportLibraryCloneForDownloadAsZipFile(libraryId: string): Promise<TransferFileMetadata> {
        return exportLibraryCloneForDownloadAsZipFile(libraryId)
    }
} 