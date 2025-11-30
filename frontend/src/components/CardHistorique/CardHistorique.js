import React from "react";
import classes from "./CardHistorique.module.css";

const CardHistorique = ({ emprunt }) => {
  const livre = emprunt.Livre;
  const dateEmprunt = new Date(emprunt.date_emprunt);
  const dateRetour = new Date(emprunt.date_retour_effectif);

  const auteur =
    livre?.Auteurs && livre.Auteurs.length > 0
      ? livre.Auteurs.map((a) => a.nom).join(", ")
      : "Auteur inconnu";

  return (
    <div className={classes.card}>
      <div className={classes.imageWrapper}>
        <img
          src={
            livre?.image_url
              ? `${process.env.REACT_APP_API_URL}${livre.image_url}`
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
