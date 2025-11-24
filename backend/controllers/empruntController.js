const empruntService = require("../services/empruntService");
const empruntRepo = require("../repositories/empruntRepository");

const emprunter = async (req, res) => {
  try {
    const { id_livre, date_retour_prevu } = req.body;
    await empruntService.emprunter(
      req.user.id_user,
      id_livre,
      date_retour_prevu
    );
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

module.exports = { emprunter, rendre, getUserEmprunts, getEmpruntLivre };
