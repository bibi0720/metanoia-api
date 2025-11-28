import React from 'react';
import Navegation from './Navegation';

interface LayoutProps {
    children: React.ReactNode;
    user: { name: string };
    onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
    return (
        <div style={{ 
            minHeight: '100vh', 
            backgroundColor: 'transparent',
            width: '100%'
        }}>
            <Navegation user={user} onLogout={onLogout} />
            <main style={{ 
                padding: '0',
                width: '100%'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;