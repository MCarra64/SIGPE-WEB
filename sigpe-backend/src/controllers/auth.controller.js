// src/controllers/auth.controller.js
import { getUsuarioByUsername } from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'El username y el password son obligatorios' });
    }

    // 1. Buscar el usuario en la BD
    const usuario = await getUsuarioByUsername(username);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // No decimos si el usuario existe o no por seguridad
    }

    // 2. Verificar si el usuario está activo
    if (usuario.estado !== 'Activo') {
      return res.status(403).json({ error: 'El usuario está inactivo' });
    }

    // 3. Comparar la contraseña enviada con la encriptada en la BD
    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 4. Generar el Token JWT
    // Guardamos el ID y el ROL dentro del token
    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // El token expira en 8 horas (una jornada laboral)
    );

    // 5. Responder con el token y los datos básicos
    res.json({
      mensaje: 'Login exitoso',
      token: token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        username: usuario.username,
        id_rol: usuario.id_rol
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};