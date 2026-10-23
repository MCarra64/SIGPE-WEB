import { Router } from 'express';
import { 
  getPeriodos, 
  getPeriodo, 
  postPeriodo, 
  putPeriodo, 
  removePeriodo 
} from '../controllers/periodo.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getPeriodos);
router.get('/:id', getPeriodo);
router.post('/', verificarToken, postPeriodo);
router.put('/:id', verificarToken, putPeriodo);
router.delete('/:id', verificarToken, removePeriodo);

export default router;