const empruntService = require("../services/empruntService");
const empruntRepo = require("../repositories/empruntRepository");
const { Emprunt } = require("../models");

const emprunter = async (req, res) => {
  try {
    const { id_livre, dateRetourPrevu } = req.body;
    await empruntService.emprunter(req.user.id_user, id_livre, dateRetourPrevu);
    res.status(201).json({ message: "Livre emprunté" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const rendre = async (req, res) => {
  try {
    const { id_livre } = req.body;
    await empruntService.rendre(req.user.id_user, id_livre);
    res.json({ message: "Livre rendu" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getUserEmprunts = async (req, res) => {
  try {
    const id_user = req.user.id_user;
    const emprunts = await empruntRepo.getEmpruntsUtilisateur(id_user);
    res.json(emprunts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEmpruntLivre = async (req, res) => {
  try {
    const { id } = req.params;
    const emprunt = await empruntRepo.getEmpruntActifByLivre(id);
    res.json(emprunt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const emprunterPourUser = async (req, res) => {
  console.log("🟢 emprunterPourUser appelé", req.body);

  try {
    const { id_user, id_livre, dateRetourPrevu } = req.body;

    if (!id_user) {
      return res.status(400).json({ message: "id_user manquant" });
    }

    await empruntService.emprunter(id_user, id_livre, dateRetourPrevu);

    res.status(201).json({ message: "Livre emprunté pour l'utilisateur" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const rendreParEmprunt = async (req, res) => {
  const { id_emprunt } = req.params;

  const updated = await Emprunt.update(
    { dateRetourEffectif: new Date() },
    { where: { id_emprunt, dateRetourEffectif: null } },
  );

  if (updated[0] === 0) {
    return res
      .status(404)
      .json({ message: "Emprunt introuvable ou déjà rendu" });
  }

  res.json({ message: "Livre rendu" });
};

module.exports = {
  emprunter,
  rendre,
  getUserEmprunts,
  getEmpruntLivre,
  emprunterPourUser,
  rendreParEmprunt,
};
