const { User, Role, Emprunt, Livre } = require("../models");

const findByEmail = (email) =>
  User.findOne({ where: { email }, include: Role });

const createUser = (data) => User.create(data);

const findById = (id_user) => User.findByPk(id_user, { include: Role });

const findAllUsers = async () => {
  return User.findAll({
    include: [
      { model: Role },
      {
        model: Emprunt,
        include: [{ model: Livre }],
      },
    ],
  });
};

// RGPD: Récupérer toutes les données d'un utilisateur pour export
const findUserWithAllData = async (id_user) => {
  const { Favoris } = require("../models");
  return User.findByPk(id_user, {
    include: [
      { model: Role },
      {
        model: Emprunt,
        include: [{ model: Livre, attributes: ["id_livre", "titre"] }],
      },
      {
        model: Favoris,
        include: [{ model: Livre, attributes: ["id_livre", "titre"] }],
      },
    ],
  });
};

// RGPD: Supprimer un utilisateur et toutes ses donnees associees
const deleteUserById = async (id_user) => {
  const { Favoris } = require("../models");

  // Supprimer les favoris de l'utilisateur
  await Favoris.destroy({ where: { id_user } });

  // Supprimer les emprunts de l'utilisateur
  await Emprunt.destroy({ where: { id_user } });

  // Supprimer l'utilisateur
  return User.destroy({ where: { id_user } });
};

module.exports = {
  findByEmail,
  createUser,
  findById,
  findAllUsers,
  findUserWithAllData,
  deleteUserById,
};
