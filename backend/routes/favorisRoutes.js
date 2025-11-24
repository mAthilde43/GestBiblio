const express = require("express");
const router = express.Router();
const favorisController = require("../controllers/favorisController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.get("/", authMiddleware, favorisController.getAll);
router.post("/", authMiddleware, favorisController.add);
router.delete("/:id", authMiddleware, favorisController.remove);

module.exports = router;
