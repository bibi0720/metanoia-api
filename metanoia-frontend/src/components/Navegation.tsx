import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavegationProps {
    user: { name: string };
    onLogout: () => void;
}

const Navegation: React.FC<NavegationProps> = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { to: '/emotions', label: 'Emociones', icon: '😊' },
        { to: '/history', label: 'Historial', icon: '📌' },
        { to: '/stats', label: 'Estadísticas', icon: '📍' },
        { to: '/dashboard', label: 'Dashboard', icon: '🍱' },
    ];

    return (
        <nav style={{
            background: 'linear-gradient(135deg, #B44fff 0%, #ff6b9d 100%)',
            padding: '1rem 2rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
        }}>
            {/* Izquierda: Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.8rem' }}>🌿</span>
                <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Metanoia
                </h1>
            </div>

            {/* Centro: Navegación principal */}
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {navItems.map((item) => (
                    <button
                        key={item.to}
                        onClick={() => navigate(item.to)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 1.25rem',
                            borderRadius: '50px',
                            backgroundColor: location.pathname === item.to
                                ? 'rgba(255, 255, 255, 0.3)'
                                : 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            backdropFilter: 'blur(8px)',
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                        }}
                        onMouseEnter={(e) => {
                            if (location.pathname !== item.to) {
                                (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (location.pathname !== item.to) {
                                (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            }
                        }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>

            {/* Derecha: Usuario, Configuración, Salir */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                {/* Nombre de usuario - FUNCIONAL */}
                <button
                    onClick={() => navigate('/profile')}
                    style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '50px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        backdropFilter: 'blur(8px)',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    👋 Hola, {user.name}
                </button>

                {/* Botón de configuración */}
                <button
                    onClick={() => navigate('/settings')}
                    style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'white',
                        fontSize: '1.1rem',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    ⚙️
                </button>

                {/* Botón de salir */}
                <button
                    onClick={onLogout}
                    style={{
                        padding: '0.6rem 1.25rem',
                        borderRadius: '50px',
                        backgroundColor: 'rgba(255, 107, 157, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)',
                        transition: 'all 0.25s ease',
                    }}
                    onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 107, 157, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.backgroundColor = 'rgba(255, 107, 157, 0.3)';
                    }}
                >
                    🚪 Salir
                </button>
            </div>
        </nav>
    );
};

export default Navegation;