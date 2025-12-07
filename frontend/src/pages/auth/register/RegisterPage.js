import React, { useState } from "react";
import classes from "./RegisterPage.module.css";
import { Link } from "react-router-dom";
import AnimatedPage from "../../AnimatePage.js/AnimatePage";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id_role: 1 }), //role par défaut : utilisateur
        }
      );
      const data = await response.json();

      if (!response.ok) {
        // Vérifie si le serveur renvoie un message indiquant que l'email est déjà utilisé
        if (data.message && data.message.toLowerCase().includes("email")) {
          setEmailError("Cet email est déjà utilisé.");
        } else {
          alert("Erreur lors de l'inscription.");
        }
      } else {
        alert("Inscription réussie !");
        // Ici tu peux rediriger l'utilisateur si nécessaire
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription.");
    }
  };

  return (
    <AnimatedPage direction="left">
      <div className={classes.container}>
        <div className={classes.left}>
          <h1>Bienvenue !</h1>
          <h2>
            Inscrivez-vous avec vos informations personnelles pour utiliser
            toutes les fonctionnalités du site.
          </h2>
          <p>Vous avez déjà compte ?</p>
          <Link to="/auth/login" className={classes.loginBtn}>
            Connectez-vous
          </Link>
        </div>
        <div className={classes.right}>
          <h2>S’inscrire</h2>
          <form onSubmit={handleSubmit}>
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />

            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />

            <label>Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <p className={classes.error}>{emailError}</p>}

            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className={classes.registerBtn}>
              S’inscrire
            </button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default RegisterPage;
