import express from 'express';
import { obtenerReservas , obtenerHorariosOcupados } from '../controllers/reserva.controller.js';
import { authRequired } from '../utils/middleware.js';

const router = express.Router();

router.get('/obtener', authRequired, obtenerReservas);
router.get('/obtenerfechas', authRequired, obtenerHorariosOcupados);

export default router;