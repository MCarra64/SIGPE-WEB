// src/routes/usuario.routes.js
import { Router } from 'express';
import { 
  getUsuarios, 
  postUsuario, 
  putUsuario, 
  removeUsuario 
} from '../controllers/usuario.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getUsuarios);
router.post('/', verificarToken, postUsuario);
router.put('/:id', verificarToken, putUsuario);
router.delete('/:id', verificarToken, removeUsuario);

export default router;