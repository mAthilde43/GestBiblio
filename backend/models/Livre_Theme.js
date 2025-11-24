const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Livre_Theme = sequelize.define(
  "Livre_Theme",
  {
    id_livre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    id_theme: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Livre_Theme;
