import { DataSource } from "typeorm";
import { QuestionEntity } from "./entity/Question";
import { LibraryEntity } from "./entity/Library";
import { SubjectEntity } from "./entity/Subject";
//import { ExportTask } from "../domain/entities/ExportTask.ts.old";
//import { GitLibraryDistributionSpecificationEntity } from "./entity/GitLibraryDistributionSpecificationEntity.ts.old";
import { TransferFileMetadataTypeOrmEntity } from "./entity/TransferFileMetadataTypeOrmEntity";
import { TaskTypeOrmEntity } from "./entity/TaskTypeOrmEntity";
import { OnlineGitRepositorySpecificationTypeOrmEntity } from "./entity/OnlineGitRepositorySpecificationTypeOrmEntity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "knowledge_sharing",
    synchronize: true, // Be careful with this in production
    logging: true,
    logger: {
        logQuery: (query: string, parameters?: any[]) => {
            if (query.includes('INSERT INTO')) {
                console.log('\n🔵 [Database INSERT]')
                console.log('Query:', query)
                if (parameters && parameters.length > 0) {
                    console.log('Parameters:', parameters)
                }
                console.log('------------------------')
            }
        },
        logQueryError: (error: string, query: string, parameters?: any[]) => {
            console.error('\n❌ [Database ERROR]')
            console.error('Query:', query)
            if (parameters) console.error('Parameters:', parameters)
            console.error('Error:', error)
            console.error('------------------------')
        },
        logQuerySlow: () => {},
        logSchemaBuild: () => {},
        logMigration: () => {},
        log: () => {}
    },
    entities: [
        QuestionEntity, 
        LibraryEntity, 
        SubjectEntity, 
        //ExportTask,
        //GitLibraryDistributionSpecificationEntity,
        TransferFileMetadataTypeOrmEntity,
        TaskTypeOrmEntity,
        OnlineGitRepositorySpecificationTypeOrmEntity
    ],
    migrations: [],
    subscribers: [],
}); 