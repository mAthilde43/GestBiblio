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
      const { password, ...userData } = user.toJSON();
      return {
        ...userData,
        livre: user.Emprunts?.[0]?.Livre?.titre || "Aucun",
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

module.exports = {
  getCurrentUser,
  getAllUsers,
  updateCurrentUser,
};
