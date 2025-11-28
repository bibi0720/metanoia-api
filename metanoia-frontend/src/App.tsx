// src/App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmotionsPage from './pages/EmotionsPage';
import HistoryPage from './pages/HistoryPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';
import UserProfile from './pages/UserProfile';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/Userpage';
import HomePage from './pages/HomePage';
import Layout from './components/Layout'; // 👈 ¡IMPORTANTE! Esta línea estaba faltando

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const logged = localStorage.getItem('isLoggedIn') === 'true';
      const savedUser = localStorage.getItem('user');
      if (logged && savedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(savedUser));
      }
      setCheckingAuth(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    if (window.confirm('¿Estás segura de que quieres cerrar sesión?')) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      alert('¡Hasta pronto! 👋');
    }
  };

  if (checkingAuth) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App" style={{
          fontFamily: '"Nunito", "Inter", sans-serif',
          minHeight: '100vh'
        }}>
          <Routes>
            <Route path="/login" element={!isLoggedIn ? <LoginPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/register" element={!isLoggedIn ? <RegisterPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} /> : <Navigate to="/" />} />

            {/* Rutas protegidas */}
            <Route path="/" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><HomePage user={user} /></Layout> : <Navigate to="/login" />} />
            <Route path="/emotions" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><EmotionsPage user={user} /></Layout> : <Navigate to="/login" />} />
            <Route path="/history" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><HistoryPage user={user} /></Layout> : <Navigate to="/login" />} />
            <Route path="/stats" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><StatsPage user={user} /></Layout> : <Navigate to="/login" />} />
            <Route path="/profile" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><UserProfile user={user} /></Layout> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><DashboardPage user={user} /></Layout> : <Navigate to="/login" />} />
            <Route path="/users" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><UsersPage /></Layout> : <Navigate to="/login" />} />
            <Route path="/settings" element={isLoggedIn ? <Layout user={user} onLogout={handleLogout}><SettingsPage user={user} /></Layout> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;