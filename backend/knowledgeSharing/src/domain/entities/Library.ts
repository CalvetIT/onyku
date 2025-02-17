// import { LibraryDistributionStatus } from '../enums/LibraryDistributionStatus'

export class Library {
    id: string
    name: string
    description?: string

    // distributionStatus: LibraryDistributionStatus

    /**
     * Optional maintainer of the library
     * Required when distributionStatus is PUBLISHED
     */
    maintainer?: string
} 