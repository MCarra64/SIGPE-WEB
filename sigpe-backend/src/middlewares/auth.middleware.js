// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // 👇 Debug: vemos si llega el header y el token
  console.log('--- Middleware ejecutado ---');
  console.log('Header Authorization:', authHeader);
  console.log('Token extraído:', token);

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado. Payload:', verificado); // 👈 Debug
    
    req.usuario = verificado; 
    next(); 
  } catch (error) {
    console.error('Error al verificar token:', error.message); // 👈 Debug
    res.status(403).json({ error: 'Token inválido o expirado' });
  }
};