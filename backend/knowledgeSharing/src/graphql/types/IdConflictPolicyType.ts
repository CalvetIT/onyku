import { GraphQLEnumType } from 'graphql'
import { IdConflictPolicy } from '../../domain/enums/IdConflictPolicy'

export const IdConflictPolicyType = new GraphQLEnumType({
    name: 'IdConflictPolicy',
    description: 'Policy for handling ID conflicts during library import',
    values: {
        MERGE: { value: IdConflictPolicy.MERGE },
        DO_NOT_MERGE: { value: IdConflictPolicy.DO_NOT_MERGE }
    }
}) 