const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Livre = sequelize.define("Livre", {
  id_livre: {
    type: DataTypes.INTEGER,
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
  },
  description: {
    type: DataTypes.TEXT,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Livre;
