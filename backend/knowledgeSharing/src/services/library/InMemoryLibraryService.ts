import { Library } from '../../domain/entities/Library'
import { libraries } from '../../index'  // Import the live array

export class InMemoryLibraryService {
    async create(library: Library): Promise<Library> {
        libraries.push(library)
        return library
    }

    async update(id: string, updatedLibrary: Library): Promise<Library> {
        const index = libraries.findIndex(lib => lib.id === id)
        if (index === -1) throw new Error('Library not found')
        
        libraries[index] = {
            ...libraries[index],
            ...updatedLibrary
        }
        
        return libraries[index]
    }

    async delete(id: string): Promise<boolean> {
        const index = libraries.findIndex(lib => lib.id === id)
        if (index === -1) return false
        
        libraries.splice(index, 1)
        return true
    }

    async getAll(): Promise<Library[]> {
        return libraries
    }

    async getById(id: string): Promise<Library | undefined> {
        return libraries.find(lib => lib.id === id)
    }

    async initializeWithData(loadedLibraries: Library[]): Promise<void> {
        // Clear existing data
        libraries.length = 0
        // Add new data
        libraries.push(...loadedLibraries)
    }
} 