import express from 'express';
import { guardarValoracion, obtenerValoraciones, enviarReclamo} from '../controllers/contacto.controller.js';
import { authRequired } from '../utils/middleware.js';

const router = express.Router();

router.post('/valoracion', authRequired, guardarValoracion);
router.get('/obtener',  obtenerValoraciones);
router.post('/reclamo', authRequired, enviarReclamo);


export default router;
