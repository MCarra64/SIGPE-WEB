import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import abonadoRoutes from './routes/abonado.routes.js';
import cuentaServicioRoutes from './routes/cuentaServicio.routes.js';
import periodoRoutes from './routes/periodo.routes.js';
import cuotaRoutes from './routes/cuota.routes.js';
import pagoRoutes from './routes/pago.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/abonados', abonadoRoutes);
app.use('/api/cuentas', cuentaServicioRoutes);
app.use('/api/periodos', periodoRoutes);
app.use('/api/cuotas', cuotaRoutes);
app.use('/api/pagos', pagoRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;