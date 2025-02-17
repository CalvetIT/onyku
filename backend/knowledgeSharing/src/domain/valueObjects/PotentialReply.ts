import { Argument } from './Argument';
import { PotentialRequirement } from './PotentialRequirement';
import { PotentialConstraint } from './PotentialConstraint';
import { PotentialAssumption } from './PotentialAssumption';
import { PotentialRisk } from './PotentialRisk';

export class PotentialReply {
    exampleReply: string;
    potentialRequirements?: PotentialRequirement[];
    potentialConstraints?: PotentialConstraint[];
    potentialAssumptions?: PotentialAssumption[];
    potentialRisks?: PotentialRisk[];
    arguments?: Argument[];
} 