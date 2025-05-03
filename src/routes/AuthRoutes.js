import { Router } from 'express';
import { login, register, logout } from '../controllers/AuthController.js';
import RegisterValidator from '../validators/auth/RegisterValidator.js';
import LoginValidator from '../validators/auth/LoginValidator.js';

const router = Router();

router.post('/register', RegisterValidator, register);
router.post('/login', LoginValidator, login);
router.post('/logout', logout);

export default router;