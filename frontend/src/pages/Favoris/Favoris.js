import React, { useEffect, useState, useContext } from "react";
import Card from "../../components/Card/Card";
import classes from "./Favoris.module.css";
import { AuthContext } from "../../contexts/AuthContext";

const Favoris = () => {
  const { user, token } = useContext(AuthContext);
  const [favoris, setFavoris] = useState([]);

  const userRole = user?.id_role;

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.REACT_APP_API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFavoris(data))
      .catch((err) => console.error(err));
  }, [token]);

  const handleFavoriChange = (id_livre, isFavori) => {
    setFavoris((prev) =>
      isFavori
        ? [...prev, { Livre: { id_livre } }] // ajouter minimalement
        : prev.filter((f) => f.Livre.id_livre !== id_livre)
    );
  };

  return (
    <div className={classes.favorisContainer}>
      <h1 className={classes.favorisTitle}>Mes favoris</h1>
      <div className={classes.cardsGrid}>
        {favoris.map((f) => (
          <Card
            key={f.Livre.id_livre}
            livre={f.Livre}
            userRole={userRole}
            favorisList={favoris.map((f) => f.Livre)}
            onFavoriChange={handleFavoriChange}
          />
        ))}
      </div>
    </div>
  );
};

export default Favoris;
