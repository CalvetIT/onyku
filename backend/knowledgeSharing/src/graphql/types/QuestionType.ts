import { 
    GraphQLObjectType, 
    GraphQLInputObjectType, 
    GraphQLNonNull, 
    GraphQLString, 
    GraphQLID, 
    GraphQLList,
    GraphQLEnumType 
} from 'graphql'

// Enums
const QualityEnum = new GraphQLEnumType({
    name: 'Quality',
    values: {
        availability: { value: 'availability' },
        manageability: { value: 'manageability' },
        performance: { value: 'performance' },
        recoverability: { value: 'recoverability' },
        security: { value: 'security' },
        cost: { value: 'cost' }
    }
})

const ImpactEnum = new GraphQLEnumType({
    name: 'Impact',
    values: {
        positive: { value: 'positive' },
        negative: { value: 'negative' },
        neutral: { value: 'neutral' }
    }
})

// Nested Types
const QualityImpactType = new GraphQLObjectType({
    name: 'QualityImpact',
    fields: {
        quality: { type: new GraphQLNonNull(QualityEnum) },
        impact: { type: new GraphQLNonNull(ImpactEnum) },
        notes: { type: GraphQLString }
    }
})

const ArgumentType = new GraphQLObjectType({
    name: 'Argument',
    fields: {
        argument: { type: new GraphQLNonNull(GraphQLString) },
        qualityImpacts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QualityImpactType))) }
    }
})

const PotentialReplyType = new GraphQLObjectType({
    name: 'PotentialReply',
    fields: {
        exampleReply: { type: new GraphQLNonNull(GraphQLString) },
        potentialRequirements: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        potentialConstraints: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        potentialAssumptions: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        potentialRisks: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        arguments: { type: new GraphQLList(new GraphQLNonNull(ArgumentType)) }
    }
})

const PotentialKeyConsiderationType = new GraphQLObjectType({
    name: 'PotentialKeyConsideration',
    fields: {
        description: { type: new GraphQLNonNull(GraphQLString) },
        externalReferences: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) }
    }
})

const RelatedConceptType = new GraphQLObjectType({
    name: 'RelatedConcept',
    fields: {
        searchQueryDefinition: { type: new GraphQLNonNull(GraphQLString) },
        relationDescription: { type: new GraphQLNonNull(GraphQLString) }
    }
})

// Input Types
const QualityImpactInput = new GraphQLInputObjectType({
    name: 'QualityImpactInput',
    fields: {
        quality: { type: new GraphQLNonNull(QualityEnum) },
        impact: { type: new GraphQLNonNull(ImpactEnum) },
        notes: { type: GraphQLString }
    }
})

const ArgumentInput = new GraphQLInputObjectType({
    name: 'ArgumentInput',
    fields: {
        argument: { type: new GraphQLNonNull(GraphQLString) },
        qualityImpacts: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QualityImpactInput))) }
    }
})

const PotentialReplyInput = new GraphQLInputObjectType({
    name: 'PotentialReplyInput',
    fields: {
        exampleReply: { type: new GraphQLNonNull(GraphQLString) },
        potentialRequirements: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        potentialConstraints: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        potentialAssumptions: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        potentialRisks: { type: new GraphQLList(new GraphQLNonNull(GraphQLString)) },
        arguments: { type: new GraphQLList(new GraphQLNonNull(ArgumentInput)) }
    }
})

const PotentialKeyConsiderationInput = new GraphQLInputObjectType({
    name: 'PotentialKeyConsiderationInput',
    fields: {
        description: { type: new GraphQLNonNull(GraphQLString) },
        externalReferences: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLString))) }
    }
})

const RelatedConceptInput = new GraphQLInputObjectType({
    name: 'RelatedConceptInput',
    fields: {
        searchQueryDefinition: { type: new GraphQLNonNull(GraphQLString) },
        relationDescription: { type: new GraphQLNonNull(GraphQLString) }
    }
})

// Add new Diagram types
const DiagramType = new GraphQLObjectType({
    name: 'Diagram',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        diagramCode: { type: new GraphQLNonNull(GraphQLString) }
    }
})

const DiagramInput = new GraphQLInputObjectType({
    name: 'DiagramInput',
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        diagramCode: { type: new GraphQLNonNull(GraphQLString) }
    }
})

// Main Question Types
export const QuestionType = new GraphQLObjectType({
    name: 'Question',
    fields: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        question: { type: new GraphQLNonNull(GraphQLString) },
        notes: { type: GraphQLString },
        subjectId: { type: GraphQLString },
        relatedConcepts: { 
            type: new GraphQLNonNull(new GraphQLList(RelatedConceptType)),
            resolve: parent => parent.relatedConcepts || []
        },
        potentialReplies: { 
            type: new GraphQLNonNull(new GraphQLList(PotentialReplyType)),
            resolve: parent => parent.potentialReplies || []
        },
        potentialKeyConsiderations: { 
            type: new GraphQLNonNull(new GraphQLList(PotentialKeyConsiderationType)),
            resolve: parent => parent.potentialKeyConsiderations || []
        },
        diagrams: { 
            type: new GraphQLNonNull(new GraphQLList(DiagramType)),
            resolve: parent => parent.diagrams || []
        }
    }
})

export const QuestionInput = new GraphQLInputObjectType({
    name: 'QuestionInput',
    fields: {
        question: { type: new GraphQLNonNull(GraphQLString) },
        potentialReplies: { type: new GraphQLList(new GraphQLNonNull(PotentialReplyInput)) },
        potentialKeyConsiderations: { type: new GraphQLList(new GraphQLNonNull(PotentialKeyConsiderationInput)) },
        subjectId: { type: GraphQLString },
        relatedConcepts: { type: new GraphQLList(new GraphQLNonNull(RelatedConceptInput)) },
        notes: { type: GraphQLString },
        diagrams: { type: new GraphQLList(new GraphQLNonNull(DiagramInput)) }
    }
}) 