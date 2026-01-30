// db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT,
    define: {
      timestamps: false, // Désactive createdAt et updatedAt par défaut
      underscored: false, // Empêche la conversion automatique snake_case
      freezeTableName: true, // Empêche Sequelize de pluraliser les noms de tables
    },
    logging: false, // Optionnel : désactive les logs SQL (ou mets console.log pour debug)
  },
);

module.exports = sequelize;
