import { Router } from 'express';
import { 
  getCuotas, 
  getCuota, 
  postCuota, 
  putCuota, 
  removeCuota 
} from '../controllers/cuota.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getCuotas);
router.get('/:id', getCuota);
router.post('/', verificarToken, postCuota);
router.put('/:id', verificarToken, putCuota);
router.delete('/:id', verificarToken, removeCuota);

export default router;