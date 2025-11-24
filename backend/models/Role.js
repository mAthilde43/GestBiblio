const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Role = sequelize.define("Role", {
  id_role: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Role;
