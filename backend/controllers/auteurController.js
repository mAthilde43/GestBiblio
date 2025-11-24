const auteurService = require("../services/auteurService");

// Récupérer tous les auteurs
const getAll = async (req, res) => {
  try {
    const auteurs = await auteurService.getAllAuteurs();
    res.json(auteurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Créer un auteur si besoin (optionnel)
const create = async (req, res) => {
  try {
    const { nom, prenom } = req.body;
    const auteur = await auteurService.findOrCreateAuteur(nom, prenom);
    res.status(201).json(auteur);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = {
  getAll,
  create,
};
