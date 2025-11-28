import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: any) => void;
}

const LoginPage: React.FC<LoginProps> = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const usersStr = localStorage.getItem('metanoia_users');
      if (!usersStr) {
        setError('No hay usuarios registrados.');
        return;
      }

      const users = JSON.parse(usersStr);
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        const userData = { id: user.id, name: user.name, email: user.email };
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(userData));

        setIsLoggedIn(true);
        setUser(userData);
        navigate('/emotions');
      } else {
        setError('Correo o contraseña incorrectos.');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error al iniciar sesión.');
    }
  };

  const handleGoogleLogin = () => {
    const googleUser = {
      id: 'google-' + Date.now(),
      name: 'Usuario de Google',
      email: 'google.user@example.com'
    };
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(googleUser));

    setIsLoggedIn(true);
    setUser(googleUser);
    navigate('/emotions');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fdfdfd',
      fontFamily: '"Nunito", sans-serif',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🔐</span>
          <h2 style={{
            color: '#a29bfe',
            margin: 0,
            fontSize: '1.5rem'
          }}>Iniciar Sesión</h2>
        </div>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: '#2d3436' }}>Correo electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: '#2d3436' }}>Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              style={{
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem',
                outline: 'none'
              }}
              required
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fff5f5',
              color: '#e17055',
              padding: '0.5rem',
              borderRadius: '6px',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              padding: '0.75rem',
              backgroundColor: '#a29bfe',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'background-color 0.3s'
            }}
          >
            Iniciar Sesión
          </button>
        </form>

        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#6c7a89'
        }}>
          ¿No tienes cuenta?{' '}
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'none',
              border: 'none',
              color: '#a29bfe',
              textDecoration: 'underline',
              cursor: 'pointer',
              padding: 0,
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            Regístrate
          </button>
        </div>

        <div style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#6c7a89'
        }}>
          O inicia sesión con:
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <button
            onClick={handleGoogleLogin}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🔵</span> Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;