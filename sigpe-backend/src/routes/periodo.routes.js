// src/routes/periodo.routes.js
import { Router } from 'express';
import { 
  getPeriodos, 
  getPeriodo, 
  postPeriodo, 
  putPeriodo, 
  removePeriodo 
} from '../controllers/periodo.controller.js';

const router = Router();

router.get('/', getPeriodos);           // GET /api/periodos
router.get('/:id', getPeriodo);         // GET /api/periodos/1
router.post('/', postPeriodo);          // POST /api/periodos
router.put('/:id', putPeriodo);         // PUT /api/periodos/1
router.delete('/:id', removePeriodo);   // DELETE /api/periodos/1

export default router;