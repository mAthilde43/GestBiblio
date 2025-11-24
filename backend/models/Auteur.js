const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Auteur = sequelize.define("Auteur", {
  id_auteur: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // prenom: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
});

module.exports = Auteur;
