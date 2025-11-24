const livreRepo = require("../repositories/livreRepository");

const getAllLivres = () => livreRepo.getAllLivres();
const getLivreById = (id) => livreRepo.getLivreById(id);
const createLivre = (data) => livreRepo.createLivre(data);
const updateLivre = (id, data) => livreRepo.updateLivre(id, data);
const deleteLivre = (id) => livreRepo.deleteLivre(id);

module.exports = {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
};
