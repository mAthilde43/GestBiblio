const userRepository = require("../repositories/userRepository");
const { User, Emprunt, Livre } = require("../models");

// Récupérer les infos de l'utilisateur connecté
const getCurrentUser = async (req, res) => {
  try {
    const user = await userRepository.findById(req.user.id_user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // on ne renvoie pas le mot de passe
    const { password, ...userData } = user.toJSON();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userRepository.findAllUsers(); // appelle directement le repo
    const formattedUsers = users.map((user) => {
      const { password, Emprunts, ...userData } = user.toJSON();

      const emprunts =
        Emprunts?.map((e) => ({
          id_emprunt: e.id_emprunt,
          id_livre: e.id_livre,
          titre: e.Livre.titre || "Inconnu",
          date_emprunt: e.date_emprunt,
          date_retour_prevu: e.date_retour_prevu,
          date_retour_effectif: e.date_retour_effectif,
        })) || [];

      return {
        ...userData,
        emprunts,
        // livre: user.Emprunts?.[0]?.Livre?.titre || "Aucun",
      };
    });
    res.json(formattedUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    const { nom, prenom, telephone } = req.body;

    const user = await userRepository.findById(req.user.id_user);
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    // Mise à jour
    user.nom = nom ?? user.nom;
    user.prenom = prenom ?? user.prenom;
    user.telephone = telephone ?? user.telephone;

    await user.save();

    const { password, ...updatedUser } = user.toJSON();
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// RGPD: Exporter toutes les données personnelles de l'utilisateur en JSON
const exportUserData = async (req, res) => {
  try {
    const user = await userRepository.findUserWithAllData(req.user.id_user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const userData = user.toJSON();
    delete userData.password;

    // Formatage des données pour l'export RGPD
    const exportData = {
      informations_personnelles: {
        nom: userData.nom,
        prenom: userData.prenom,
        email: userData.email,
        telephone: userData.telephone,
        numero_carte: userData.card_number,
        role: userData.Role?.nom || "Non défini",
        date_inscription: userData.createdAt,
      },
      emprunts:
        userData.Emprunts?.map((emprunt) => ({
          livre: emprunt.Livre?.titre || "Inconnu",
          date_emprunt: emprunt.date_emprunt,
          date_retour_prevu: emprunt.date_retour_prevu,
          date_retour_effectif: emprunt.date_retour_effectif,
        })) || [],
      favoris:
        userData.Favoris?.map((favori) => ({
          livre: favori.Livre?.titre || "Inconnu",
        })) || [],
      date_export: new Date().toISOString(),
    };

    res.json(exportData);
  } catch (err) {
    console.error("Erreur export RGPD:", err);
    res.status(500).json({ message: "Erreur lors de l'export des données" });
  }
};

// RGPD: Supprimer le compte de l'utilisateur connecté
const deleteCurrentUser = async (req, res) => {
  try {
    const user = await userRepository.findById(req.user.id_user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'utilisateur est admin (id_role = 2)
    if (user.id_role === 2) {
      return res.status(403).json({
        message: "Les administrateurs ne peuvent pas supprimer leur compte",
      });
    }

    await userRepository.deleteUserById(req.user.id_user);

    res.json({ message: "Compte supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression compte:", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du compte" });
  }
};

module.exports = {
  getCurrentUser,
  getAllUsers,
  updateCurrentUser,
  exportUserData,
  deleteCurrentUser,
};
