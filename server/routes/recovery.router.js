import express from 'express';
import { requestPasswordReset, verifyResetToken, resetPassword } from '../controllers/recovery.controller.js';

const router = express.Router();

router.post('/request-password-reset', requestPasswordReset);
router.post('/token-verify', verifyResetToken);
router.put('/reset-password', resetPassword);

export default router;
