import { 
  getInfoCuenta, 
  getHistorialCuenta, 
  getResumenCajaHoy, 
  getDetallePagosHoy, 
  getReporteMorosos 
} from '../models/reporte.model.js';

export const getEstadoCuenta = async (req, res) => {
  try {
    const { id_cuenta } = req.params;

    const infoCuenta = await getInfoCuenta(id_cuenta);

    if (!infoCuenta) {
      return res.status(404).json({ error: 'Cuenta de servicio no encontrada' });
    }

    const historial = await getHistorialCuenta(id_cuenta);

    let totalPendiente = 0;
    let totalPagado = 0;

    historial.forEach(registro => {
      if (!registro.id_pago) {
        totalPendiente += Number(registro.monto_esperado || 0);
      } else {
        totalPagado += Number(registro.monto_pagado || 0);
      }
    });

    res.json({
      cuenta: infoCuenta,
      resumen: {
        total_pagado: totalPagado.toFixed(2),
        total_pendiente: totalPendiente.toFixed(2),
        estado: totalPendiente > 0 ? 'Moroso' : 'Al día'
      },
      historial: historial
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getCajaDelDia = async (req, res) => {
  try {
    const resumen = await getResumenCajaHoy();
    
    const detallePagos = await getDetallePagosHoy();

    res.json({
      fecha_consulta: new Date().toISOString().split('T')[0],
      resumen: {
        total_recaudado: Number(resumen.total_recaudado).toFixed(2),
        cantidad_transacciones: resumen.cantidad_transacciones
      },
      detalle_transacciones: detallePagos
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getMorosos = async (req, res) => {
  try {
    const deudas = await getReporteMorosos();

    const reporteAgrupado = {};

    deudas.forEach(deuda => {
      const idCuenta = deuda.id_cuenta;
      
      if (!reporteAgrupado[idCuenta]) {
        reporteAgrupado[idCuenta] = {
          id_abonado: deuda.id_abonado,
          nombre_abonado: deuda.nombre_abonado,
          telefono: deuda.telefono,
          numero_cuenta: deuda.numero_cuenta,
          total_deuda: 0,
          periodos_pendientes: []
        };
      }

      reporteAgrupado[idCuenta].total_deuda += Number(deuda.monto_debido);
      reporteAgrupado[idCuenta].periodos_pendientes.push({
        mes: deuda.periodo_mes,
        anio: deuda.periodo_anio,
        monto: deuda.monto_debido
      });
    });

    const resultadoFinal = Object.values(reporteAgrupado);

    resultadoFinal.sort((a, b) => b.total_deuda - a.total_deuda);

    res.json({
      cantidad_morosos: resultadoFinal.length,
      morosos: resultadoFinal
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
