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

    const usuario = await getUsuarioByUsername(username);

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    if (usuario.estado !== 'Activo') {
      return res.status(403).json({ error: 'El usuario está inactivo' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id_usuario: usuario.id_usuario, id_rol: usuario.id_rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

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