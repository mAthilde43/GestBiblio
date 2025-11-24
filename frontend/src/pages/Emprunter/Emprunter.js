import React, { useEffect, useState, useContext } from "react";
import Slider from "react-slick";
import { AuthContext } from "../../contexts/AuthContext";
import { NextArrow, PrevArrow } from "../../components/CustomArrow/CustomArrow";
import styles from "./Emprunter.module.css";
import { useNavigate } from "react-router-dom";

const Emprunter = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [empruntsEnCours, setEmpruntsEnCours] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------
  // FETCH DES EMPRUNTS
  // -------------------------------------------------------------
  const fetchEmprunts = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_API_URL}/emprunts/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // tri : en cours vs historique
      const enCours = data.filter((e) => !e.date_retour_effectif);
      const hist = data.filter((e) => e.date_retour_effectif);

      setEmpruntsEnCours(enCours);
      setHistorique(hist);
    } catch (err) {
      console.error("Erreur fetch emprunts:", err);
      alert("Impossible de récupérer vos emprunts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmprunts();
  }, [token]);

  // -------------------------------------------------------------
  // RENDRE UN LIVRE
  // -------------------------------------------------------------
  const handleRendre = async (id_livre) => {
    if (!token) return alert("Vous devez être connecté.");

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/emprunts/rendre`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_livre }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Erreur serveur");
      }

      await fetchEmprunts(); // met à jour enCours + historique
    } catch (err) {
      console.error(err);
      alert("Impossible de rendre le livre.");
    }
  };

  // -------------------------------------------------------------
  // SLIDER SETTINGS
  // -------------------------------------------------------------
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  // -------------------------------------------------------------
  // PAS CONNECTÉ
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className={styles.page}>
        <h2>Mes emprunts</h2>
        <p>Vous devez être connecté pour voir vos emprunts.</p>
        <button onClick={() => navigate("/auth/login")}>Se connecter</button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LOADING
  // -------------------------------------------------------------
  if (loading) return <p>Chargement...</p>;

  return (
    <div className={styles.page}>
      {/* ---------------------------------------------------------- */}
      {/* 🔵 PARTIE 1 — EMPRUNTS EN COURS */}
      {/* ---------------------------------------------------------- */}
      <h2>Mes emprunts en cours</h2>

      {empruntsEnCours.length === 0 ? (
        <p>Aucun emprunt en cours.</p>
      ) : (
        <Slider {...sliderSettings} className={styles.slider}>
          {empruntsEnCours.map((e) => {
            const livre = e.Livre || e.livre || {};
            const dateEmprunt = new Date(e.date_emprunt);
            const dateRetourPrevu = new Date(e.date_retour_prevu);

            return (
              <div key={livre.id_livre} className={styles.card}>
                <img
                  src={
                    livre.image_url
                      ? `${process.env.REACT_APP_API_URL}${livre.image_url}`
                      : "/placeholder.jpg"
                  }
                  alt={livre.titre}
                  className={styles.img}
                />

                <h3>{livre.titre}</h3>
                <p>
                  {livre.Auteurs?.map((a) => `${a.prenom} ${a.nom}`).join(", ")}
                </p>

                <div className={styles.dates}>
                  <p>📅 Emprunté le : {dateEmprunt.toLocaleDateString()}</p>
                  <p>
                    📕 Retour prévu : {dateRetourPrevu.toLocaleDateString()}
                  </p>

                  <button
                    className={styles.rendreBtn}
                    onClick={() => {
                      if (window.confirm("Confirmer le rendu ?"))
                        handleRendre(livre.id_livre);
                    }}
                  >
                    Rendre le livre
                  </button>
                </div>
              </div>
            );
          })}
        </Slider>
      )}

      {/* ---------------------------------------------------------- */}
      {/* 🟣 PARTIE 2 — HISTORIQUE D’EMPRUNTS */}
      {/* ---------------------------------------------------------- */}
      <h2 style={{ marginTop: "60px" }}>Mon historique d’emprunts</h2>

      {historique.length === 0 ? (
        <p>Aucun historique pour le moment.</p>
      ) : (
        <Slider {...sliderSettings} className={styles.slider}>
          {historique.map((e) => {
            const livre = e.Livre || e.livre || {};
            const dateEmprunt = new Date(e.date_emprunt);
            const dateRetour = new Date(e.date_retour_effectif);

            return (
              <div key={livre.id_livre + "-hist"} className={styles.card}>
                <img
                  src={
                    livre.image_url
                      ? `${process.env.REACT_APP_API_URL}${livre.image_url}`
                      : "/placeholder.jpg"
                  }
                  alt={livre.titre}
                  className={styles.img}
                />

                <h3>{livre.titre}</h3>
                <p>
                  {livre.Auteurs?.map((a) => `${a.prenom} ${a.nom}`).join(", ")}
                </p>

                <div className={styles.dates}>
                  <p>📅 Emprunté le : {dateEmprunt.toLocaleDateString()}</p>
                  <p>✔️ Rendu le : {dateRetour.toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default Emprunter;
