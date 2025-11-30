import React from "react";
import styles from "./HistoriqueSlider.module.css";
import CardHistorique from "../CardHistorique/CardHistorique";

const HistoriqueSlider = ({ historique }) => {
  if (!historique.length)
    return <p className={styles.empty}>Aucun emprunt rendu pour le moment.</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Mon historique d’emprunts</h2>

      <div className={styles.slider}>
        {historique.map((item) => (
          <CardHistorique key={item.id_emprunt} emprunt={item} />
        ))}
      </div>
    </div>
  );
};

export default HistoriqueSlider;
