import { Router } from 'express';
import { getMeController, loginController, logoutController, refreshTokenController, registerController } from './controller';
import { requireAuth } from './middleware';

const authRouter: Router = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/refresh', requireAuth, refreshTokenController);
authRouter.post('/logout', requireAuth, logoutController);
authRouter.get('/me', requireAuth, getMeController);

export default authRouter;