import { Router } from 'express';
import { 
    getEstadoCuenta, 
    getCajaDelDia, 
    getMorosos 
} from '../controllers/reporte.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/estado-cuenta/:id_cuenta', verificarToken, getEstadoCuenta);
router.get('/caja-hoy', verificarToken, getCajaDelDia);
router.get('/morosos', verificarToken, getMorosos);

export default router;