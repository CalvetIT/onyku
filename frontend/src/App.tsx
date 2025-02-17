import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { 
    QuestionsPage, 
    CreateQuestionPage, 
    EditQuestionPage, 
    ViewQuestionPage 
} from './pages/questions'
import { 
    LibrariesPage, 
    CreateLibraryPage, 
    EditLibraryPage, 
    ViewLibraryPage 
} from './pages/libraries'
import {
    SubjectsPage,
    CreateSubjectPage,
    EditSubjectPage,
    ViewSubjectPage
} from './pages/subjects'

export function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/questions" element={<QuestionsPage />} />
                    <Route path="/questions/create" element={<CreateQuestionPage />} />
                    <Route path="/questions/:id" element={<ViewQuestionPage />} />
                    <Route path="/questions/:id/edit" element={<EditQuestionPage />} />
                    <Route path="/libraries" element={<LibrariesPage />} />
                    <Route path="/libraries/create" element={<CreateLibraryPage />} />
                    <Route path="/libraries/:id" element={<ViewLibraryPage />} />
                    <Route path="/libraries/:id/edit" element={<EditLibraryPage />} />
                    <Route path="/subjects" element={<SubjectsPage />} />
                    <Route path="/subjects/create" element={<CreateSubjectPage />} />
                    <Route path="/subjects/:id" element={<ViewSubjectPage />} />
                    <Route path="/subjects/:id/edit" element={<EditSubjectPage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
} 