const { Livre, Auteur, Theme } = require("../models");

const getAllLivres = () =>
  Livre.findAll({ include: [Auteur, Theme], order: [["titre", "ASC"]] });

const getLivreById = (id) => Livre.findByPk(id, { include: [Auteur, Theme] });

const createLivre = (data) => Livre.create(data);

const updateLivre = (id, data) =>
  Livre.update(data, { where: { id_livre: id } });

const deleteLivre = (id) => Livre.destroy({ where: { id_livre: id } });

module.exports = {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
};
