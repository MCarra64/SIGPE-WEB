import { pool } from '../config/db.js';

export const getAllPagos = async () => {
  const query = `
    SELECT 
      p.id_pago, 
      p.fecha_pago, 
      p.monto_pagado, 
      p.numero_recibo, 
      p.observacion,
      cs.numero_cuenta,
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_abonado,
      pe.mes AS periodo_mes,
      pe.anio AS periodo_anio,
      CONCAT(u.nombre, ' ', u.apellido) AS nombre_cajero
    FROM pagos p
    INNER JOIN cuentas_servicio cs ON p.id_cuenta = cs.id_cuenta
    INNER JOIN abonados a ON cs.id_abonado = a.id_abonado
    INNER JOIN periodos pe ON p.id_periodo = pe.id_periodo
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    ORDER BY p.fecha_pago DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export const getPagoById = async (id) => {
  const query = `
    SELECT 
      p.id_pago, 
      p.fecha_pago, 
      p.monto_pagado, 
      p.numero_recibo, 
      p.observacion,
      cs.numero_cuenta,
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_abonado,
      pe.mes AS periodo_mes,
      pe.anio AS periodo_anio,
      CONCAT(u.nombre, ' ', u.apellido) AS nombre_cajero
    FROM pagos p
    INNER JOIN cuentas_servicio cs ON p.id_cuenta = cs.id_cuenta
    INNER JOIN abonados a ON cs.id_abonado = a.id_abonado
    INNER JOIN periodos pe ON p.id_periodo = pe.id_periodo
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    WHERE p.id_pago = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  return rows[0];
};

export const createPago = async (pagoData) => {
  const { id_cuenta, id_periodo, id_usuario, fecha_pago, monto_pagado, numero_recibo, observacion } = pagoData;
  
  const fecha = fecha_pago || new Date().toISOString().split('T')[0];

  const query = `
    INSERT INTO pagos (id_cuenta, id_periodo, id_usuario, fecha_pago, monto_pagado, numero_recibo, observacion) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, [
    id_cuenta, id_periodo, id_usuario, fecha, monto_pagado, numero_recibo, observacion
  ]);
  return result.insertId;
};

export const updatePago = async (id, pagoData) => {
  const { monto_pagado, numero_recibo, observacion } = pagoData;
  const query = `
    UPDATE pagos 
    SET monto_pagado = ?, numero_recibo = ?, observacion = ? 
    WHERE id_pago = ?
  `;
  const [result] = await pool.execute(query, [monto_pagado, numero_recibo, observacion, id]);
  return result.affectedRows;
};

export const deletePago = async (id) => {
  const query = `DELETE FROM pagos WHERE id_pago = ?`;
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows;
};