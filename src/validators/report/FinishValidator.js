import { check, validationResult } from "express-validator";

const FinishValidator = [
	check("reportId")
		.exists()
		.withMessage("El ID del reporte es obligatorio")
		.notEmpty()
		.withMessage("El ID del reporte no puede estar vacío")
		.isMongoId()
		.withMessage("El ID del reporte no es válido"),

	(req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}
		next();
	},
];

export default FinishValidator;
