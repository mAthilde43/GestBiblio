const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const { getAllUsers } = require("../controllers/userController");

router.get("/me", authMiddleware, userController.getCurrentUser);
router.get("/", getAllUsers);
router.put("/me", authMiddleware, userController.updateCurrentUser);

module.exports = router;
