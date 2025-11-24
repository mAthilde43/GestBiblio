const express = require("express");
const router = express.Router();
const empruntController = require("../controllers/empruntController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/emprunter", authMiddleware, empruntController.emprunter);
router.post("/rendre", authMiddleware, empruntController.rendre);
router.get("/me", authMiddleware, empruntController.getUserEmprunts);
router.get("/livre/:id", empruntController.getEmpruntLivre);

module.exports = router;
