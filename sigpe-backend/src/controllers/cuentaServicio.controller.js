// src/controllers/cuentaServicio.controller.js
import { 
  getAllCuentas, 
  getCuentaById, 
  getCuentasByAbonado,
  createCuenta, 
  updateCuenta, 
  deleteCuenta 
} from '../models/cuentaservicio.model.js';

// 1. GET (Todas)
export const getCuentas = async (req, res) => {
  try {
    const cuentas = await getAllCuentas();
    res.json(cuentas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. GET (Por ID)
export const getCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await getCuentaById(id);

    if (!cuenta) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    res.json(cuenta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. GET (Por Abonado) - Ruta extra
export const getCuentasDeAbonado = async (req, res) => {
  try {
    const { idAbonado } = req.params;
    const cuentas = await getCuentasByAbonado(idAbonado);
    res.json(cuentas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 4. POST
export const postCuenta = async (req, res) => {
  try {
    const { id_abonado, numero_cuenta, fecha_inicio } = req.body;

    if (!id_abonado || !numero_cuenta) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (id_abonado, numero_cuenta)' });
    }

    // Si no viene la fecha, usamos la de hoy
    const fecha = fecha_inicio || new Date().toISOString().split('T')[0];

    const nuevaCuenta = { id_abonado, numero_cuenta, fecha_inicio: fecha };
    const idInsertado = await createCuenta(nuevaCuenta);

    res.status(201).json({ 
      mensaje: 'Cuenta de servicio creada exitosamente', 
      id_cuenta: idInsertado 
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El número de cuenta ya existe' });
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'El abonado especificado no existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 5. PUT
export const putCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero_cuenta, estado } = req.body;

    if (!numero_cuenta) {
      return res.status(400).json({ error: 'El numero_cuenta es obligatorio' });
    }

    const filasAfectadas = await updateCuenta(id, { numero_cuenta, estado });

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    res.json({ mensaje: 'Cuenta actualizada correctamente' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El número de cuenta ya existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 6. DELETE
export const removeCuenta = async (req, res) => {
  try {
    const { id } = req.params;
    const filasAfectadas = await deleteCuenta(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Cuenta no encontrada' });
    }

    res.json({ mensaje: 'Cuenta desactivada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};