const { Auteur } = require("../models");

const getAllAuteurs = async () => {
  return await Auteur.findAll({ order: [["nom", "ASC"]] });
};

const getAuteurByNom = async (nom) => {
  return await Auteur.findOne({ where: { nom } });
};

const createAuteur = async ({ nom, prenom }) => {
  return await Auteur.create({ nom, prenom });
};

module.exports = {
  getAllAuteurs,
  getAuteurByNom,
  createAuteur,
};
