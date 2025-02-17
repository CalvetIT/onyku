import { Link, useLocation } from 'react-router-dom'

export function Sidebar() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'bg-blue-700' : '';
    }

    return (
        <nav className="pt-20">
            <ul className="space-y-4">
                <li>
                    <Link 
                        to="/" 
                        className={`block px-6 py-2 text-white ${isActive('/')}`}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/libraries" 
                        className={`block px-6 py-2 text-white ${isActive('/libraries')}`}
                    >
                        Libraries
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/subjects" 
                        className={`block px-6 py-2 text-white ${isActive('/subjects')}`}
                    >
                        Subjects
                    </Link>
                </li>
                <li>
                    <Link 
                        to="/questions" 
                        className={`block px-6 py-2 text-white ${isActive('/questions')}`}
                    >
                        Questions
                    </Link>
                </li>
            </ul>
        </nav>
    )
} 