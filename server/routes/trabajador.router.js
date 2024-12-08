import express from 'express';
import { getAllWorkerReservations, updateReservation } from '../controllers/trabajador.controller.js';
import { authRequired, trabajadorRequired } from '../utils/middleware.js';

const router = express.Router();

// Ruta para obtener las reservas asignadas al trabajador autenticado
router.get('/reservas-trabajador/todas', authRequired, trabajadorRequired, getAllWorkerReservations);

// Ruta para actualizar el estado de una reserva (con id_estado)
router.put('/reserva/:id_reserva', authRequired, trabajadorRequired, updateReservation);

export default router;
