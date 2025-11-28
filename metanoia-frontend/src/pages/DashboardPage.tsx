import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <button className="back-button" onClick={() => navigate('/')}>
                        ← Volver al Inicio
                    </button>
                    <h1>📊 Resumen</h1>
                    <p>Estadísticas y análisis de emociones</p>
                </div>

                <main className="dashboard-main">
                    <div className="stats-grid">
                        <div className="stat-card positive">
                            <div className="stat-icon">😊</div>
                            <div className="stat-number">12</div>
                            <div className="stat-label">Emociones Positivas</div>
                        </div>
                        <div className="stat-card negative">
                            <div className="stat-icon">😢</div>
                            <div className="stat-number">5</div>
                            <div className="stat-label">Emociones Negativas</div>
                        </div>
                        <div className="stat-card streak">
                            <div className="stat-icon">🔥</div>
                            <div className="stat-number">7</div>
                            <div className="stat-label">Días Consecutivos</div>
                        </div>
                        <div className="stat-card users">
                            <div className="stat-icon">👥</div>
                            <div className="stat-number">3</div>
                            <div className="stat-label">Usuarios Activos</div>
                        </div>
                    </div>
                    <div className="coming-soon">
                        <h2>🚀 Próximamente</h2>
                        <p>Gráficos interactivos, análisis de tendencias y más funcionalidades de analytics.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardPage;