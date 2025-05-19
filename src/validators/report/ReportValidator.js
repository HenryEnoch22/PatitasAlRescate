import { body, validationResult } from "express-validator";

const ReportValidator = [
  body("reason")
    .trim()
    .notEmpty()
    .withMessage("La razón es obligatoria")
    .isLength({ max: 500 })
    .withMessage("Máximo 500 caracteres"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export default ReportValidator;
