// ─── auth.routes.ts ───────────────────────────────────────────────────────────
import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const authRouter = Router();

authRouter.post('/register', auth.register);
authRouter.get('/verify-email/:token', auth.verifyEmail);
authRouter.post('/login', auth.login);
authRouter.post('/refresh', auth.refreshToken);
authRouter.post('/logout', authenticate, auth.logout);
authRouter.post('/forgot-password', auth.forgotPassword);
authRouter.post('/reset-password/:token', auth.resetPassword);

export default authRouter;
