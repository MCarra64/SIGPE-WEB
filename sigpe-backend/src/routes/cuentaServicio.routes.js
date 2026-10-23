// src/routes/cuentaServicio.routes.js
import { Router } from 'express';
import { 
  getCuentas, 
  getCuenta, 
  getCuentasDeAbonado,
  postCuenta, 
  putCuenta, 
  removeCuenta 
} from '../controllers/cuentaServicio.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getCuentas);
router.get('/:id', getCuenta);
router.get('/abonado/:idAbonado', getCuentasDeAbonado);
router.post('/', verificarToken, postCuenta);
router.put('/:id', verificarToken, putCuenta);
router.delete('/:id', verificarToken, removeCuenta);

export default router;