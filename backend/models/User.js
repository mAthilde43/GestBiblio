const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Role = require("./Role");

const User = sequelize.define("User", {
  id_user: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  card_number: {
    type: DataTypes.STRING,
    // unique: true,
    allowNull: false,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_role: {
    type: DataTypes.INTEGER,
    references: {
      model: Role,
      key: "id_role",
    },
  },
});

module.exports = User;
