// src/routes/usuario.routes.js
import { Router } from 'express';
import { 
  getUsuarios, 
  postUsuario, 
  putUsuario, 
  removeUsuario 
} from '../controllers/usuario.controller.js';

const router = Router();

router.get('/', getUsuarios);           // GET /api/usuarios
router.post('/', postUsuario);          // POST /api/usuarios
router.put('/:id', putUsuario);         // PUT /api/usuarios/1
router.delete('/:id', removeUsuario);   // DELETE /api/usuarios/1

export default router;