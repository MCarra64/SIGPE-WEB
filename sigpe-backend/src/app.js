// src/app.js
import express from 'express';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes.js';

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para peticiones desde el frontend
app.use(express.json()); // Permite recibir JSON en el cuerpo de las peticiones

// Rutas
app.use('/api/usuarios', usuarioRoutes);

// Middleware para manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;