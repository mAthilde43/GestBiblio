const livreService = require("../services/livreService");
const { findOrCreateAuteur } = require("../services/auteurService"); // Import du service Auteur

const getAll = async (req, res) => {
  try {
    const livres = await livreService.getAllLivres();
    res.json(livres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const livre = await livreService.getLivreById(req.params.id);
    res.json(livre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const create = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { titre, date_parution, description, id_theme, auteur } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Créer le livre
    const newLivre = await livreService.createLivre({
      titre,
      date_parution,
      description,
      image_url,
    });

    // Ajouter le thème si sélectionné
    if (id_theme) {
      await newLivre.addTheme(id_theme);
    }

    // Ajouter ou créer l’auteur
    if (auteur) {
      const auteurObj = await findOrCreateAuteur(auteur);
      await newLivre.addAuteur(auteurObj.id_auteur);
    }

    res.status(201).json(newLivre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updatedLivre = await livreService.updateLivre(
      req.params.id,
      req.body
    );
    res.json(updatedLivre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await livreService.deleteLivre(req.params.id);
    res.json({ message: "Livre supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

module.exports = { getAll, getById, create, update, remove };
