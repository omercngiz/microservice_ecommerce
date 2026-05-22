import { Router } from 'express';
import { getMeController, loginController, logoutController, refreshTokenController, registerController } from './controller';
import { verifyHmac } from "@digitalocean/hmac-middleware";

const authRouter: Router = Router();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);
authRouter.post('/refresh', refreshTokenController);
authRouter.post('/logout', verifyHmac, logoutController);
authRouter.get('/me', verifyHmac, getMeController);

export default authRouter;