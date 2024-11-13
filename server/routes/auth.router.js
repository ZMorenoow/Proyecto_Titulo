import express from 'express';
import { registerUser, loginUser, verifyEmail, getMe } from '../controllers/auth.controller.js';
import { authRequired} from '../utils/middleware.js';

const router = express.Router();

// Ruta para registro de usuario
router.post('/register', registerUser);

// Ruta para login de usuario
router.post('/login', loginUser);

// Ruta para verificar el correo
router.get('/verify/:verificationToken', verifyEmail);

router.get('/me', authRequired, getMe);


export default router;