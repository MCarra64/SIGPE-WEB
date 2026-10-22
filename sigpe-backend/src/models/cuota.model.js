// src/models/cuota.model.js
import { pool } from '../config/db.js';

// 1. Obtener todas las cuotas (con datos del periodo)
export const getAllCuotas = async () => {
  const query = `
    SELECT 
      c.id_cuota, 
      c.monto, 
      c.descripcion, 
      c.estado,
      p.id_periodo,
      p.mes,
      p.anio
    FROM cuotas c
    INNER JOIN periodos p ON c.id_periodo = p.id_periodo
    ORDER BY p.anio DESC, p.mes DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// 2. Obtener una cuota por ID
export const getCuotaById = async (id) => {
  const query = `
    SELECT 
      c.id_cuota, 
      c.monto, 
      c.descripcion, 
      c.estado,
      p.id_periodo,
      p.mes,
      p.anio
    FROM cuotas c
    INNER JOIN periodos p ON c.id_periodo = p.id_periodo
    WHERE c.id_cuota = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

// 3. Crear una cuota
export const createCuota = async (cuotaData) => {
  const { id_periodo, monto, descripcion, estado } = cuotaData;
  // Si no envían estado, por defecto será 'Pendiente' según tu esquema
  const query = `
    INSERT INTO cuotas (id_periodo, monto, descripcion, estado) 
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [id_periodo, monto, descripcion, estado || 'Pendiente']);
  return result.insertId;
};

// 4. Actualizar una cuota
export const updateCuota = async (id, cuotaData) => {
  const { id_periodo, monto, descripcion, estado } = cuotaData;
  const query = `
    UPDATE cuotas 
    SET id_periodo = ?, monto = ?, descripcion = ?, estado = ? 
    WHERE id_cuota = ?
  `;
  const [result] = await pool.execute(query, [id_periodo, monto, descripcion, estado, id]);
  return result.affectedRows;
};

// 5. Eliminar una cuota
export const deleteCuota = async (id) => {
  const query = `DELETE FROM cuotas WHERE id_cuota = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};