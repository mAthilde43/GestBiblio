const favorisRepo = require("../repositories/favorisRepository");

const addFavori = (id_user, id_livre) =>
  favorisRepo.addFavori(id_user, id_livre);
const removeFavori = (id_user, id_livre) =>
  favorisRepo.removeFavori(id_user, id_livre);
const getFavoris = (id_user) => favorisRepo.getFavoris(id_user);

module.exports = { addFavori, removeFavori, getFavoris };
