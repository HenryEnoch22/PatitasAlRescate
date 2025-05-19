import { check, body } from "express-validator";

const UpdateValidator = [
  check("userEmail")
    .optional()
    .isEmail()
    .withMessage("El correo electrónico debe ser válido"),

  check("petName")
    .optional()
    .notEmpty()
    .withMessage("El nombre de la mascota no puede estar vacío"),

  check("petDetails.breed")
    .optional()
    .notEmpty()
    .withMessage("La raza no puede estar vacía"),

  check("petDetails.species")
    .optional()
    .notEmpty()
    .withMessage("La especie no puede estar vacía"),

  check("petDetails.color")
    .optional()
    .notEmpty()
    .withMessage("El color no puede estar vacío"),

  check("lastSeenLocation")
    .optional()
    .notEmpty()
    .withMessage("La ubicación no puede estar vacía"),

  check("userContact")
    .optional()
    .notEmpty()
    .withMessage("El contacto no puede estar vacío"),

  check("description")
    .optional()
    .notEmpty()
    .withMessage("La descripción no puede estar vacía"),

  check("status")
    .optional()
    .isIn(["started", "finished"])
    .withMessage("El estado debe ser 'started' o 'finished'")
];

export default UpdateValidator;
