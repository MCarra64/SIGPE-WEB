import { pool } from '../config/db.js';

export const getAllPeriodos = async () => {
  const query = `
    SELECT id_periodo, mes, anio, fecha_inicio, fecha_fin 
    FROM periodos 
    ORDER BY anio DESC, mes DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export const getPeriodoById = async (id) => {
  const query = `
    SELECT id_periodo, mes, anio, fecha_inicio, fecha_fin 
    FROM periodos 
    WHERE id_periodo = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

export const createPeriodo = async (periodoData) => {
  const { mes, anio, fecha_inicio, fecha_fin } = periodoData;
  const query = `
    INSERT INTO periodos (mes, anio, fecha_inicio, fecha_fin) 
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [mes, anio, fecha_inicio, fecha_fin]);
  return result.insertId;
};

export const updatePeriodo = async (id, periodoData) => {
  const { mes, anio, fecha_inicio, fecha_fin } = periodoData;
  const query = `
    UPDATE periodos 
    SET mes = ?, anio = ?, fecha_inicio = ?, fecha_fin = ? 
    WHERE id_periodo = ?
  `;
  const [result] = await pool.execute(query, [mes, anio, fecha_inicio, fecha_fin, id]);
  return result.affectedRows;
};

export const deletePeriodo = async (id) => {
  const query = `DELETE FROM periodos WHERE id_periodo = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};