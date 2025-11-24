const jwt = require("jsonwebtoken");
require("dotenv").config();

// Vérifie et décode le JWT
const verifyToken = (req) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization header reçu :", authHeader);

  if (!authHeader) throw new Error("Token manquant");

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé :", decoded);
    return decoded; // { id_user, id_role }
  } catch (err) {
    throw new Error("Token invalide");
  }
};

// Middleware pour authentifier l'utilisateur
const authMiddleware = (req, res, next) => {
  console.log("✅ authMiddleware appelé");
  try {
    const decoded = verifyToken(req);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Erreur dans authMiddleware :", err.message);
    res.status(401).json({ message: err.message });
  }
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  try {
    if (!req.user) throw new Error("Utilisateur non authentifié");
    if (req.user.id_role !== 2)
      return res
        .status(403)
        .json({ message: "Accès réservé à l’administrateur" });
    next();
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
};

module.exports = { authMiddleware, isAdmin, verifyToken };
