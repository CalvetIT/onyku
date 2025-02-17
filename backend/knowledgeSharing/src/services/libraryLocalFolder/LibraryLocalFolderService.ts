import { Task } from '../../domain/entities/Task'
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'
import { exportLibraryCopyToLocalFolder } from './exportLibraryCopyToLocalFolder'
import { exportLibraryCloneToLocalFolder } from './exportLibraryCloneToLocalFolder'
import { importLibraryCopyFromLocalFolder } from './importLibraryCopyFromLocalFolder'
import { importLibraryCloneFromLocalFolder } from './importLibraryCloneFromLocalFolder'

export class LibraryLocalFolderService {
    async exportLibraryCopy(libraryId: string, folderPath: string): Promise<Task> {
        return await exportLibraryCopyToLocalFolder(libraryId, folderPath)
    }

    async exportLibraryClone(libraryId: string, folderPath: string): Promise<Task> {
        return await exportLibraryCloneToLocalFolder(libraryId, folderPath)
    }

    async importLibraryCopy(folderPath: string): Promise<Task> {
        return await importLibraryCopyFromLocalFolder(folderPath)
    }

    async importLibraryClone(
        folderPath: string, 
        idConflictPolicy: IdConflictPolicy = IdConflictPolicy.DO_NOT_MERGE
    ): Promise<Task> {
        return await importLibraryCloneFromLocalFolder(folderPath, idConflictPolicy)
    }
} 