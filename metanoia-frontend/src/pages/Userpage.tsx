import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/users';

const UsersPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setItems(response.data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los usuarios: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newName) {
      setError('Nombre es requerido.');
      return;
    }
    try {
      const newItem = { name: newName, email: newEmail };
      const response = await axios.post(API_URL, newItem);
      setItems([...items, response.data]);
      setNewName('');
      setNewEmail('');
      setError(null);
    } catch (err) {
      setError('Error al crear el usuario: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      setError('Error al eliminar el usuario: ' + err.message);
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando usuarios...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>👥 Gestión de Usuarios</h1>
        <p style={styles.subtitle}>Administra los usuarios del sistema</p>
      </div>

      <div style={styles.formContainer}>
        <h2 style={styles.sectionTitle}>➕ Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <input
              type="email"
              placeholder="Correo electrónico (opcional)"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Crear Usuario
          </button>
        </form>
      </div>

      {error && (
        <div style={styles.error}>
          ⚠️ {error}
        </div>
      )}

      <div style={styles.listContainer}>
        <h2 style={styles.sectionTitle}>Usuarios Registrados</h2>
        <div style={styles.userGrid}>
          {items.map(item => (
            <div key={item.id} style={styles.userCard}>
              <div style={styles.userInfo}>
                <div style={styles.userName}>{item.name}</div>
                <div style={styles.userEmail}>
                  {item.email || '📧 Sin email'}
                </div>
                <div style={styles.userId}>
                  <strong>ID: {item.id}</strong>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(item.id)}
                style={styles.deleteButton}
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#4a90e2',
    margin: '0 0 10px 0',
    fontSize: '2.5em'
  },
  subtitle: {
    color: '#666',
    fontSize: '1.2em',
    margin: 0
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '18px'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  sectionTitle: {
    color: '#333',
    margin: '0 0 20px 0',
    fontSize: '1.5em'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '12px 15px',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none'
  },
  button: {
    padding: '12px 25px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#d63031',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ff7675'
  },
  listContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  userGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  userCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    border: '2px solid #e1e5e9',
    borderRadius: '10px',
    transition: 'transform 0.2s'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: '5px'
  },
  userEmail: {
    color: '#636e72',
    fontSize: '14px',
    marginBottom: '5px'
  },
  userId: {
    fontSize: '12px',
    color: '#888'
  },
  deleteButton: {
    padding: '8px 15px',
    backgroundColor: '#e17055',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default UsersPage;