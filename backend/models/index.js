const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");
const Role = require("./Role");
const User = require("./User");
const Livre = require("./Livre");
const Auteur = require("./Auteur");
const Theme = require("./Theme");
const Emprunt = require("./Emprunt");
const Favoris = require("./Favoris");
const Livre_Auteur = require("./Livre_Auteur");
const Livre_Theme = require("./Livre_Theme");

// Relations User - Role
User.belongsTo(Role, { foreignKey: "id_role" });
Role.hasMany(User, { foreignKey: "id_role" });

// Relations Livre - Auteur (Many-to-Many)
Livre.belongsToMany(Auteur, {
  through: Livre_Auteur,
  foreignKey: "id_livre",
  otherKey: "id_auteur",
});
Auteur.belongsToMany(Livre, {
  through: Livre_Auteur,
  foreignKey: "id_auteur",
  otherKey: "id_livre",
});

// Relations Livre - Theme (Many-to-Many)
Livre.belongsToMany(Theme, {
  through: Livre_Theme,
  foreignKey: "id_livre",
  otherKey: "id_theme",
});
Theme.belongsToMany(Livre, {
  through: Livre_Theme,
  foreignKey: "id_theme",
  otherKey: "id_livre",
});

// Relations User - Livre via Favoris (Many-to-Many)
User.belongsToMany(Livre, {
  through: Favoris,
  foreignKey: "id_user",
  otherKey: "id_livre",
});
Livre.belongsToMany(User, {
  through: Favoris,
  foreignKey: "id_livre",
  otherKey: "id_user",
});

// Relations User - Emprunt (One-to-Many)
User.hasMany(Emprunt, { foreignKey: "id_user" });
Emprunt.belongsTo(User, { foreignKey: "id_user" });

// Relations Livre - Emprunt (One-to-Many)
Livre.hasMany(Emprunt, { foreignKey: "id_livre" });
Emprunt.belongsTo(Livre, { foreignKey: "id_livre" });

// Relations Favoris
Favoris.belongsTo(User, { foreignKey: "id_user" });
Favoris.belongsTo(Livre, { foreignKey: "id_livre" });
User.hasMany(Favoris, { foreignKey: "id_user" });
Livre.hasMany(Favoris, { foreignKey: "id_livre" });

module.exports = {
  sequelize,
  Role,
  User,
  Livre,
  Auteur,
  Theme,
  Emprunt,
  Favoris,
};
