// src/routes/pago.routes.js
import { Router } from 'express';
import { 
  getPagos, 
  getPago, 
  postPago, 
  putPago, 
  removePago 
} from '../controllers/pago.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getPagos);
router.get('/:id', getPago);
router.post('/', verificarToken, postPago); 
router.put('/:id', verificarToken, putPago);
router.delete('/:id', verificarToken, removePago);

export default router;