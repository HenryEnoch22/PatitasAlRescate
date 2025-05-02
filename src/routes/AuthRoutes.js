import { Router } from 'express';
import { register } from '../controllers/AuthController.js';
import RegisterValidator from '../validators/RegisterValidator.js';

const router = Router();

router.post('/register', RegisterValidator, register);

export default router;