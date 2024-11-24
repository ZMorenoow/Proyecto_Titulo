import express from 'express';
import { getAllWorkerReservations } from '../controllers/trabajador.controller.js';
import { authRequired, trabajadorRequired } from '../utils/middleware.js';

const router = express.Router();

// Ruta para obtener las reservas asignadas al trabajador autenticado
router.get('/reservas-trabajador/todas', authRequired, trabajadorRequired, getAllWorkerReservations);

export default router;
