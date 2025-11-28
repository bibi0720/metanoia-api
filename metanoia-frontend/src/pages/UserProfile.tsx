import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    age: '',
    bio: '',
    emotionalGoals: [
      'Ser más consciente de mis emociones',
      'Mejorar mi bienestar mental',
    ],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('metanoia-user-profile');
    if (saved) {
      const p = JSON.parse(saved);
      setProfile({
        name: p.name || user.name,
        email: p.email || user.email,
        age: p.edad?.toString() || '',
        bio: p.bio || '',
        emotionalGoals: profile.emotionalGoals,
      });
    }
  }, [user]);

  const saveProfile = () => {
    localStorage.setItem(
      'metanoia-user-profile',
      JSON.stringify({
        id: user.id,
        name: profile.name,
        email: profile.email,
        edad: profile.age ? parseInt(profile.age) : undefined,
        bio: profile.bio,
      })
    );
    setIsEditing(false);
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setProfile(prev => ({
        ...prev,
        emotionalGoals: [...prev.emotionalGoals, newGoal.trim()],
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setProfile(prev => ({
      ...prev,
      emotionalGoals: prev.emotionalGoals.filter((_, i) => i !== index),
    }));
  };

  const stored = localStorage.getItem('metanoia-emotions') || '[]';
  const emotions = JSON.parse(stored).filter((e: any) => e.usuarioId === user.id);
  const emotionCounts: { [key: string]: number } = {};
  emotions.forEach((e: any) => {
    emotionCounts[e.emocion] = (emotionCounts[e.emocion] || 0) + 1;
  });

  const emotionalInsights = {
    totalEntries: emotions.length,
    mostFrequentEmotion:
      emotions.length > 0
        ? Object.keys(emotionCounts).reduce(
            (a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b),
            'Ninguna'
          )
        : 'Ninguna',
    consistency: emotions.length > 0
      ? Math.min(100, Math.round((emotions.filter((e: any) => {
          const emotionDate = new Date(e.fecha);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return emotionDate >= weekAgo;
        }).length / 7) * 100))
      : 0,
    currentStreak: emotions.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0,
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Volver al Inicio
        </button>
        <h1>👤 Mi Perfil Emocional</h1>
        <div className="user-info">Hola, {user.name}</div>
      </div>

      <main className="profile-main">
        <div className="profile-hero">
          <div className="avatar">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1>{profile.name}</h1>
          <p>Mi Perfil Emocional</p>
        </div>

        <div className="profile-content">
          <div className="info-section">
            <div className="section-header">
              <h2>Información Personal</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`edit-button ${isEditing ? 'cancel' : ''}`}
              >
                {isEditing ? '❌ Cancelar' : '✏ Editar'}
              </button>
            </div>

            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Edad</label>
                  <input
                    type="number"
                    value={profile.age}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                  />
                </div>
                <button onClick={saveProfile} className="save-button">
                  💾 Guardar Cambios
                </button>
              </div>
            ) : (
              <div className="info-display">
                <div><strong>📧 Email:</strong> {profile.email}</div>
                {profile.age && <div><strong>🎂 Edad:</strong> {profile.age} años</div>}
                {profile.bio && (
                  <div>
                    <strong>📝 Biografía:</strong>
                    <p>{profile.bio}</p>
                  </div>
                )}
                <div><strong>📅 Miembro desde:</strong> {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            )}
          </div>

          <div className="goals-section">
            <div className="section-header">
              <h2>🎯 Metas Emocionales</h2>
            </div>
            <div className="add-goal">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Nueva meta emocional..."
              />
              <button onClick={addGoal}>+</button>
            </div>
            <div className="goal-list">
              {profile.emotionalGoals.map((goal, index) => (
                <div key={index} className="goal-item">
                  <span>✅ {goal}</span>
                  <button onClick={() => removeGoal(index)}>✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="journey-section">
          <h2>📊 Mi Journey Emocional</h2>
          <div className="journey-stats">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-value">{emotionalInsights.totalEntries}</div>
              <div className="stat-label">Registros</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">😊</div>
              <div className="stat-value">{emotionalInsights.mostFrequentEmotion}</div>
              <div className="stat-label">Emoción Principal</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚡</div>
              <div className="stat-value">{emotionalInsights.consistency}%</div>
              <div className="stat-label">Consistencia</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{emotionalInsights.currentStreak} días</div>
              <div className="stat-label">Racha Actual</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;