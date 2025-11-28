import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';

interface SettingsPageProps {
    user: {
        name: string;
        email: string;
        id: string;
    };
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user }) => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [privacy, setPrivacy] = useState('public');
    const [notifications, setNotifications] = useState(true);
    const [reminderTime, setReminderTime] = useState('20:00');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('metanoia-theme') as 'light' | 'dark' || 'light';
        const savedPrivacy = localStorage.getItem('metanoia-privacy') || 'public';
        const savedNotifications = localStorage.getItem('metanoia-notifications') === 'true';
        const savedReminderTime = localStorage.getItem('metanoia-reminder-time') || '20:00';
        
        setTheme(savedTheme);
        setPrivacy(savedPrivacy);
        setNotifications(savedNotifications);
        setReminderTime(savedReminderTime);
        
        document.body.className = savedTheme;
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.body.className = newTheme;
        localStorage.setItem('metanoia-theme', newTheme);
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('metanoia-privacy', privacy);
            localStorage.setItem('metanoia-notifications', notifications.toString());
            localStorage.setItem('metanoia-reminder-time', reminderTime);
            setLoading(false);
            alert('✅ Configuraciones guardadas exitosamente!');
        }, 800);
    };

    const handleLogout = () => {
        if (window.confirm('¿Estás segura de que quieres cerrar sesión?')) {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← Volver al Inicio
                </button>
                <h1>⚙️ Configuración</h1>
                <div className="user-info">Hola, {user.name}</div>
            </div>

            <main className="settings-main">
                <div className="settings-section">
                    <h2>🎨 Preferencias de la Aplicación</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Tema de la aplicación</h3>
                            <p>Elige entre tema claro u oscuro para tu comfort visual</p>
                        </div>
                        <div className="setting-control">
                            <button 
                                className={`theme-toggle-btn ${theme === 'dark' ? 'active' : ''}`} 
                                onClick={toggleTheme}
                            >
                                <div className="toggle-track">
                                    <div className="toggle-thumb">
                                        {theme === 'dark' ? '🌙' : '☀️'}
                                    </div>
                                </div>
                                <span className="toggle-label">
                                    {theme === 'light' ? 'Modo Claro' : 'Modo Oscuro'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>🔔 Notificaciones</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Recibir recordatorios diarios</h3>
                            <p>Recibe recordatorios diarios para registrar tus emociones</p>
                        </div>
                        <div className="setting-control">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={(e) => setNotifications(e.target.checked)}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>👤 Privacidad</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Visibilidad del perfil</h3>
                            <p>Configura quién puede ver tu actividad emocional</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={privacy}
                                onChange={(e) => setPrivacy(e.target.value)}
                                className="privacy-select"
                            >
                                <option value="public">Público (todos pueden verlo)</option>
                                <option value="friends">Solo amigos</option>
                                <option value="private">Privado (solo tú)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>⏰ Recordatorios diarios</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Establece el horario</h3>
                            <p>Establece el horario para registrar tus emociones</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="reminder-select"
                            >
                                <option value="08:00">Mañana (8:00 AM)</option>
                                <option value="12:00">Mediodía (12:00 PM)</option>
                                <option value="18:00">Tarde (6:00 PM)</option>
                                <option value="20:00">Noche (8:00 PM)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <h2>📊 Exportar datos</h2>
                    <div className="setting-item">
                        <div className="setting-info">
                            <h3>Descarga tu historial completo</h3>
                            <p>Descarga tu historial completo de emociones</p>
                        </div>
                        <div className="setting-control">
                            <div className="export-buttons">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        const data = JSON.parse(localStorage.getItem('metanoia-emotions') || '[]');
                                        const userData = JSON.parse(localStorage.getItem('user') || '{}');
                                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                                        const url = URL.createObjectURL(blob);
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = `metanoia-${userData.name}-emociones.json`;
                                        a.click();
                                    }}
                                >
                                    📄 Exportar JSON
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        const emotions = JSON.parse(localStorage.getItem('metanoia-emotions') || '[]');
                                        const userData = JSON.parse(localStorage.getItem('user') || '{}');
                                        if (emotions.length === 0) {
                                            alert('No hay datos para exportar');
                                            return;
                                        }
                                        const headers = ['Fecha', 'Emoción', 'Intensidad', 'Notas'];
                                        const csvContent = [
                                            headers.join(','),
                                            ...emotions.map((emotion: any) => [
                                                new Date(emotion.fecha).toLocaleDateString(),
                                                `"${emotion.emocion}"`,
                                                emotion.intensidad,
                                                `"${emotion.nota || ''}"`
                                            ].join(','))
                                        ].join('\n');
                                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                        const link = document.createElement('a');
                                        const url = URL.createObjectURL(blob);
                                        link.setAttribute('href', url);
                                        link.setAttribute('download', `metanoia-${userData.name}-emociones-${new Date().toISOString().split('T')[0]}.csv`);
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                >
                                    📊 Exportar CSV
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="settings-section danger-zone">
                    <h2>⚠️ Zona de Peligro</h2>
                    <div className="danger-content">
                        <h3>Acciones importantes</h3>
                        <p>Estas acciones afectarán tu cuenta y datos</p>
                        <div className="danger-actions">
                            <button className="btn btn-danger" onClick={() => alert('🚧 Función de eliminar cuenta en desarrollo')}>
                                🗑️ Eliminar Cuenta
                            </button>
                            <button className="btn btn-warning" onClick={handleLogout}>
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                <div className="save-section">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Guardando...
                            </>
                        ) : (
                            '💾 Guardar Cambios'
                        )}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;