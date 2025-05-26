import { check } from 'express-validator';

const UpdateProfileValidator = [
    check('name')
    .optional()
    .isString()
    .isLength({ min: 6 }).withMessage('El nombre debe ser una cadena de al menos 6 caracteres'),
    // .isAlpha().withMessage('El nombre solo puede contener letras'),

    check('birthdate')
    .optional()
    .isDate().withMessage('La fecha de nacimiento no es válida')
    .isISO8601().withMessage('La fecha de nacimiento espera un formato YYYY-MM-DD'),
    
    check('phone')
    .optional()
    //.isMobilePhone('any', {strictMode: false}).withMessage('El número de teléfono no es válido')
    //.isLength({ min: 10, max: 15 }).withMessage('El número de teléfono debe tener entre 10 y 15 dígitos'),
];

export default UpdateProfileValidator;