const { Emprunt, Livre, User, Auteur } = require("../models");

const emprunterLivre = (data) => Emprunt.create(data);

const rendreLivre = (id_user, id_livre) =>
  Emprunt.update(
    { date_retour_effectif: new Date() },
    { where: { id_user, id_livre } }
  );

const getEmpruntsUtilisateur = (id_user) =>
  Emprunt.findAll({
    where: { id_user },
    include: [
      {
        model: Livre,
        include: [
          {
            model: Auteur,
            through: { attributes: [] }, // ignore les champs de la table de jointure
          },
        ],
      },
    ],
  });

const getEmpruntsEnRetard = () =>
  Emprunt.findAll({
    where: { date_retour_effectif: null },
    include: [{ model: Livre }, { model: User }],
  });

const getEmpruntActifByLivre = (id_livre) =>
  Emprunt.findOne({
    where: {
      id_livre,
      date_retour_effectif: null,
    },
  });

module.exports = {
  emprunterLivre,
  rendreLivre,
  getEmpruntsUtilisateur,
  getEmpruntsEnRetard,
  getEmpruntActifByLivre, // <-- AJOUT
};
