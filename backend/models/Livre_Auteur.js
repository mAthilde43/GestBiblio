const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Livre_Auteur = sequelize.define(
  "Livre_Auteur",
  {
    id_livre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    id_auteur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false, // Pas de createdAt / updatedAt
  }
);

module.exports = Livre_Auteur;
