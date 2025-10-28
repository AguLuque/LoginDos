import express from 'express';
import { loginController, registerController, verifyTokenController } from '../controllers/authC.js';

const router = express.Router();

router.post('/login', loginController);

router.post('/register', registerController);

router.get('/verify-token', verifyTokenController);

export default router;