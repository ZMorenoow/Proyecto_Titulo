import express from 'express';
import { obtenerReservas } from '../controllers/reserva.controller.js';
import { authRequired } from '../utils/middleware.js';

const router = express.Router();

router.get('/obtener', authRequired, obtenerReservas);

export default router;