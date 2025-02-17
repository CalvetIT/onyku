import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import cors from 'cors';
import graphqlRoute from './routes/graphql';
import { QuestionService } from './services/question/QuestionService';
import { LibraryService } from './services/library/LibraryService';
import { SubjectService } from './services/subject/SubjectService';
import { AppDataSource } from './typeorm/data-source';
import { Question } from './domain/entities/Question';
import { Library } from './domain/entities/Library';
import { Subject } from './domain/entities/Subject';
import { TransferFileService } from './services/transferFile/TransferFileService'
import transferFileRoutes from './routes/transferFileRoutes'
import { TransferFileMetadata } from './domain/entities/TransferFileMetadata'
import { Task } from './domain/entities/Task'
import { TaskService } from './services/task/TaskService'
import { OnlineGitRepositorySpecification } from './domain/entities/OnlineGitRepositorySpecification'
import { OnlineGitRepositoryService } from './services/onlineGitRepository/OnlineGitRepositoryService'

// Live arrays
export const libraries: Library[] = [];
export const questions: Question[] = [];
export const subjects: Subject[] = [];
export const transferFileMetadatas: TransferFileMetadata[] = [];
export const tasks: Task[] = [];
export const onlineGitRepositorySpecifications: OnlineGitRepositorySpecification[] = [];

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Initialize TypeORM and load data from database
AppDataSource.initialize().then(async () => {
    // Services that handle their own array initialization
    await QuestionService.loadQuestions()
    console.log(`[Startup] Loaded ${questions.length} questions from database`)
    
    await LibraryService.loadLibraries()
    console.log(`[Startup] Loaded ${libraries.length} libraries from database`)
    
    await SubjectService.loadSubjects()
    console.log(`[Startup] Loaded ${subjects.length} subjects from database`)
    
    await OnlineGitRepositoryService.loadOnlineGitRepositorySpecifications()
    console.log(`[Startup] Loaded ${onlineGitRepositorySpecifications.length} git repository specifications from database`)
    
    await TransferFileService.loadTransferFileMetadatas()
    console.log(`[Startup] Loaded ${transferFileMetadatas.length} transfer file metadatas from database`)
    
    await TaskService.loadTasks()
    console.log(`[Startup] Loaded ${tasks.length} tasks from database`)

}).catch(error => {
    console.error('[Startup] Error during initialization:', error)
    process.exit(1)
})

// Routes
app.use('/graphql', graphqlRoute);
app.use('/transferFile', transferFileRoutes)

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`GraphiQL interface: http://localhost:${PORT}/graphiql`);
});