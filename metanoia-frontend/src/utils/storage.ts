// src/utils/storage.ts
export interface EmotionRecord {
  id: string;
  emocion: string;
  nota: string;
  fecha: string;
  intensidad: number;
  usuarioId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  edad?: number;
  genero?: string;
  bio?: string;
}

// Sonido de éxito
const playSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = 800;
  oscillator.type = 'sine';
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

// Guardar emoción
export const saveEmotion = (emotionRecord: Omit<EmotionRecord, 'id'>): void => {
  try {
    const emotions = getEmotions();
    const newEmotion: EmotionRecord = {
      ...emotionRecord,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    emotions.push(newEmotion);
    localStorage.setItem('metanoia-emotions', JSON.stringify(emotions));
    playSuccessSound();
  } catch (error) {
    console.error('Error guardando emoción:', error);
  }
};

// Obtener emociones del usuario
export const getEmotions = (userId?: string): EmotionRecord[] => {
  try {
    const stored = localStorage.getItem('metanoia-emotions');
    const emotions: EmotionRecord[] = stored ? JSON.parse(stored) : [];
    if (userId) {
      return emotions.filter(emotion => emotion.usuarioId === userId);
    }
    return emotions;
  } catch (error) {
    console.error('Error obteniendo emociones:', error);
    return [];
  }
};

// Guardar perfil de usuario
export const saveUserProfile = (userProfile: UserProfile): void => {
  try {
    localStorage.setItem('metanoia-user-profile', JSON.stringify(userProfile));
  } catch (error) {
    console.error('Error guardando perfil:', error);
  }
};

// Obtener perfil de usuario
export const getUserProfile = (): UserProfile | null => {
  try {
    const stored = localStorage.getItem('metanoia-user-profile');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return null;
  }
};

// Obtener estadísticas
export const getStats = (userId: string) => {
  const emotions = getEmotions(userId);
  const today = new Date().toISOString().split('T')[0];
  const emotionsToday = emotions.filter(emotion => 
    emotion.fecha.split('T')[0] === today
  );
  const emotionsThisWeek = emotions.filter(emotion => {
    const emotionDate = new Date(emotion.fecha);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return emotionDate >= weekAgo;
  });
  const emotionCounts: { [key: string]: number } = {};
  emotions.forEach(emotion => {
    emotionCounts[emotion.emocion] = (emotionCounts[emotion.emocion] || 0) + 1;
  });
  const mostCommonEmotion = Object.keys(emotionCounts).reduce((a, b) => 
    emotionCounts[a] > emotionCounts[b] ? a : b, 'No data'
  );
  const happyDays = emotions.filter(emotion => 
    emotion.emocion.toLowerCase().includes('feliz') || 
    emotion.emocion.toLowerCase().includes('alegr') ||
    emotion.emocion === '😊 Feliz'
  ).length;
  return {
    total: emotions.length,
    today: emotionsToday.length,
    thisWeek: emotionsThisWeek.length,
    mostCommonEmotion,
    happyDays,
    emotionsByType: emotionCounts
  };
};

// Eliminar emoción
export const deleteEmotion = (emotionId: string): void => {
  try {
    const emotions = getEmotions();
    const filteredEmotions = emotions.filter(emotion => emotion.id !== emotionId);
    localStorage.setItem('metanoia-emotions', JSON.stringify(filteredEmotions));
  } catch (error) {
    console.error('Error eliminando emoción:', error);
  }
};

// Exportar a PDF
export const exportToPDF = (userId: string): void => {
  const emotions = getEmotions(userId);
  const userProfile = getUserProfile();
  if (emotions.length === 0) {
    alert('No hay datos para exportar');
    return;
  }
  // Crear contenido HTML simple para el PDF
  const content = `
    <h1>Historial de Emociones - Metanoia</h1>
    <p><strong>Usuario:</strong> ${userProfile?.name || 'No especificado'}</p>
    <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleDateString()}</p>
    <table border="1" style="width: 100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Emoción</th>
          <th>Intensidad</th>
          <th>Notas</th>
        </tr>
      </thead>
      <tbody>
        ${emotions.map(emotion => `
          <tr>
            <td>${new Date(emotion.fecha).toLocaleDateString()}</td>
            <td>${emotion.emocion}</td>
            <td>${emotion.intensidad}/10</td>
            <td>${emotion.nota || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  // Crear ventana para imprimir/guardar como PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Metanoia - Exportación de Emociones</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; text-align: left; border: 1px solid #ddd; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
};

// Exportar a Excel
export const exportToExcel = (userId: string): void => {
  const emotions = getEmotions(userId);
  if (emotions.length === 0) {
    alert('No hay datos para exportar');
    return;
  }
  // Crear contenido CSV
  const headers = ['Fecha', 'Emoción', 'Intensidad', 'Notas'];
  const csvContent = [
    headers.join(','),
    ...emotions.map(emotion => [
      new Date(emotion.fecha).toLocaleDateString(),
      `"${emotion.emocion}"`,
      emotion.intensidad,
      `"${emotion.nota || ''}"`
    ].join(','))
  ].join('\n');
  // Crear y descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `metanoia-emociones-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Alias para compatibilidad con código existente
export const metanoiaStorage = {
  saveEmotion,
  getEmotions,
  saveUserProfile,
  getUserProfile,
  getStats,
  deleteEmotion,
  exportToPDF,
  exportToExcel
};

export default metanoiaStorage;