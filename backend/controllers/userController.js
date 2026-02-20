const userRepository = require("../repositories/userRepository");
const { User, Emprunt, Livre } = require("../models");
const PDFDocument = require("pdfkit");

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

// RGPD: Exporter toutes les données personnelles de l'utilisateur en PDF
const exportUserData = async (req, res) => {
  try {
    const user = await userRepository.findUserWithAllData(req.user.id_user);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const userData = user.toJSON();
    delete userData.password;

    // Création du PDF
    const doc = new PDFDocument({ margin: 50 });

    // Configuration des headers pour le téléchargement
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=mes-donnees-${userData.prenom}-${userData.nom}.pdf`,
    );

    // Pipe le PDF vers la réponse
    doc.pipe(res);

    // En-tête du document
    doc
      .fontSize(24)
      .fillColor("#9e8c78")
      .text("Export de mes données personnelles", {
        align: "center",
      });
    doc.moveDown();
    doc
      .fontSize(10)
      .fillColor("#666")
      .text(`Export RGPD - Book'Lyst`, { align: "center" });
    doc
      .fontSize(10)
      .text(`Date d'export : ${new Date().toLocaleDateString("fr-FR")}`, {
        align: "center",
      });
    doc.moveDown(2);

    // Section Informations personnelles
    doc.fontSize(16).fillColor("#9e8c78").text("Informations personnelles");
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#ddd");
    doc.moveDown(0.5);

    doc.fontSize(11).fillColor("#333");
    doc.text(`Nom : ${userData.nom}`);
    doc.text(`Prénom : ${userData.prenom}`);
    doc.text(`Email : ${userData.email}`);
    doc.text(`Téléphone : ${userData.telephone || "Non renseigné"}`);
    doc.text(`Numéro de carte : ${userData.card_number || "Non attribué"}`);
    doc.text(`Rôle : ${userData.Role?.nom || "Non défini"}`);
    doc.text(
      `Date d'inscription : ${new Date(userData.createdAt).toLocaleDateString("fr-FR")}`,
    );
    doc.moveDown(2);

    // Section Emprunts
    doc.fontSize(16).fillColor("#9e8c78").text("Historique des emprunts");
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#ddd");
    doc.moveDown(0.5);

    const emprunts = userData.Emprunts || [];
    if (emprunts.length === 0) {
      doc.fontSize(11).fillColor("#666").text("Aucun emprunt enregistré.");
    } else {
      emprunts.forEach((emprunt, index) => {
        doc.fontSize(11).fillColor("#333");
        doc.text(`${index + 1}. ${emprunt.Livre?.titre || "Livre inconnu"}`);
        doc.fontSize(10).fillColor("#666");
        doc.text(
          `   Emprunté le : ${new Date(emprunt.date_emprunt).toLocaleDateString("fr-FR")} | Retour prévu : ${new Date(emprunt.date_retour_prevu).toLocaleDateString("fr-FR")}${emprunt.date_retour_effectif ? ` | Retourné le : ${new Date(emprunt.date_retour_effectif).toLocaleDateString("fr-FR")}` : " | Non retourné"}`,
        );
        doc.moveDown(0.3);
      });
    }
    doc.moveDown(2);

    // Section Favoris
    doc.fontSize(16).fillColor("#9e8c78").text("Mes favoris");
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#ddd");
    doc.moveDown(0.5);

    const favoris = userData.Favoris || [];
    if (favoris.length === 0) {
      doc.fontSize(11).fillColor("#666").text("Aucun favori enregistré.");
    } else {
      favoris.forEach((favori, index) => {
        doc.fontSize(11).fillColor("#333");
        doc.text(`${index + 1}. ${favori.Livre?.titre || "Livre inconnu"}`);
      });
    }

    // Pied de page
    doc.moveDown(3);
    doc
      .fontSize(9)
      .fillColor("#999")
      .text(
        "Ce document a été généré conformément au Règlement Général sur la Protection des Données (RGPD). " +
          "Vous avez le droit d'accéder, de rectifier et de supprimer vos données personnelles.",
        { align: "center" },
      );

    // Finaliser le PDF
    doc.end();
  } catch (err) {
    console.error("Erreur export RGPD:", err);
    res.status(500).json({ message: "Erreur lors de l'export des données" });
  }
};

module.exports = {
  getCurrentUser,
  getAllUsers,
  updateCurrentUser,
  exportUserData,
};
