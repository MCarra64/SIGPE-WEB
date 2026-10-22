// src/routes/cuota.routes.js
import { Router } from 'express';
import { 
  getCuotas, 
  getCuota, 
  postCuota, 
  putCuota, 
  removeCuota 
} from '../controllers/cuota.controller.js';

const router = Router();

router.get('/', getCuotas);           // GET /api/cuotas
router.get('/:id', getCuota);         // GET /api/cuotas/1
router.post('/', postCuota);          // POST /api/cuotas
router.put('/:id', putCuota);         // PUT /api/cuotas/1
router.delete('/:id', removeCuota);   // DELETE /api/cuotas/1

export default router;