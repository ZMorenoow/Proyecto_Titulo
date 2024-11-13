import express from 'express';
import { getUsersByService } from '../controllers/trabajador.controller.js';
import { authRequired, trabajadorRequired } from '../utils/middleware.js';

const router = express.Router();


router.get('/getUser/:id_servicio', authRequired, trabajadorRequired, getUsersByService);

export default router;
