// src/routes/abonado.routes.js
import { Router } from 'express';
import { 
  getAbonados, 
  getAbonado, 
  postAbonado, 
  putAbonado, 
  removeAbonado 
} from '../controllers/abonado.controller.js';

const router = Router();

router.get('/', getAbonados);           // GET /api/abonados
router.get('/:id', getAbonado);         // GET /api/abonados/1
router.post('/', postAbonado);          // POST /api/abonados
router.put('/:id', putAbonado);         // PUT /api/abonados/1
router.delete('/:id', removeAbonado);   // DELETE /api/abonados/1

export default router;