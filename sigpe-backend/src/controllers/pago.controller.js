// src/controllers/pago.controller.js
import { 
  getAllPagos, 
  getPagoById, 
  createPago, 
  updatePago, 
  deletePago 
} from '../models/pago.model.js';

// 1. GET (Todos)
export const getPagos = async (req, res) => {
  try {
    const pagos = await getAllPagos();
    res.json(pagos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 2. GET (Por ID)
export const getPago = async (req, res) => {
  try {
    const { id } = req.params;
    const pago = await getPagoById(id);

    if (!pago) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    res.json(pago);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 3. POST (Registrar Pago)
export const postPago = async (req, res) => {
  try {
    // 1. Ya NO pedimos el id_usuario aquí
    const { id_cuenta, id_periodo, fecha_pago, monto_pagado, numero_recibo, observacion } = req.body;

        // 👇 AGREGA ESTA LÍNEA PARA DEBUGGEAR
    console.log("Datos del usuario extraídos del Token:", req.usuario); 
    
    // 2. Extraemos el id_usuario directamente del Token (gracias al middleware)
    const id_usuario = req.usuario.id_usuario; 

    console.log("ID Usuario a insertar:", id_usuario); 

    // 3. Validamos que vengan los datos necesarios
    if (!id_cuenta || !id_periodo || !monto_pagado) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (id_cuenta, id_periodo, monto_pagado)' });
    }

    const nuevoPago = { 
      id_cuenta, id_periodo, id_usuario, fecha_pago, monto_pagado, numero_recibo, observacion 
    };
    
    const idInsertado = await createPago(nuevoPago);

    res.status(201).json({ 
      mensaje: 'Pago registrado exitosamente', 
      id_pago: idInsertado 
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Error: La cuenta o el periodo especificado no existe' });
    }
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El número de recibo ya ha sido registrado' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


// 4. PUT (Actualizar Pago)
export const putPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { monto_pagado, numero_recibo, observacion } = req.body;

    if (!monto_pagado) {
      return res.status(400).json({ error: 'El monto_pagado es obligatorio' });
    }

    const filasAfectadas = await updatePago(id, { monto_pagado, numero_recibo, observacion });

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    res.json({ mensaje: 'Pago actualizado correctamente' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El número de recibo ya ha sido registrado' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// 5. DELETE (Anular Pago)
export const removePago = async (req, res) => {
  try {
    const { id } = req.params;
    const filasAfectadas = await deletePago(id);

    if (filasAfectadas === 0) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }

    res.json({ mensaje: 'Registro de pago eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};