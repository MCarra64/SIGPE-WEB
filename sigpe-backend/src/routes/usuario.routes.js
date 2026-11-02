import { Router } from 'express';
import { 
  getUsuarios, 
  postUsuario, 
  putUsuario, 
  removeUsuario,
  cambiarPassword
} from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getUsuarios);
router.post('/', verificarToken, postUsuario);
router.put('/:id', verificarToken, putUsuario);
router.put('/:id/password', verificarToken, cambiarPassword);
router.delete('/:id', verificarToken, removeUsuario);

export default router;