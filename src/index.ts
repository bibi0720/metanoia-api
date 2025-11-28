// src/index.ts (BACKEND - Actualizado para Neon)
import 'dotenv/config';
import cors from "cors";
import express from "express";
import { Request, Response } from "express";
import { neon } from '@neondatabase/serverless';

const app = express();
app.use(cors());     
const PORT: number = parseInt(process.env.PORT || "3000", 10);
app.use(express.json());

// --- Conexión a Neon ---
const sql = neon("postgresql://neondb_owner:npg_d3gRY4JuXWxD@ep-wispy-wave-adkx7rlt.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");

// --- Interfaces ---
type EmotionType = "feliz" | "triste" | "enojado" | "ansioso" | "calmado" | "energico" | "neutral";

interface EmotionEntry {
  id: string;
  user_id: string;
  emotion: EmotionType;
  note?: string;
  timestamp: string;
}

// --- CREAR TABLA DE EMOCIONES SI NO EXISTE ---
async function createEmotionsTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS emotions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        emotion VARCHAR(20) NOT NULL,
        note TEXT,
        timestamp TIMESTAMP DEFAULT NOW(),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    console.log('✅ Tabla emotions lista');
  } catch (error) {
    console.error('❌ Error creando tabla emotions:', error);
  }
}

createEmotionsTable();

// --- ENDPOINTS UNIFICADOS (SOLO NEON) ---

// Endpoint de prueba
app.get("/", async (req: Request, res: Response) => {
  try {
    const result = await sql`SELECT * FROM users LIMIT 1`;
    res.json({ 
      message: "✅ Backend Metanoia funcionando correctamente", 
      database: "Conectado a Neon",
      users_count: result.length
    });
  } catch (error) {
    console.error("Error en endpoint /:", error);
    res.status(500).json({ error: "Error conectando a Neon" });
  }
});

// GET /users - Obtener todos los usuarios desde Neon
app.get("/users", async (req: Request, res: Response) => {
  try {
    console.log("📥 GET /users recibido");
    const result = await sql`SELECT id, username, email, created_at, last_login FROM users`;
    console.log("✅ Usuarios obtenidos:", result.length);
    res.json(result);
  } catch (error) {
    console.error("❌ Error en GET /users:", error);
    res.status(500).json({ error: "Error obteniendo usuarios desde Neon" });
  }
});

// POST /users - Crear un nuevo usuario en Neon
app.post("/users", async (req: Request, res: Response) => {
  try {
    console.log("📥 POST /users recibido:", req.body);
    const { username, email } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'El username es requerido' });
    }

    const result = await sql`
      INSERT INTO users (username, email) 
      VALUES (${username}, ${email || ''}) 
      RETURNING id, username, email, created_at
    `;
    
    console.log("✅ Usuario creado:", result[0]);
    res.status(201).json(result[0]);
  } catch (error) {
    console.error("❌ Error en POST /users:", error);
    res.status(500).json({ 
      error: "Error creando usuario en Neon",
      detalle: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// DELETE /users/:id - Eliminar un usuario de Neon
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("📥 DELETE /users/", id);
    
    // Verificar si el usuario existe
    const userExists = await sql`SELECT id FROM users WHERE id = ${id}`;
    if (userExists.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Eliminar el usuario
    await sql`DELETE FROM users WHERE id = ${id}`;
    
    console.log("✅ Usuario eliminado:", id);
    res.status(204).send();
  } catch (error) {
    console.error("❌ Error en DELETE /users:", error);
    res.status(500).json({ error: "Error eliminando usuario de Neon" });
  }
});

// --- ENDPOINTS DE EMOCIONES (EN NEON) ---

// POST /api/emotions - Registrar estado de ánimo en Neon
app.post("/api/emotions", async (req: Request, res: Response) => {
  try {
    const { userId, emotion, note } = req.body;
    const validEmotions: EmotionType[] = ["feliz", "triste", "enojado", "ansioso", "calmado", "energico", "neutral"];

    if (!userId || !emotion) {
      return res.status(400).json({ message: "userId y emotion son requeridos." });
    }
    
    if (!validEmotions.includes(emotion)) {
      return res.status(400).json({ message: "Emoción no válida." });
    }

    // Insertar en Neon
    const result = await sql`
      INSERT INTO emotions (user_id, emotion, note) 
      VALUES (${userId}, ${emotion}, ${note || ''}) 
      RETURNING *
    `;
    
    console.log('✅ Emoción registrada en Neon:', result[0]);
    return res.status(201).json(result[0]);
  } catch (error) {
    console.error("❌ Error en POST /api/emotions:", error);
    res.status(500).json({ 
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// GET /api/emotions/:userId - Obtener historial de emociones desde Neon
app.get("/api/emotions/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const userEntries = await sql`
      SELECT e.*, u.username 
      FROM emotions e 
      JOIN users u ON e.user_id = u.id 
      WHERE e.user_id = ${userId} 
      ORDER BY e.timestamp DESC
    `;
    
    if (userEntries.length === 0) {
      return res.status(404).json({ message: "No se encontraron registros para este usuario." });
    }
    
    return res.status(200).json(userEntries);
  } catch (error) {
    console.error("❌ Error en GET /api/emotions:", error);
    res.status(500).json({ message: "Error obteniendo emociones" });
  }
});

// GET /api/emotions - Obtener todas las emociones (para estadísticas)
app.get("/api/emotions", async (req: Request, res: Response) => {
  try {
    const emotions = await sql`
      SELECT e.*, u.username 
      FROM emotions e 
      JOIN users u ON e.user_id = u.id 
      ORDER BY e.timestamp DESC
    `;
    
    res.json(emotions);
  } catch (error) {
    console.error("❌ Error en GET /api/emotions:", error);
    res.status(500).json({ message: "Error obteniendo emociones" });
  }
});

// GET /debug/emotions - Ver todas las emociones (para pruebas)
app.get("/debug/emotions", async (req: Request, res: Response) => {
  try {
    const emotions = await sql`SELECT * FROM emotions ORDER BY timestamp DESC`;
    res.json({
      totalEmotions: emotions.length,
      emotions: emotions
    });
  } catch (error) {
    console.error("❌ Error en GET /debug/emotions:", error);
    res.status(500).json({ error: "Error obteniendo emociones" });
  }
});

// Servidor escuchando
app.listen(PORT, () => {
  console.log(`🚀 Backend Metanoia corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   GET  /users - Obtener usuarios desde Neon`);
  console.log(`   POST /users - Crear usuario en Neon`);
  console.log(`   POST /api/emotions - Registrar emoción en Neon`);
  console.log(`   GET  /api/emotions/:userId - Obtener emociones de usuario`);
  console.log(`   GET  /debug/emotions - Ver todas las emociones`);
});