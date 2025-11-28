import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { metanoiaStorage } from '../utils/storage';
import './EmotionsPage.css';

interface EmotionsPageProps {
  user: {
    name: string;
    email: string;
    id: string;
  };
}

const EmotionsPage: React.FC<EmotionsPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [nota, setNota] = useState('');
  const [intensidad, setIntensidad] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sonidoActivado, setSonidoActivado] = useState(true);

  const emociones = [
    { id: 'feliz', label: 'Feliz', icon: '😊', color: '#FFD700' },
    { id: 'triste', label: 'Triste', icon: '😢', color: '#4169E1' },
    { id: 'enojado', label: 'Enojado', icon: '😠', color: '#FF4500' },
    { id: 'ansioso', label: 'Ansioso', icon: '😰', color: '#8A2BE2' },
    { id: 'calmado', label: 'Calmado', icon: '😌', color: '#32CD32' },
    { id: 'emocionado', label: 'Emocionado', icon: '🤩', color: '#FF69B4' },
    { id: 'agotado', label: 'Agotado', icon: '😫', color: '#696969' },
    { id: 'gratitud', label: 'Gratitud', icon: '🙏', color: '#FFA500' }
  ];

  const playSound = (emotionId: string) => {
    if (!sonidoActivado) return;
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      let frequency = 800;
      let type = 'sine';
      
      switch (emotionId) {
        case 'feliz':
          frequency = 800;
          type = 'sine';
          break;
        case 'triste':
          frequency = 400;
          type = 'triangle';
          break;
        case 'enojado':
          frequency = 1000;
          type = 'square';
          break;
        case 'ansioso':
          frequency = 600;
          type = 'sawtooth';
          break;
        case 'calmado':
          frequency = 500;
          type = 'sine';
          break;
        case 'emocionado':
          frequency = 900;
          type = 'sine';
          break;
        case 'agotado':
          frequency = 300;
          type = 'triangle';
          break;
        case 'gratitud':
          frequency = 700;
          type = 'sine';
          break;
        default:
          frequency = 800;
          type = 'sine';
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = type as OscillatorType;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (err) {
      console.warn('No se pudo reproducir el sonido:', err);
    }
  };

  const handleRegistrarEmocion = async () => {
    if (!selectedEmotion) {
      setError('Por favor, selecciona una emoción');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const nuevaEmocion = metanoiaStorage.saveEmotion({
        emocion: selectedEmotion,
        nota: nota,
        fecha: new Date().toISOString().split('T')[0],
        intensidad: intensidad,
        usuarioId: user.id
      });
      setSuccess('¡Emoción registrada exitosamente! ✅');
      playSound(selectedEmotion);
      setTimeout(() => {
        navigate('/history');
      }, 1500);
    } catch (err) {
      setError('Error al guardar la emoción. Intenta nuevamente.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmotion = (emotionId: string) => {
    setSelectedEmotion(emotionId);
    setError('');
    playSound(emotionId);
  };

  return (
    <div className="emotions-container">
      <div className="emotions-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al Inicio
        </button>
        <h1>Registrar Emoción</h1>
        <div className="user-info">Hola, {user.name}</div>
      </div>
      <main className="emotions-main">
        <div className="emotions-card">
          <div className="card-header">
            <h2>¿Cómo te sientes hoy?</h2>
            <p>Selecciona la emoción que mejor describa tu estado actual</p>
          </div>
          
          <div className="emotions-grid">
            {emociones.map((emocion) => (
              <div
                key={emocion.id}
                className={`emotion-option ${
                  selectedEmotion === emocion.id ? 'selected' : ''
                }`}
                onClick={() => handleSelectEmotion(emocion.id)}
                style={{
                  borderColor: selectedEmotion === emocion.id ? emocion.color : 'transparent'
                }}
              >
                <div className="emotion-icon" style={{ color: emocion.color }}>
                  {emocion.icon}
                </div>
                <span className="emotion-label">{emocion.label}</span>
              </div>
            ))}
          </div>
          
          {selectedEmotion && (
            <div className="intensidad-section">
              <label className="section-label">
                Intensidad: <span className="intensidad-value">{intensidad}/10</span>
              </label>
              <div className="intensidad-slider">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensidad}
                  onChange={(e) => setIntensidad(parseInt(e.target.value))}
                  className="slider"
                />
                <div className="slider-labels">
                  <span>Baja</span>
                  <span>Media</span>
                  <span>Alta</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="notes-section">
            <label className="notes-label">
              Nota (opcional)
            </label>
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Comparte más detalles sobre cómo te sientes..."
              className="notes-textarea"
              rows={3}
            />
          </div>
          
          {error && (
            <div className="message error-message">
              ❌ {error}
            </div>
          )}
          {success && (
            <div className="message success-message">
              ✅ {success}
            </div>
          )}
          
          <button
            onClick={handleRegistrarEmocion}
            disabled={loading || !selectedEmotion}
            className="register-button"
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Registrando...
              </>
            ) : (
              'Registrar Emoción'
            )}
          </button>
        </div>
      </main>

      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        background: 'rgba(255,255,255,0.8)',
        padding: '10px 15px',
        borderRadius: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span>🔊 Sonido:</span>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={sonidoActivado}
            onChange={(e) => setSonidoActivado(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              accentColor: '#8a4fff'
            }}
          />
          {sonidoActivado ? 'Activado' : 'Desactivado'}
        </label>
      </div>
    </div>
  );
};

export default EmotionsPage;