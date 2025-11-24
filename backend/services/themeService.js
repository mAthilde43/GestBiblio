// services/themeService.js
const themeRepo = require("../repositories/themeRepository");

const getAllThemes = () => themeRepo.getAllThemes();

module.exports = {
  getAllThemes,
};
