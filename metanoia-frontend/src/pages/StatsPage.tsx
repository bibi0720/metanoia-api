import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './StatsPage.css';

interface StatsPageProps {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

const StatsPage: React.FC<StatsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('metanoia-emotions') || '[]';
    const emotions = JSON.parse(stored).filter((e: any) => e.usuarioId === user.id);
    const today = new Date().toISOString().split('T')[0];
    const emotionsToday = emotions.filter((e: any) => e.fecha === today);
    const emotionsThisWeek = emotions.filter((e: any) => {
      const emotionDate = new Date(e.fecha);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return emotionDate >= weekAgo;
    });
    const emotionsThisMonth = emotions.filter((e: any) => {
      const emotionDate = new Date(e.fecha);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return emotionDate >= monthAgo;
    });

    const emotionCounts: { [key: string]: number } = {};
    emotions.forEach((e: any) => {
      emotionCounts[e.emocion] = (emotionCounts[e.emocion] || 0) + 1;
    });

    const mostCommonEmotion = emotions.length > 0
      ? Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b, 'Ninguna')
      : 'Ninguna';

    setStats({
      total: emotions.length,
      today: emotionsToday.length,
      thisWeek: emotionsThisWeek.length,
      thisMonth: emotionsThisMonth.length,
      emotionsByType: emotionCounts,
      mostCommonEmotion,
    });
    setCargando(false);
  }, [user.id]);

  if (cargando) {
    return (
      <div className="stats-container">
        <div className="stats-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Volver al Inicio
          </button>
          <h1>Mis Estadísticas</h1>
          <div className="user-info">Hola, {user.name}</div>
        </div>
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Cargando tus estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al Inicio
        </button>
        <h1>Mis Estadísticas</h1>
        <div className="user-info">Hola, {user.name}</div>
      </div>

      <main className="stats-main">
        <div className="stats-overview">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total de registros</p>
            </div>
          </div>
          <div className="stat-card weekly">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>{stats.thisWeek}</h3>
              <p>Esta semana</p>
            </div>
          </div>
          <div className="stat-card monthly">
            <div className="stat-icon">🗓</div>
            <div className="stat-info">
              <h3>{stats.thisMonth}</h3>
              <p>Este mes</p>
            </div>
          </div>
        </div>

        <div className="emotion-distribution">
          <h2>Distribución de Emociones</h2>
          {Object.keys(stats.emotionsByType).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📈</div>
              <h3>No hay datos suficientes</h3>
              <p>Registra más emociones para ver estadísticas</p>
              <button className="btn btn-primary" onClick={() => navigate('/emotions')}>
                Registrar Emoción
              </button>
            </div>
          ) : (
            <div className="distribution-grid">
              {Object.entries(stats.emotionsByType).map(([emocion, count]) => (
                <div key={emocion} className="emotion-stat">
                  <div className="emotion-icon">
                    {emocion === 'feliz' ? '😊' :
                      emocion === 'triste' ? '😢' :
                        emocion === 'emocionado' ? '🤩' :
                          emocion === 'calmado' ? '😌' :
                            '😊'}
                  </div>
                  <div className="emotion-info">
                    <h4>{emocion}</h4>
                    <p>{count} {count === 1 ? 'vez' : 'veces'}</p>
                  </div>
                  <div className="emotion-bar">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(Number(count) / stats.total) * 100}%`,
                        height: '8px',
                        backgroundColor: '#8a4fff',
                        borderRadius: '4px',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {stats.total > 0 && (
          <div className="insights-section">
            <h2>Insights para ti</h2>
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-icon">💡</div>
                <div className="insight-content">
                  <h3>Tu emoción principal</h3>
                  <p>
                    {stats.mostCommonEmotion !== 'Ninguna'
                      ? `Te sientes principalmente ${stats.mostCommonEmotion}`
                      : 'Sigue registrando tus emociones'}
                  </p>
                </div>
              </div>
              <div className="insight-card">
                <div className="insight-icon">🎯</div>
                <div className="insight-content">
                  <h3>Consistencia</h3>
                  <p>
                    {stats.thisWeek > 3
                      ? '¡Excelente! Estás siendo muy consistente'
                      : 'Intenta registrar tus emociones más seguido'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StatsPage;