import { check } from "express-validator";

const UpdateCommentValidator = [
    check("text")
        .optional()
        .isString().withMessage("El texto del comentario debe ser una cadena de caracteres")
        .isLength({ min: 1, max: 500 }).withMessage("El texto del comentario debe tener entre 1 y 500 caracteres"),
];

export default UpdateCommentValidator;
