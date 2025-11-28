import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUser: (user: any) => void;
}

const RegisterPage: React.FC<RegisterProps> = ({ setIsLoggedIn, setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      const existingUsers = JSON.parse(localStorage.getItem('metanoia_users') || '[]');
      const userExists = existingUsers.some((user: any) => user.email === email);

      if (userExists) {
        setError('Ya existe una cuenta con este correo.');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
      };

      localStorage.setItem('metanoia_users', JSON.stringify([...existingUsers, newUser]));
      localStorage.setItem('isLoggedIn', 'true');
      const userData = { id: newUser.id, name: newUser.name, email: newUser.email };
      localStorage.setItem('user', JSON.stringify(userData));

      setIsLoggedIn(true);
      setUser(userData);

      navigate('/emotions');
    } catch (err) {
      console.error('Error al registrar:', err);
      setError('Error al crear la cuenta.');
    }
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
          <span style={{ fontSize: '1.5rem' }}>📝</span>
          <h2 style={{
            color: '#a29bfe',
            margin: 0,
            fontSize: '1.5rem'
          }}>Crear Cuenta</h2>
        </div>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 600, color: '#2d3436' }}>Nombre completo:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
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
              placeholder="Mínimo 6 caracteres"
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
              backgroundColor: '#55efc4',
              color: '#2d3436',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'background-color 0.3s'
            }}
          >
            Crear Cuenta
          </button>
        </form>

        <div style={{
          marginTop: '1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: '#6c7a89'
        }}>
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={() => navigate('/login')}
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
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;