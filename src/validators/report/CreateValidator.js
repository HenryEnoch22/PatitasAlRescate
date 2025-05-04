import { check } from "express-validator";

const CreateValidator = [
  check("userEmail")
    .exists()
    .withMessage("El correo electrónico es obligatorio")
    .notEmpty()
    .withMessage("El correo electrónico no puede estar vacío"),

  check("petName")
    .exists()
    .withMessage("El nombre de la mascota es obligatorio")
    .notEmpty()
    .withMessage("El nombre de la mascota no puede estar vacío"),

  check("petDetails.breed")
    .exists()
    .withMessage("La raza de la mascota es obligatoria")
    .notEmpty()
    .withMessage("La raza de la mascota no puede estar vacía"),

  check("petDetails.species")
    .exists()
    .withMessage("La especie de la mascota es obligatoria")
    .notEmpty()
    .withMessage("La especie de la mascota no puede estar vacía"),

  check("petDetails.color")
    .exists()
    .withMessage("El color de la mascota es obligatorio")
    .notEmpty()
    .withMessage("El color de la mascota no puede estar vacío"),

  check("lastSeenLocation")
    .exists()
    .withMessage("La ubicación de la última vez vista es obligatoria")
    .notEmpty()
    .withMessage("La ubicación de la última vez vista no puede estar vacía"),

  check("userContact")
    .exists()
    .withMessage("El contacto del usuario es obligatorio")
    .notEmpty()
    .withMessage("El contacto del usuario no puede estar vacío"),

  check("description")
    .exists()
    .withMessage("La descripción es obligatoria")
    .notEmpty()
    .withMessage("La descripción no puede estar vacía"),
];

export default CreateValidator;
