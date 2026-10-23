import { 
  getAllPeriodos, 
  getPeriodoById, 
  createPeriodo, 
  updatePeriodo, 
  deletePeriodo 
} from '../models/periodo.model.js';

export const getPeriodos = async (req, res) => {
  try {
    const periodos = await getAllPeriodos();
    res.json(periodos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getPeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const periodo = await getPeriodoById(id);

    if (!periodo) {
      return res.status(404).json({ error: 'Periodo no encontrado' });
    }

    res.json(periodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const postPeriodo = async (req, res) => {
  try {
    const { mes, anio, fecha_inicio, fecha_fin } = req.body;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'El mes y el año son obligatorios' });
    }

    const nuevoPeriodo = { mes, anio, fecha_inicio, fecha_fin };
    const idInsertado = await createPeriodo(nuevoPeriodo);

    res.status(201).json({ 
      mensaje: 'Periodo creado exitosamente', 
      id_periodo: idInsertado 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const putPeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { mes, anio, fecha_inicio, fecha_fin } = req.body;

    if (!mes || !anio) {
      return res.status(400).json({ error: 'El mes y el año son obligatorios' });
    }

    const filasAfectadas = await updatePeriodo(id, { mes, anio, fecha_inicio, fecha_fin });

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Periodo no encontrado' });
    }

    res.json({ mensaje: 'Periodo actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const removePeriodo = async (req, res) => {
  try {
    const { id } = req.params;
    const filasAfectadas = await deletePeriodo(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Periodo no encontrado' });
    }

    res.json({ mensaje: 'Periodo eliminado correctamente' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: 'No se puede eliminar el periodo porque tiene cuotas o pagos asociados' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};