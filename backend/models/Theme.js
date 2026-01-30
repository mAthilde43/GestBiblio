const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Theme = sequelize.define(
  "Theme",
  {
    id_theme: {
      type: DataTypes.INTEGER,
      field: "idTheme",
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
    tableName: "Themes",
    underscored: false,
  },
);

module.exports = Theme;
