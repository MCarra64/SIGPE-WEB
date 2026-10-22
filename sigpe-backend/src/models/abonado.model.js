import { pool } from '../config/db.js';

export const getAllAbonados = async () => {
  const query = `
    SELECT id_abonado, nombres, apellidos, telefono, direccion, fecha_registro, estado 
    FROM abonados
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export const getAbonadoById = async (id) => {
  const query = `
    SELECT id_abonado, nombres, apellidos, telefono, direccion, fecha_registro, estado 
    FROM abonados 
    WHERE id_abonado = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

export const createAbonado = async (abonadoData) => {
  const { nombres, apellidos, telefono, direccion } = abonadoData;
  const query = `
    INSERT INTO abonados (nombres, apellidos, telefono, direccion) 
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [nombres, apellidos, telefono, direccion]);
  return result.insertId;
};

export const updateAbonado = async (id, abonadoData) => {
  const { nombres, apellidos, telefono, direccion } = abonadoData;
  const query = `
    UPDATE abonados 
    SET nombres = ?, apellidos = ?, telefono = ?, direccion = ? 
    WHERE id_abonado = ?
  `;
  const [result] = await pool.execute(query, [nombres, apellidos, telefono, direccion, id]);
  return result.affectedRows;
};

export const deleteAbonado = async (id) => {
  const query = `UPDATE abonados SET estado = 'Inactivo' WHERE id_abonado = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};