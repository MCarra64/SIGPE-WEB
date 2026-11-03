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

export const getResidentesConEstado = async () => {
  const query = `
    SELECT 
      a.id_abonado,
      CONCAT(a.nombres, ' ', a.apellidos) AS nombre_completo,
      a.nombres,
      a.apellidos,
      a.telefono,
      a.direccion,
      cs.id_cuenta,
      cs.numero_cuenta,
      (SELECT IFNULL(SUM(c.monto), 0) FROM cuotas c CROSS JOIN periodos p ON c.id_periodo = p.id_periodo LEFT JOIN pagos pg ON pg.id_periodo = p.id_periodo AND pg.id_cuenta = cs.id_cuenta WHERE pg.id_pago IS NULL) as deuda_total,
      (SELECT MAX(fecha_pago) FROM pagos pg WHERE pg.id_cuenta = cs.id_cuenta) as ultimo_pago
    FROM abonados a
    INNER JOIN cuentas_servicio cs ON a.id_abonado = cs.id_abonado
    WHERE a.estado = 'Activo'
    ORDER BY a.apellidos ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};
