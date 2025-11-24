// controllers/themeController.js
const themeService = require("../services/themeService");

const getAllThemes = async (req, res) => {
  try {
    const themes = await themeService.getAllThemes();
    res.json(themes);
  } catch (error) {
    console.error("Erreur dans getAllThemes :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  getAllThemes,
};
