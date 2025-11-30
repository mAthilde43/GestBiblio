const { Livre, Auteur, Theme } = require("../models");

const getAllLivres = () =>
  Livre.findAll({ include: [Auteur, Theme], order: [["titre", "ASC"]] });

const getLivreById = (id) => Livre.findByPk(id, { include: [Auteur, Theme] });

const createLivre = (data) => Livre.create(data);

const updateLivre = async (id, data) => {
  const livre = await Livre.findByPk(id, { include: [Auteur, Theme] });
  if (!livre) throw new Error("Livre introuvable");

  await livre.update({
    titre: data.titre,
    date_parution: data.date_parution,
    description: data.description,
    ...(data.image_url && { image_url: data.image_url }),
  });

  return livre; // retourne l'instance Sequelize complète
};

const deleteLivre = (id) => Livre.destroy({ where: { id_livre: id } });

module.exports = {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
};
