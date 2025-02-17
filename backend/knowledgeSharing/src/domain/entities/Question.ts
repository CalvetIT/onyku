import { PotentialReply } from '../valueObjects/PotentialReply';
import { PotentialKeyConsideration } from '../valueObjects/PotentialKeyConsideration';
import { RelatedConcept } from '../valueObjects/RelatedConcept';

export class Question {
    id: string;
    question: string;
    potentialReplies?: PotentialReply[];
    potentialKeyConsiderations?: PotentialKeyConsideration[];
    subjectId?: string;
    relatedConcepts?: RelatedConcept[];
    notes?: string;
} 