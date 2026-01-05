const express = require("express");
const router = express.Router();
const empruntController = require("../controllers/empruntController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

console.log("📁 empruntRoutes chargé !");

router.post("/emprunter", authMiddleware, empruntController.emprunter);
router.post("/rendre", authMiddleware, empruntController.rendre);
router.get("/me", authMiddleware, empruntController.getUserEmprunts);
router.get("/livre/:id", empruntController.getEmpruntLivre);
router.post(
  "/emprunterForUser",
  authMiddleware,
  isAdmin,
  empruntController.emprunterPourUser
);

router.put(
  "/:id_emprunt/return",
  authMiddleware,
  isAdmin,
  empruntController.rendreParEmprunt
);

module.exports = router;
