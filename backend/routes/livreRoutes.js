const express = require("express");
const router = express.Router();
const livreController = require("../controllers/livreController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");

// Configuration du stockage Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.get("/", livreController.getAll);
router.get("/:id", livreController.getById);

// POST avec Multer pour gérer l'image
router.post(
  "/",
  authMiddleware,
  isAdmin,
  upload.single("image"),
  livreController.create
);

router.put("/:id", authMiddleware, isAdmin, livreController.update);
router.delete("/:id", authMiddleware, isAdmin, livreController.remove);

module.exports = router;
