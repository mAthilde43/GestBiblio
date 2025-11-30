import React, { useState, useContext } from "react";
import classes from "./LoginPage.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import AnimatedPage from "../../AnimatePage.js/AnimatePage";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext); // <-- récupère login du contexte

  const redirectUrl =
    new URLSearchParams(location.search).get("redirect") || "/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      console.log("Login response:", data);

      // 🔹 met à jour le contexte avec login()
      login(data.user, data.token);

      alert("Connexion réussie !");
      navigate(redirectUrl); // redirection vers home
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la connexion.");
    }
  };

  return (
    <AnimatedPage direction="right">
      <div className={classes.container}>
        <div className={classes.left}>
          <h2>Se connecter</h2>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button type="submit" className={classes.loginBtn}>
              Se connecter
            </button>
          </form>
        </div>

        <div className={classes.right}>
          <h1>Bon retour parmi nous !</h1>
          <h2>Connectez-vous pour accéder à toutes les fonctionnalités.</h2>
          <p>Vous n’avez pas de compte ?</p>
          <Link to="/auth/register" className={classes.registerBtn}>
            Inscrivez-vous
          </Link>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default LoginPage;
