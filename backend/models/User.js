const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Role = require("./Role");

const User = sequelize.define(
  "User",
  {
    id_user: {
      type: DataTypes.INTEGER,
      // field: "idUser",
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    card_number: {
      type: DataTypes.STRING,
      // field: "cardNumber",
      allowNull: true,
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
      // field: "idRole",
      references: {
        model: Role,
        key: "id_role",
      },
    },
  },
  {
    timestamps: true,
    tableName: "Users",
    underscored: false,
  },
);

// Hook corrigé - génère le cardNumber après création
User.afterCreate(async (user, options) => {
  try {
    if (!user.card_number) {
      // Utilise l'id_user pour générer le card_number
      user.card_number = user.id_user.toString();
      await user.save({ hooks: false });
    }
  } catch (error) {
    console.error("Erreur dans afterCreate hook:", error);
  }
});

module.exports = User;
