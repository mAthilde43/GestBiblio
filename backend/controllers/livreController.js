const livreService = require("../services/livreService");
const { findOrCreateAuteur } = require("../services/auteurService"); // Import du service Auteur
const { Livre, Auteur, Theme } = require("../models");

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

    // Ajouter le(s) thème(s) si sélectionné(s)
    if (id_theme) {
      if (Array.isArray(id_theme)) {
        // addThemes accepts array of ids
        await newLivre.addThemes(id_theme);
      } else {
        await newLivre.addTheme(id_theme);
      }
    }

    // Ajouter ou créer le(s) auteur(s)
    if (auteur) {
      if (Array.isArray(auteur)) {
        for (const nom of auteur) {
          if (!nom) continue;
          const auteurObj = await findOrCreateAuteur(nom);
          await newLivre.addAuteur(auteurObj.id_auteur);
        }
      } else {
        const auteurObj = await findOrCreateAuteur(auteur);
        await newLivre.addAuteur(auteurObj.id_auteur);
      }
    }

    res.status(201).json(newLivre);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { titre, date_parution, description, id_theme, auteur } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : undefined;

    const updatedLivre = await livreService.updateLivre(req.params.id, {
      titre,
      date_parution,
      description,
      image_url,
    });

    // Mettre à jour le(s) thème(s) si présent(s)
    if (id_theme) {
      if (Array.isArray(id_theme)) {
        await updatedLivre.setThemes(id_theme);
      } else {
        await updatedLivre.setThemes([id_theme]);
      }
    }

    // Mettre à jour le(s) auteur(s) si présent(s)
    if (auteur) {
      if (Array.isArray(auteur)) {
        const auteurIds = [];
        for (const nom of auteur) {
          if (!nom) continue;
          const auteurObj = await findOrCreateAuteur(nom);
          auteurIds.push(auteurObj.id_auteur);
        }
        await updatedLivre.setAuteurs(auteurIds);
      } else {
        const auteurObj = await findOrCreateAuteur(auteur);
        await updatedLivre.setAuteurs([auteurObj.id_auteur]);
      }
    }

    // Recharger les relations pour retourner l'objet complet
    const livreFinal = await Livre.findByPk(req.params.id, {
      include: [Auteur, Theme],
    });
    res.json(livreFinal);
  } catch (err) {
    console.error("Erreur updateLivre:", err);
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
