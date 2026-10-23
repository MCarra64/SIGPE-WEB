import { 
  getAllCuotas, 
  getCuotaById, 
  createCuota, 
  updateCuota, 
  deleteCuota 
} from '../models/cuota.model.js';

export const getCuotas = async (req, res) => {
  try {
    const cuotas = await getAllCuotas();
    res.json(cuotas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getCuota = async (req, res) => {
  try {
    const { id } = req.params;
    const cuota = await getCuotaById(id);

    if (!cuota) {
      return res.status(404).json({ error: 'Cuota no encontrada' });
    }

    res.json(cuota);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const postCuota = async (req, res) => {
  try {
    const { id_periodo, monto, descripcion, estado } = req.body;

    if (!id_periodo || !monto) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (id_periodo, monto)' });
    }

    const nuevaCuota = { id_periodo, monto, descripcion, estado };
    const idInsertado = await createCuota(nuevaCuota);

    res.status(201).json({ 
      mensaje: 'Cuota creada exitosamente', 
      id_cuota: idInsertado 
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'El periodo especificado no existe' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const putCuota = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_periodo, monto, descripcion, estado } = req.body;

    if (!id_periodo || !monto) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (id_periodo, monto)' });
    }

    const filasAfectadas = await updateCuota(id, { id_periodo, monto, descripcion, estado });

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Cuota no encontrada' });
    }

    res.json({ mensaje: 'Cuota actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const removeCuota = async (req, res) => {
  try {
    const { id } = req.params;
    const filasAfectadas = await deleteCuota(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Cuota no encontrada' });
    }

    res.json({ mensaje: 'Cuota eliminada correctamente' });
  } catch (error) {
    console.error(error);
    // Protección: No puedes borrar una cuota si ya tiene pagos registrados
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'No se puede eliminar la cuota porque ya tiene pagos asociados' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};