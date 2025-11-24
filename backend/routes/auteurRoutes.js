// backend/routes/auteurRoutes.js
const express = require("express");
const router = express.Router();
const auteurController = require("../controllers/auteurController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, auteurController.getAll); // liste tous les auteurs
router.post("/", authMiddleware, isAdmin, auteurController.create); // créer un auteur

module.exports = router;
