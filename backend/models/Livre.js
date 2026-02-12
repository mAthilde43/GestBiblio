const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Livre = sequelize.define(
  "Livre",
  {
    id_livre: {
      type: DataTypes.INTEGER,
      // field: "idLivre",
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_parution: {
      type: DataTypes.DATE,
      // field: "dateParution",
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
      // field: "imageUrl",
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "Livres",
    underscored: false,
  },
);

module.exports = Livre;
