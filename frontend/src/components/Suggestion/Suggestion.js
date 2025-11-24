import React, { useEffect, useState, useContext } from "react";
import Card from "../../components/Card/Card";
import classes from "./Suggestion.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../../components/CustomArrow/CustomArrow";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Suggestion = () => {
  const [livres, setLivres] = useState([]);
  const [favorisList, setFavorisList] = useState([]);
  const { user, token } = useContext(AuthContext);

  const userRole = user?.id_role;

  // Récupération de tous les livres
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/livres`)
      .then((res) => res.json())
      .then((data) => setLivres(data))
      .catch((err) => console.error("Erreur :", err));
  }, []);

  // Récupération des favoris
  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavorisList(data.map((f) => f.Livre)))
      .catch((err) => console.error("Erreur favoris :", err));
  }, [token]);

  const handleFavoriChange = (id_livre, isFavori) => {
    setFavorisList((prev) =>
      isFavori
        ? [...prev, livres.find((l) => l.id_livre === id_livre)]
        : prev.filter((f) => f.id_livre !== id_livre)
    );
  };

  // Fonction pour choisir des livres aléatoires
  const getRandomLivres = (count = 8) => {
    const shuffled = [...livres].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, livres.length));
  };

  // Paramètres du slider
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

  return (
    <div className={classes.suggestionContainer}>
      <h2 className={classes.suggestionTitle}>Suggestions pour vous</h2>
      <Slider {...sliderSettings}>
        {getRandomLivres().map((livre) => (
          <Card
            key={livre.id_livre}
            livre={livre}
            userRole={userRole}
            favorisList={favorisList}
            onFavoriChange={handleFavoriChange}
          />
        ))}
      </Slider>
    </div>
  );
};

export default Suggestion;
