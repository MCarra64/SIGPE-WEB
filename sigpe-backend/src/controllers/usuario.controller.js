import { 
  getAllUsuarios, 
  createUsuario, 
  updateUsuario, 
  deleteUsuario 
} from '../models/usuario.model.js';
import bcrypt from 'bcryptjs';

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const postUsuario = async (req, res) => {
  try {
    const { id_rol, nombre, apellido, username, password } = req.body;

    if (!username || !password || !id_rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (username, password, id_rol)' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = { id_rol, nombre, apellido, username, password_hash };
    const idInsertado = await createUsuario(nuevoUsuario);

    res.status(201).json({ 
      mensaje: 'Usuario creado exitosamente', 
      id_usuario: idInsertado 
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El username ya está en uso' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const putUsuario = async (req, res) => {
  try {
    const { id } = req.params; // id va en la URL
    const { id_rol, nombre, apellido, username } = req.body;

    if (!id_rol || !username) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (id_rol, username)' });
    }

    const filasAfectadas = await updateUsuario(id, { id_rol, nombre, apellido, username });

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El username ya está en uso' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const removeUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const filasAfectadas = await deleteUsuario(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};