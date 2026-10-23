import { pool } from '../config/db.js';

export const getInfoCuenta = async (id_cuenta) => {
  const query = `
    SELECT 
      c.id_cuenta, 
      c.numero_cuenta, 
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_abonado,
      a.telefono
    FROM cuentas_servicio c
    INNER JOIN abonados a ON c.id_abonado = a.id_abonado
    WHERE c.id_cuenta = ?
  `;
  const [rows] = await pool.execute(query, [id_cuenta]);
  return rows[0];
};

export const getHistorialCuenta = async (id_cuenta) => {
  const query = `
    SELECT 
      p.id_periodo,
      p.mes,
      p.anio,
      c.monto AS monto_esperado,
      c.descripcion AS concepto,
      pg.id_pago,
      pg.fecha_pago,
      pg.monto_pagado,
      pg.numero_recibo,
      pg.observacion
    FROM periodos p
    -- Cruzamos con las cuotas para saber cuánto se debe por ese periodo
    LEFT JOIN cuotas c ON c.id_periodo = p.id_periodo
    -- Cruzamos con los pagos de ESTA cuenta en específico
    LEFT JOIN pagos pg ON pg.id_periodo = p.id_periodo AND pg.id_cuenta = ?
    ORDER BY p.anio DESC, p.mes DESC
  `;
  const [rows] = await pool.execute(query, [id_cuenta]);
  return rows;
};

export const getResumenCajaHoy = async () => {
  const query = `
    SELECT 
      COUNT(id_pago) AS cantidad_transacciones,
      IFNULL(SUM(monto_pagado), 0) AS total_recaudado
    FROM pagos
    WHERE DATE(fecha_pago) = CURRENT_DATE()
  `;
  const [rows] = await pool.execute(query);
  return rows[0];
};

export const getDetallePagosHoy = async () => {
  const query = `
    SELECT 
      p.id_pago,
      p.numero_recibo,
      p.monto_pagado,
      p.fecha_pago,
      cs.numero_cuenta,
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_abonado,
      CONCAT(u.nombre, ' ', u.apellido) AS nombre_cajero
    FROM pagos p
    INNER JOIN cuentas_servicio cs ON p.id_cuenta = cs.id_cuenta
    INNER JOIN abonados a ON cs.id_abonado = a.id_abonado
    INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
    WHERE DATE(p.fecha_pago) = CURRENT_DATE()
    ORDER BY p.fecha_pago DESC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

export const getReporteMorosos = async () => {
  const query = `
    SELECT 
      a.id_abonado,
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_abonado,
      a.telefono,
      cs.id_cuenta,
      cs.numero_cuenta,
      p.id_periodo,
      p.mes AS periodo_mes,
      p.anio AS periodo_anio,
      c.monto AS monto_debido
    FROM cuentas_servicio cs
    INNER JOIN abonados a ON cs.id_abonado = a.id_abonado
    CROSS JOIN periodos p
    INNER JOIN cuotas c ON c.id_periodo = p.id_periodo
    LEFT JOIN pagos pg ON pg.id_cuenta = cs.id_cuenta AND pg.id_periodo = p.id_periodo
    WHERE pg.id_pago IS NULL 
      AND cs.estado = 'Activo'
    ORDER BY p.anio DESC, p.mes DESC, a.apellidos ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};