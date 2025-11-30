import React from "react";
import classes from "./CardEmprunt.module.css";

const CardEmprunt = ({ livre, emprunt, onRendre }) => {
  console.log("Livre reçu dans CARDEMPRUNT:", livre);

  const dateEmprunt = new Date(emprunt.date_emprunt);
  const dateRetourPrevu = new Date(emprunt.date_retour_prevu);

  const auteur =
    livre.Auteurs && livre.Auteurs.length > 0
      ? livre.Auteurs.map((a) => `${a.nom}`).join(", ")
      : "Auteur inconnu";

  return (
    <div className={classes.card}>
      <div className={classes.imageWrapper}>
        <img
          src={
            livre.image_url
              ? `${process.env.REACT_APP_API_URL}${livre.image_url}`
              : "/placeholder.jpg"
          }
          alt={livre.titre}
        />
      </div>

      <div className={classes.info}>
        <h3>{livre.titre}</h3>
        <p className={classes.auteur}>{auteur}</p>

        <div className={classes.dates}>
          <p>📅 Emprunté le : {dateEmprunt.toLocaleDateString()}</p>
          <p>📕 Retour prévu : {dateRetourPrevu.toLocaleDateString()}</p>
        </div>

        <button
          className={classes.rendreBtn}
          onClick={() => onRendre(livre.id_livre)}
        >
          Rendre le livre
        </button>
      </div>
    </div>
  );
};

export default CardEmprunt;
