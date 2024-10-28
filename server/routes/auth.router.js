import { Router } from 'express';
import { googleLogin, googleLoginRedirect } from '../controllers/auth.controller.js';
import passport from 'passport';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', googleLoginRedirect, googleLogin);

export default router;