// repositories/themeRepository.js
const { Theme } = require("../models");

const getAllThemes = () => Theme.findAll({ order: [["nom", "ASC"]] });

module.exports = {
  getAllThemes,
};
