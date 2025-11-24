// routes/themeRoutes.js
const express = require("express");
const router = express.Router();
const themeController = require("../controllers/themeController");

// GET /api/themes
router.get("/", themeController.getAllThemes);

module.exports = router;
