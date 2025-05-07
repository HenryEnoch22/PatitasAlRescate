import multer from "multer";
import path from "path";
import fs from "fs";

// Configurar almacenamiento dinámico
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    if (req.baseUrl.includes("profile")) {
      folder += "profiles/"; // Para fotos de perfil
    } else if (req.baseUrl.includes("report")) {
      folder += "reports/"; // Para fotos de reportes
    }

    // Crea la carpeta si no existe
    fs.mkdirSync(folder, { recursive: true });

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Validación de tipo de archivo
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png/;
  const isValid =
    allowed.test(file.mimetype) &&
    allowed.test(path.extname(file.originalname).toLowerCase());

  cb(null, isValid);
};

const upload = multer({ storage, fileFilter });

export default upload;
