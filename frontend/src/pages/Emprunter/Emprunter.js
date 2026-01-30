import React, { useEffect, useState, useContext, useCallback } from "react";
import Slider from "react-slick";
import { AuthContext } from "../../contexts/AuthContext";
import { NextArrow, PrevArrow } from "../../components/CustomArrow/CustomArrow";
import styles from "./Emprunter.module.css";
import { useNavigate } from "react-router-dom";
import CardEmprunt from "../../components/CardEmprunt/CardEmprunt";
import CardHistorique from "../../components/CardHistorique/CardHistorique";

const Emprunter = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [empruntsEnCours, setEmpruntsEnCours] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------
  // FETCH DES EMPRUNTS
  // -------------------------------------------------------------
  const fetchEmprunts = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    fetchEmprunts();
  }, [fetchEmprunts]);

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
        },
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
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
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
            return (
              <CardEmprunt
                key={livre.id_livre}
                livre={livre}
                emprunt={e}
                onRendre={handleRendre}
              />
            );
          })}
        </Slider>
      )}

      {/* ---------------------------------------------------------- */}
      {/* 🟣 PARTIE 2 — HISTORIQUE D'EMPRUNTS */}
      {/* ---------------------------------------------------------- */}
      <h2 style={{ marginTop: "60px" }}>Mon historique d'emprunts</h2>

      {historique.length === 0 ? (
        <p>Aucun historique pour le moment.</p>
      ) : (
        <Slider {...sliderSettings} className={styles.slider}>
          {historique.map((e) => {
            const livre = e.Livre || e.livre || {};
            return (
              <CardHistorique key={e.id_emprunt} livre={livre} emprunt={e} />
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default Emprunter;
