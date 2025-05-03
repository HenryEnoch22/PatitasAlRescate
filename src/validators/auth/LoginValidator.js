import { check } from 'express-validator';

const LoginValidator = [
    check('email').exists().withMessage('El email es obligatorio')
    .notEmpty().withMessage('El email no puede estar vacío')
    .isEmail().withMessage('El email no es válido'),

    check('password').exists().withMessage('La contraseña es obligatoria')
    .notEmpty().withMessage('La contraseña no puede estar vacía')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
];

export default LoginValidator;