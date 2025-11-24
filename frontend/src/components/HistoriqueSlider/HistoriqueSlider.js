import React from "react";
import styles from "./HistoriqueSlider.module.css";

const HistoriqueSlider = ({ historique }) => {
  if (!historique.length)
    return <p className={styles.empty}>Aucun emprunt rendu pour le moment.</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Mon historique d’emprunts</h2>

      <div className={styles.slider}>
        {historique.map((item) => (
          <div className={styles.card} key={item.id_emprunt}>
            <img
              src={
                item.Livre?.image_url
                  ? `${process.env.REACT_APP_API_URL}${item.Livre.image_url}`
                  : "/placeholder.jpg"
              }
              alt={item.Livre?.titre}
              className={styles.cover}
            />

            <p className={styles.bookTitle}>{item.Livre?.titre}</p>

            <p className={styles.dates}>
              Emprunté : {new Date(item.date_emprunt).toLocaleDateString()}
              <br />
              Rendu : {new Date(item.date_retour_effectif).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoriqueSlider;
