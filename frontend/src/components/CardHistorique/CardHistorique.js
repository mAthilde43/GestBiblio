import React from "react";
import classes from "./CardHistorique.module.css";

const CardHistorique = ({ emprunt }) => {
  const livre = emprunt.Livre;
  const dateEmprunt = new Date(emprunt.dateEmprunt);
  const dateRetour = new Date(emprunt.dateRetourEffectif);

  const auteur =
    livre?.Auteurs && livre.Auteurs.length > 0
      ? livre.Auteurs.map((a) => a.nom).join(", ")
      : "Auteur inconnu";

  return (
    <div className={classes.card}>
      <div className={classes.imageWrapper}>
        <img
          src={
            livre?.imageUrl
              ? `${process.env.REACT_APP_API_URL}${livre.imageUrl}`
              : "/placeholder.jpg"
          }
          alt={livre?.titre}
        />
      </div>

      <div className={classes.info}>
        <h3>{livre?.titre}</h3>
        <p className={classes.auteur}>{auteur}</p>

        <div className={classes.dates}>
          <p>📅 Emprunté : {dateEmprunt.toLocaleDateString()}</p>
          <p>✔️ Rendu : {dateRetour.toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CardHistorique;
