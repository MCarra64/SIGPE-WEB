import { pool } from '../config/db.js';

export const getAllUsuarios = async () => {
  const query = `
    SELECT id_usuario, id_rol, nombre, apellido, username, estado, fecha_creacion
    FROM usuarios
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export const createUsuario = async (usuarioData) => {
  const { id_rol, nombre, apellido, username, password_hash } = usuarioData;
  const query = `
    INSERT INTO usuarios (id_rol, nombre, apellido, username, password_hash) 
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [id_rol, nombre, apellido, username, password_hash]);
  return result.insertId;
};

export const updateUsuario = async (id, usuarioData) => {
  const { id_rol, nombre, apellido, username } = usuarioData;
  const query = `
    UPDATE usuarios 
    SET id_rol = ?, nombre = ?, apellido = ?, username = ? 
    WHERE id_usuario = ?
  `;
  const [result] = await pool.execute(query, [id_rol, nombre, apellido, username, id]);
  return result.affectedRows;
};

export const deleteUsuario = async (id) => {
  const query = `UPDATE usuarios SET estado = 'Inactivo' WHERE id_usuario = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};

export const getUsuarioByUsername = async (username) => {
  const query = `SELECT * FROM usuarios WHERE username = ?`;
  const [rows] = await pool.execute(query, [username]);
  return rows[0];
};