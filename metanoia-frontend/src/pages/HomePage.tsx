import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

interface HomePageProps {
  user: {
    name: string;
    email: string;
  };
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Registrar Emoción',
      description: '¿Cómo te sientes hoy? Comparte tu estado emocional',
      icon: '😊',
      action: () => navigate('/emotions'),
      color: 'emotion',
    },
    {
      title: 'Mi Historial',
      description: 'Todas tus emociones registradas',
      icon: '📝',
      action: () => navigate('/history'),
      color: 'history',
    },
    {
      title: 'Ver Mi Progreso',
      description: 'Revisa tu historial y patrones emocionales',
      icon: '📊',
      action: () => navigate('/stats'),
      color: 'stats',
    },
    {
      title: 'Mi Perfil',
      description: 'Configura tu cuenta y preferencias',
      icon: '👤',
      action: () => navigate('/profile'),
      color: 'profile',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="home-container">
      <main className="home-main">
        <section className="welcome-section">
          <div className="greeting">
            <h1>{getGreeting()}, {user?.name || 'Elsa'} 🌸</h1>
            <p className="subtitle">¿Qué te gustaría hacer hoy?</p>
            <p className="description">
              Tu espacio seguro para explorar y entender tus emociones. Cada día es una nueva oportunidad para conectar contigo misma.
            </p>
          </div>
        </section>

        <section className="actions-section">
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className={`action-card ${action.color}`}
                onClick={action.action}
              >
                <div className="action-icon">{action.icon}</div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </div>
            ))}
          </div>
        </section>

        <section className="inspiration-section">
          <div className="inspiration-card">
            <div className="inspiration-header">
              <span className="inspiration-icon">💭</span>
              <div className="inspiration-title">
                <h3>Reflexión del día</h3>
                <span className="date">
                  {new Date().toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
            </div>
            <p className="inspiration-text">
              "Las emociones son como olas: no podemos evitar que lleguen, pero podemos aprender a surfearlas."
            </p>
            <button className="inspiration-button" onClick={() => navigate('/emotions')}>
              Registrar mi estado actual
            </button>
          </div>
        </section>

        <section className="activity-section">
          <h2 className="section-title">Tu actividad reciente</h2>
          <div className="activity-cards">
            <div className="activity-card">
              <div className="activity-icon">😊</div>
              <div className="activity-info">
                <p>Última emoción registrada</p>
                <span className="activity-detail">Feliz - Ayer</span>
              </div>
            </div>
            <div className="activity-card">
              <div className="activity-icon">📅</div>
              <div className="activity-info">
                <p>Días consecutivos</p>
                <span className="activity-detail">5 días</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;