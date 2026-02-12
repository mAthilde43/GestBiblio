const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Auteur = sequelize.define(
  "Auteur",
  {
    id_auteur: {
      type: DataTypes.INTEGER,
      // field: "idAuteur",
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "Auteurs",
    underscored: false,
  },
);

module.exports = Auteur;
