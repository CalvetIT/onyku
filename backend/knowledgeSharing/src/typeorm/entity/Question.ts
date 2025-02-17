import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Question } from "../../domain/entities/Question";
import { PotentialReply } from "../../domain/valueObjects/PotentialReply";
import { PotentialKeyConsideration } from "../../domain/valueObjects/PotentialKeyConsideration";
import { RelatedConcept } from "../../domain/valueObjects/RelatedConcept";

@Entity('questions')
export class QuestionEntity implements Question {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    question!: string;

    @Column({ nullable: true })
    notes?: string;

    @Column({ nullable: true })
    subjectId?: string;

    @Column('jsonb', { nullable: true, default: [] })
    potentialReplies?: PotentialReply[];

    @Column('jsonb', { nullable: true, default: [] })
    potentialKeyConsiderations?: PotentialKeyConsideration[];

    @Column('jsonb', { nullable: true, default: [] })
    relatedConcepts?: RelatedConcept[];
} 