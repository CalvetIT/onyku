export enum LibraryDistributionStatus {
    LOCAL = 'LOCAL',           // Local only, no sync
    PUBLISHED = 'PUBLISHED',   // Source of truth, can be subscribed to
    SUBSCRIBED = 'SUBSCRIBED'  // Copy of a published library
} 