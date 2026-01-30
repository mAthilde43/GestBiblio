const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Favoris = sequelize.define(
  "Favoris",
  {
    id_user: {
      type: DataTypes.INTEGER,
      field: "idUser",
      allowNull: false,
      primaryKey: true,
    },
    id_livre: {
      type: DataTypes.INTEGER,
      field: "idLivre",
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    timestamps: true,
    tableName: "Favoris",
    underscored: false,
  },
);

module.exports = Favoris;
