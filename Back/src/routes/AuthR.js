import express from 'express';
import { loginController, registerController, verifyTokenController } from '../controllers/authC.js';

const router = express.Router();

// Ruta para login (solo verifica credenciales)
router.post('/login', loginController);

// Ruta para registro (crea nuevos usuarios)
router.post('/register', registerController);

// Ruta para verificar token
router.get('/verify-token', verifyTokenController);

export default router;