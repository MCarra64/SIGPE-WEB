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

const router = Router();

router.get('/', getCuentas);                              // GET /api/cuentas
router.get('/:id', getCuenta);                            // GET /api/cuentas/1
router.get('/abonado/:idAbonado', getCuentasDeAbonado);   // GET /api/cuentas/abonado/1
router.post('/', postCuenta);                             // POST /api/cuentas
router.put('/:id', putCuenta);                            // PUT /api/cuentas/1
router.delete('/:id', removeCuenta);                      // DELETE /api/cuentas/1

export default router;