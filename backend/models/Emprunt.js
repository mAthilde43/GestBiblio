const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Emprunt = sequelize.define(
  "Emprunt",
  {
    id_emprunt: {
      type: DataTypes.INTEGER,
      field: "idEmprunt",
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      field: "idUser",
      allowNull: false,
    },
    id_livre: {
      type: DataTypes.INTEGER,
      field: "idLivre",
      allowNull: false,
    },
    date_emprunt: {
      type: DataTypes.DATE,
      field: "dateEmprunt",
      allowNull: false,
    },
    date_retour_prevu: {
      type: DataTypes.DATE,
      field: "dateRetourPrevu",
      allowNull: false,
    },
    date_retour_effectif: {
      type: DataTypes.DATE,
      field: "dateRetourEffectif",
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "Emprunts",
    underscored: false,
  },
);

module.exports = Emprunt;
