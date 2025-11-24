const empruntRepo = require("../repositories/empruntRepository");
const { Livre, Emprunt } = require("../models");

const emprunter = async (id_user, id_livre, date_retour_prevu) => {
  // Vérifier si le livre est déjà emprunté par quelqu'un
  const empruntActif = await Emprunt.findOne({
    where: {
      id_livre,
      date_retour_effectif: null,
    },
  });

  if (empruntActif) throw new Error("Livre déjà emprunté");

  await empruntRepo.emprunterLivre({
    id_user,
    id_livre,
    date_emprunt: new Date(),
    date_retour_prevu,
  });
};

const rendre = async (id_user, id_livre) => {
  await empruntRepo.rendreLivre(id_user, id_livre);
};

module.exports = { emprunter, rendre };
