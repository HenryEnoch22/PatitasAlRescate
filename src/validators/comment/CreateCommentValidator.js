import { check } from "express-validator";

const CreateCommentValidator = [
    check("reportId")
        .notEmpty()
        .withMessage("El id del reporte es obligatorio")
        .isMongoId()
        .withMessage("El id del reporte no es válido"),

    check("text")
        .notEmpty().withMessage("El texto del comentario es obligatorio")
        .isString().withMessage("El texto del comentario debe ser una cadena de caracteres")
        .isLength({ min: 1, max: 500 }).withMessage("El texto del comentario debe tener entre 1 y 500 caracteres"),

];

export default CreateCommentValidator;