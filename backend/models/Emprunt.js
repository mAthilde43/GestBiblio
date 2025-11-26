const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Emprunt = sequelize.define(
  "Emprunt",
  {
    id_emprunt: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_livre: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date_emprunt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_retour_prevu: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_retour_effectif: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Emprunt;
