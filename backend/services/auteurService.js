const auteurRepository = require("../repositories/auteurRepository");

const getAllAuteurs = async () => {
  return await auteurRepository.getAllAuteurs();
};

const findOrCreateAuteur = async (nom, prenom = "Inconnu") => {
  let auteur = await auteurRepository.getAuteurByNom(nom);
  if (!auteur) {
    auteur = await auteurRepository.createAuteur({ nom, prenom });
  }
  return auteur;
};

module.exports = {
  getAllAuteurs,
  findOrCreateAuteur,
};
