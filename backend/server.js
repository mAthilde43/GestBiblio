const express = require("express");
const app = express();
const sequelize = require("./config/db");
const models = require("./models");
const authRoutes = require("./routes/authRoutes");
const livreRoutes = require("./routes/livreRoutes");
const empruntRoutes = require("./routes/empruntRoutes");
const favorisRoutes = require("./routes/favorisRoutes");
const userRoutes = require("./routes/userRoutes");
const themeRoutes = require("./routes/themeRoutes");
const auteurRoutes = require("./routes/auteurRoutes");

const path = require("path");

const cors = require("cors");

app.use((req, res, next) => {
  console.log("🔹 Requête reçue :", req.method, req.url);
  next();
});

app.use(cors());

app.use(express.json());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/livres", livreRoutes);
app.use("/api/emprunts", empruntRoutes);
app.use("/api/favoris", favorisRoutes);
app.use("/api/users", userRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/auteurs", auteurRoutes);

app.get("/", (req, res) => {
  res.send("Backend en marche !");
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie !");

    await sequelize.sync({ force: false });

    app.listen(3000, () => {
      console.log("Serveur démarré");
    });
  } catch (error) {
    console.error("Impossible de se connecter à la base de données :", error);
  }
};

startServer();
