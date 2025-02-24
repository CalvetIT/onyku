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
        color: 'white',
        textDecoration: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        transition: 'background-color 0.2s'
    }

    const activeLinkStyle = {
        ...linkStyle,
        backgroundColor: 'rgba(255, 255, 255, 0.1)'
    }

    return (
        <div>
            <nav style={{
                backgroundColor: '#2196F3',
                padding: '12px 24px',
                marginBottom: '24px'
            }}>
                <div style={{
                    display: 'flex',
                    gap: '16px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <Link 
                        to="/" 
                        style={isActive('/') && location.pathname === '/' ? activeLinkStyle : linkStyle}
                    >
                        Home
                    </Link>
                    <Link 
                        to="/libraries" 
                        style={isActive('/libraries') && !isActive('/libraries-') ? activeLinkStyle : linkStyle}
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
                        IT Design Question Guidelines
                    </Link>
                    <Link 
                        to="/libraries-published" 
                        style={isActive('/libraries-published') ? activeLinkStyle : linkStyle}
                    >
                        Libraries Published
                    </Link>
                    <Link 
                        to="/libraries-subscribed" 
                        style={isActive('/libraries-subscribed') ? activeLinkStyle : linkStyle}
                    >
                        Libraries Subscribed
                    </Link>
                </div>
            </nav>
            <main>
                {children}
            </main>
        </div>
    )
} 