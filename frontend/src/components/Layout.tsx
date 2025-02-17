import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();
    
    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-blue-700 text-white' : 'text-blue-700';
    }

    return (
        <div>
            <nav className="bg-blue-900 text-white">
                <div className="container mx-auto">
                    <div className="flex h-14 items-center space-x-8 px-4">
                        <Link 
                            to="/" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${isActive('/')}`}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/libraries" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${isActive('/libraries')}`}
                        >
                            Libraries
                        </Link>
                        <Link 
                            to="/subjects" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${isActive('/subjects')}`}
                        >
                            Subjects
                        </Link>
                        <Link 
                            to="/questions" 
                            className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 ${isActive('/questions')}`}
                        >
                            Questions
                        </Link>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
    )
} 