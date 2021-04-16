import { Router } from 'express';
import loginController from './login';
const router = Router();

router.get('/login', loginController);

export { router };
