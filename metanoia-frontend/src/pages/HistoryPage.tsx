import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { metanoiaStorage } from '../utils/storage';
import './HistoryPage.css';

interface HistoryPageProps {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

const HistoryPage: React.FC<HistoryPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [emociones, setEmociones] = useState<EmotionRecord[]>([]);
  const [filtro, setFiltro] = useState('todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const emocionesUsuario = metanoiaStorage.getEmotions(user.id);
    setEmociones(emocionesUsuario);
    setCargando(false);
  }, [user.id]);

  const getEmotionIcon = (emocion: string) => {
    const icons: { [key: string]: string } = {
      feliz: '😊',
      triste: '😢',
      enojado: '😠',
      ansioso: '😰',
      calmado: '😌',
      emocionado: '🤩',
      agotado: '😴',
      gratitud: '🙏'
    };
    return icons[emocion] || '😊';
  };

  const emocionesFiltradas = filtro === 'todas' 
    ? emociones 
    : emociones.filter(e => e.emocion === filtro);

  const getIntensidadEstrellas = (intensidad: number) => {
    return '★'.repeat(intensidad) + '☆'.repeat(10 - intensidad);
  };

  const handleDeleteEmotion = (emotionId: string) => {
    if (window.confirm('¿Estás segura de que quieres eliminar este registro?')) {
      metanoiaStorage.deleteEmotion(emotionId);
      setEmociones(emociones.filter(e => e.id !== emotionId));
    }
  };

  if (cargando) {
    return (
      <div className="history-container">
        <div className="history-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← Volver al Inicio
          </button>
          <h1>Mi Historial Emocional</h1>
          <div className="user-info">Hola, {user.name}</div>
        </div>
        <div className="loading-container">
          <div className="spinner-large"></div>
          <p>Cargando tu historial emocional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al Inicio
        </button>
        <h1>Mi Historial Emocional</h1>
        <div className="user-info">Hola, {user.name}</div>
      </div>
      <main className="history-main">
        <div className="stats-cards">
          <div className="stat-card total">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>{emociones.length}</h3>
              <p>Total de registros</p>
            </div>
          </div>
          <div className="stat-card feliz">
            <div className="stat-icon">😊</div>
            <div className="stat-info">
              <h3>{emociones.filter(e => e.emocion === 'feliz').length}</h3>
              <p>Días felices</p>
            </div>
          </div>
          <div className="stat-card racha">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <h3>{emociones.length > 0 ? '1' : '0'}</h3>
              <p>Registros hoy</p>
            </div>
          </div>
        </div>
        <div className="filters-section">
          <h2>Filtrar por emoción</h2>
          <div className="filters-grid">
            <button 
              className={`filter-btn ${filtro === 'todas' ? 'active' : ''}`}
              onClick={() => setFiltro('todas')}
            >
              Todas
            </button>
            <button 
              className={`filter-btn feliz ${filtro === 'feliz' ? 'active' : ''}`}
              onClick={() => setFiltro('feliz')}
            >
              😊 Feliz
            </button>
            <button 
              className={`filter-btn triste ${filtro === 'triste' ? 'active' : ''}`}
              onClick={() => setFiltro('triste')}
            >
              😢 Triste
            </button>
            <button 
              className={`filter-btn emocionado ${filtro === 'emocionado' ? 'active' : ''}`}
              onClick={() => setFiltro('emocionado')}
            >
              🤩 Emocionado
            </button>
          </div>
        </div>
        <div className="emotions-timeline">
          <h2>Tu línea de tiempo emocional</h2>
          {emocionesFiltradas.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>No hay registros {filtro !== 'todas' ? 'con este filtro' : 'aún'}</h3>
              <p>{filtro !== 'todas' ? 'Intenta con otro filtro' : 'Comienza registrando tu primera emoción'}</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/emotions')}
              >
                Registrar Nueva Emoción
              </button>
            </div>
          ) : (
            <div className="timeline">
              {emocionesFiltradas.map((registro) => (
                <div key={registro.id} className="timeline-item">
                  <div className="timeline-marker">
                    {getEmotionIcon(registro.emocion)}
                  </div>
                  <div className="timeline-content">
                    <div className="emotion-header">
                      <h3 className={`emotion-type ${registro.emocion}`}>
                        {getEmotionIcon(registro.emocion)} {registro.emocion.charAt(0).toUpperCase() + registro.emocion.slice(1)}
                      </h3>
                      <span className="emotion-date">{registro.fecha}</span>
                    </div>
                    <div className="intensidad">
                      <span className="intensidad-label">Intensidad:</span>
                      <span className="estrellas">{getIntensidadEstrellas(registro.intensidad)}</span>
                      <span className="intensidad-numero">({registro.intensidad}/10)</span>
                    </div>
                    {registro.nota && (
                      <p className="emotion-note">{registro.nota}</p>
                    )}
                    <div className="emotion-actions">
                      <button 
                        className="btn-small btn-danger" 
                        onClick={() => handleDeleteEmotion(registro.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {emociones.length > 0 && (
          <div className="export-section">
            <div className="export-card">
              <div className="export-icon">📤</div>
              <div className="export-content">
                <h3>Exportar tu historial</h3>
                <p>Descarga todos tus registros emocionales</p>
              </div>
              <div className="export-actions">
                <button 
                  className="btn btn-primary" 
                  onClick={() => metanoiaStorage.exportToPDF(user.id)}
                >
                  📄 Exportar PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;