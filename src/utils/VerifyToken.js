import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token no proporcionado o inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // debe estar definido en tu .env
    req.user = decoded; // ej: { id: "123abc", email: "...", iat: ..., exp: ... }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido", error: err.message });
  }
};
