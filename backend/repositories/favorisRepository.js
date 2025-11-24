const { Favoris, Livre } = require("../models");

const addFavori = (id_user, id_livre) => Favoris.create({ id_user, id_livre });
const removeFavori = (id_user, id_livre) =>
  Favoris.destroy({ where: { id_user, id_livre } });
const getFavoris = (id_user) =>
  Favoris.findAll({ where: { id_user }, include: Livre });

module.exports = { addFavori, removeFavori, getFavoris };
