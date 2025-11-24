import React, { useEffect, useState, useContext } from "react";
import Card from "../../components/Card/Card";
import classes from "./Catalogue.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import Slider from "react-slick"; // importer react-slick
import { NextArrow, PrevArrow } from "../../components/CustomArrow/CustomArrow";

const Catalogue = () => {
  const [livres, setLivres] = useState([]);
  const [favorisList, setFavorisList] = useState([]);
  const { user, token } = useContext(AuthContext);

  const userRole = user?.id_role;

  // Récupération des livres
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/livres`)
      .then((res) => res.json())
      .then((data) => setLivres(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  // Récupération des favoris de l'utilisateur
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorisList(data.map((f) => f.Livre)))
      .catch((err) => console.error("Erreur favoris :", err));
  }, [token]);

  const handleDeleteLivre = (id) => {
    setLivres(livres.filter((livre) => livre.id_livre !== id));
  };

  const handleFavoriChange = (id_livre, isFavori) => {
    setFavorisList((prev) =>
      isFavori
        ? [...prev, livres.find((l) => l.id_livre === id_livre)]
        : prev.filter((f) => f.id_livre !== id_livre)
    );
  };

  // Grouper les livres par thème
  const livresParTheme = livres.reduce((acc, livre) => {
    if (livre.Themes && livre.Themes.length > 0) {
      livre.Themes.forEach((theme) => {
        if (!acc[theme.nom]) acc[theme.nom] = [];
        acc[theme.nom].push(livre);
      });
    } else {
      if (!acc["Sans thème"]) acc["Sans thème"] = [];
      acc["Sans thème"].push(livre);
    }
    return acc;
  }, {});

  // Settings pour le slider
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4, // nombre de livres visibles
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />, // Utiliser PrevArrow si défini
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className={classes.catalogueContainer}>
      <h1 className={classes.catalogueTitle}>Catalogue</h1>

      {Object.keys(livresParTheme)
        .sort((a, b) => a.localeCompare(b))
        .map((theme) => (
          <div key={theme} className={classes.themeSection}>
            <h2 className={classes.themeTitle}>{theme}</h2>
            <Slider {...sliderSettings} className={classes.slider}>
              {livresParTheme[theme].map((livre) => (
                <Card
                  key={livre.id_livre}
                  livre={livre}
                  onDelete={handleDeleteLivre}
                  userRole={userRole}
                  favorisList={favorisList}
                  onFavoriChange={handleFavoriChange}
                />
              ))}
            </Slider>
          </div>
        ))}
    </div>
  );
};

export default Catalogue;
