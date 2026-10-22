// src/models/cuentaServicio.model.js
import { pool } from '../config/db.js';

// 1. Obtener todas las cuentas (con datos del abonado)
export const getAllCuentas = async () => {
  const query = `
    SELECT 
      c.id_cuenta, 
      c.numero_cuenta, 
      c.fecha_inicio, 
      c.estado,
      a.id_abonado,
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_abonado
    FROM cuentas_servicio c
    INNER JOIN abonados a ON c.id_abonado = a.id_abonado
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

// 2. Obtener una cuenta por ID
export const getCuentaById = async (id) => {
  const query = `
    SELECT 
      c.id_cuenta, 
      c.numero_cuenta, 
      c.fecha_inicio, 
      c.estado,
      a.id_abonado,
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_abonado
    FROM cuentas_servicio c
    INNER JOIN abonados a ON c.id_abonado = a.id_abonado
    WHERE c.id_cuenta = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

// 3. Obtener las cuentas de un abonado específico (muy útil)
export const getCuentasByAbonado = async (idAbonado) => {
  const query = `
    SELECT id_cuenta, numero_cuenta, fecha_inicio, estado 
    FROM cuentas_servicio 
    WHERE id_abonado = ?
  `;
  const [rows] = await pool.execute(query, [idAbonado]);
  return rows;
};

// 4. Crear una cuenta
export const createCuenta = async (cuentaData) => {
  const { id_abonado, numero_cuenta, fecha_inicio } = cuentaData;
  const query = `
    INSERT INTO cuentas_servicio (id_abonado, numero_cuenta, fecha_inicio) 
    VALUES (?, ?, ?)
  `;
  const [result] = await pool.execute(query, [id_abonado, numero_cuenta, fecha_inicio]);
  return result.insertId;
};

// 5. Actualizar una cuenta
export const updateCuenta = async (id, cuentaData) => {
  const { numero_cuenta, estado } = cuentaData;
  const query = `
    UPDATE cuentas_servicio 
    SET numero_cuenta = ?, estado = ? 
    WHERE id_cuenta = ?
  `;
  const [result] = await pool.execute(query, [numero_cuenta, estado, id]);
  return result.affectedRows;
};

// 6. Desactivar cuenta (Soft Delete)
export const deleteCuenta = async (id) => {
  const query = `UPDATE cuentas_servicio SET estado = 'Inactivo' WHERE id_cuenta = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};