const favorisService = require("../services/favorisService");

const add = async (req, res) => {
  await favorisService.addFavori(req.user.id_user, req.body.id_livre);
  res.status(201).json({ message: "Ajouté aux favoris" });
};

const remove = async (req, res) => {
  await favorisService.removeFavori(req.user.id_user, req.params.id);
  res.json({ message: "Supprimé des favoris" });
};

const getAll = async (req, res) => {
  const favoris = await favorisService.getFavoris(req.user.id_user);
  res.json(favoris);
};

module.exports = { add, remove, getAll };
