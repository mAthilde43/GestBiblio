const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Livre_Auteur = sequelize.define(
  "Livre_Auteur",
  {
    id_livre: {
      type: DataTypes.INTEGER,
      // field: "idLivre",
      primaryKey: true,
      allowNull: false,
    },
    id_auteur: {
      type: DataTypes.INTEGER,
      // field: "idAuteur",
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "Livre_Auteurs",
    underscored: false,
  },
);

module.exports = Livre_Auteur;
