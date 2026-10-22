// src/controllers/abonado.controller.js
import { 
  getAllAbonados, 
  getAbonadoById, 
  createAbonado, 
  updateAbonado, 
  deleteAbonado 
} from '../models/abonado.model.js';

// 1. GET (Todos)
export const getAbonados = async (req, res) => {
  try {
    const abonados = await getAllAbonados();
    res.json(abonados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. GET (Por ID)
export const getAbonado = async (req, res) => {
  try {
    const { id } = req.params;
    const abonado = await getAbonadoById(id);

    if (!abonado) {
      return res.status(404).json({ error: 'Abonado no encontrado' });
    }

    res.json(abonado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. POST
export const postAbonado = async (req, res) => {
  try {
    const { nombres, apellidos, telefono, direccion } = req.body;

    if (!nombres || !apellidos) {
      return res.status(400).json({ error: 'Los nombres y apellidos son obligatorios' });
    }

    const nuevoAbonado = { nombres, apellidos, telefono, direccion };
    const idInsertado = await createAbonado(nuevoAbonado);

    res.status(201).json({ 
      mensaje: 'Abonado registrado exitosamente', 
      id_abonado: idInsertado 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 4. PUT
export const putAbonado = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres, apellidos, telefono, direccion } = req.body;

    if (!nombres || !apellidos) {
      return res.status(400).json({ error: 'Los nombres y apellidos son obligatorios' });
    }

    const filasAfectadas = await updateAbonado(id, { nombres, apellidos, telefono, direccion });

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Abonado no encontrado' });
    }

    res.json({ mensaje: 'Abonado actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 5. DELETE
export const removeAbonado = async (req, res) => {
  try {
    const { id } = req.params;
    const filasAfectadas = await deleteAbonado(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Abonado no encontrado' });
    }

    res.json({ mensaje: 'Abonado desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};