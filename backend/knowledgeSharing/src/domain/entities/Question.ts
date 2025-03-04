import { PotentialReply } from '../valueObjects/PotentialReply';
import { PotentialKeyConsideration } from '../valueObjects/PotentialKeyConsideration';
import { RelatedConcept } from '../valueObjects/RelatedConcept';
import { Diagram } from '../valueObjects/Diagram';

export interface Question {
    id: string;
    question: string;
    notes?: string;
    subjectId?: string;
    potentialReplies?: PotentialReply[];
    potentialKeyConsiderations?: PotentialKeyConsideration[];
    relatedConcepts?: RelatedConcept[];
    diagrams?: Diagram[];
} 