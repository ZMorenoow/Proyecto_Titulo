import express from 'express';
import { getReservasPorEstado, getPagosPorMes,getServiciosSolicitados,getComentariosRecientes,getKPIs  } from '../controllers/dashboard.controller.js';

const router = express.Router();

// Ruta para obtener reservas por estado
router.get('/reservas-estado', getReservasPorEstado);

// Ruta para obtener pagos por mes
router.get('/pagos-mes', getPagosPorMes);
router.get("/servicios-solicitados", getServiciosSolicitados);
router.get("/kpis", getKPIs);
router.get("/comentarios", getComentariosRecientes);
export default router;
