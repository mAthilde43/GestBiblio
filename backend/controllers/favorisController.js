const favorisService = require("../services/favorisService");

const add = async (req, res) => {
  try {
    await favorisService.addFavori(req.user.id_user, req.body.id_livre);
    res.status(201).json({ message: "Ajouté aux favoris" });
  } catch (err) {
    console.error("Erreur ajout favori:", err);
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await favorisService.removeFavori(req.user.id_user, req.params.id);
    res.json({ message: "Supprimé des favoris" });
  } catch (err) {
    console.error("Erreur suppression favori:", err);
    res.status(500).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const favoris = await favorisService.getFavoris(req.user.id_user);
    res.json(favoris);
  } catch (err) {
    console.error("Erreur récupération favoris:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { add, remove, getAll };
