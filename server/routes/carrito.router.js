import express from 'express';
import { agregarAlCarrito, obtenerCarrito, realizarPago,eliminarDelCarrito } from '../controllers/carrito.controller.js';
import { authRequired } from '../utils/middleware.js';

const router = express.Router();

router.post('/agregar', authRequired, agregarAlCarrito);
router.get('/obtener', authRequired, obtenerCarrito);
router.put('/pagar', authRequired, realizarPago);

router.post('/eliminar', authRequired, eliminarDelCarrito);

export default router;