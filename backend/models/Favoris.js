const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Favoris = sequelize.define("Favoris", {
  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  id_livre: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = Favoris;
