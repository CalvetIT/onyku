import { Link, useLocation } from 'react-router-dom'

interface LayoutProps {
    children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();
    
    const isActive = (path: string) => {
        return location.pathname.startsWith(path)
    }

    const linkStyle = {
        padding: '10px 20px',
        textDecoration: 'none',
        color: '#333',
        display: 'inline-block'
    }

    const activeLinkStyle = {
        ...linkStyle,
        borderBottom: '2px solid #2196F3',
        color: '#2196F3'
    }

    return (
        <div>
            <nav style={{ 
                borderBottom: '1px solid #eee', 
                marginBottom: '20px',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <div>
                    <Link 
                        to="/" 
                        style={isActive('/') && location.pathname === '/' ? activeLinkStyle : linkStyle}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/libraries" 
                        style={isActive('/libraries') && !isActive('/libraries-published') ? activeLinkStyle : linkStyle}
                    >
                        Libraries
                    </Link>
                    <Link 
                        to="/subjects" 
                        style={isActive('/subjects') ? activeLinkStyle : linkStyle}
                    >
                        Subjects
                    </Link>
                    <Link 
                        to="/questions" 
                        style={isActive('/questions') ? activeLinkStyle : linkStyle}
                    >
                        Questions
                    </Link>
                </div>
                <div>
                    <Link 
                        to="/libraries-published" 
                        style={isActive('/libraries-published') ? activeLinkStyle : linkStyle}
                    >
                        Libraries Published
                    </Link>
                </div>
            </nav>
            <main>
                {children}
            </main>
        </div>
    )
} 