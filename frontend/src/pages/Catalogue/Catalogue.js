import React, { useEffect, useState, useContext } from "react";
import Card from "../../components/Card/Card";
import classes from "./Catalogue.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import Slider from "react-slick";
import { NextArrow, PrevArrow } from "../../components/CustomArrow/CustomArrow";
import SearchBar from "../../components/SearchBar/SearchBar";

const Catalogue = () => {
  const [allLivres, setAllLivres] = useState([]);
  const [livres, setLivres] = useState([]);
  const [favorisList, setFavorisList] = useState([]);
  const { user, token } = useContext(AuthContext);

  const userRole = user?.id_role;

  // control how many slides to show based on current window width (mobile: 2)
  const [slidesToShowState, setSlidesToShowState] = useState(() => {
    if (typeof window === "undefined") return 4;
    const w = window.innerWidth;
    if (w <= 600) return 2;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
  });

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w <= 600) setSlidesToShowState(2);
      else if (w <= 768) setSlidesToShowState(2);
      else if (w <= 1024) setSlidesToShowState(3);
      else setSlidesToShowState(4);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Récupération des livres
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/livres`)
      .then((res) => res.json())
      .then((data) => {
        setAllLivres(data);
        setLivres(data);
      })
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
        : prev.filter((f) => f.id_livre !== id_livre),
    );
  };

  // Filtrage selon la recherche
  const handleSearch = ({ search, author, theme, date }) => {
    let filtered = allLivres;

    if (search) {
      filtered = filtered.filter((l) =>
        l.titre.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (author) {
      filtered = filtered.filter((l) =>
        l.Auteurs?.some((a) =>
          a.nom.toLowerCase().includes(author.toLowerCase()),
        ),
      );
    }

    if (theme) {
      filtered = filtered.filter((l) => l.Themes?.some((t) => t.nom === theme));
    }

    if (date) {
      filtered = filtered.filter((l) => l.date_parution?.slice(0, 10) === date);
    }

    setLivres(filtered);
  };

  // Grouper les livres par thème pour l'affichage
  const livresParTheme = livres.reduce((acc, livre) => {
    if (livre.Themes && livre.Themes.length > 0) {
      livre.Themes.forEach((t) => {
        if (!acc[t.nom]) acc[t.nom] = [];
        acc[t.nom].push(livre);
      });
    } else {
      if (!acc["Sans thème"]) acc["Sans thème"] = [];
      acc["Sans thème"].push(livre);
    }
    return acc;
  }, {});

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShowState,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    variableWidth: false,
    centerMode: false,
  };

  return (
    <div className={classes.catalogueContainer}>
      <h1 className={classes.catalogueTitle}>Catalogue</h1>

      <SearchBar onSearch={handleSearch} />

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
