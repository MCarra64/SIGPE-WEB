import { Router } from 'express';
import { 
  getAbonados, 
  getAbonado, 
  postAbonado, 
  putAbonado, 
  removeAbonado,
  getTablaResidentes
} from '../controllers/abonado.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/tabla', verificarToken, getTablaResidentes);
router.get('/', getAbonados);
router.get('/:id', getAbonado);
router.post('/', verificarToken, postAbonado);
router.put('/:id', verificarToken, putAbonado);
router.delete('/:id', verificarToken, removeAbonado);

export default router;