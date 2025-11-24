import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import classes from "./Card.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faHeart as farHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as fasHeart } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../contexts/AuthContext";

const Card = ({ livre, onDelete, userRole, favorisList, onFavoriChange }) => {
  const { token } = useContext(AuthContext);
  const auteur =
    livre.Auteurs && livre.Auteurs.length > 0
      ? `${livre.Auteurs[0].nom}`
      : "Auteur inconnu";

  const [isFavori, setIsFavori] = useState(false);

  useEffect(() => {
    setIsFavori(favorisList?.some((f) => f.id_livre === livre.id_livre));
  }, [favorisList, livre.id_livre]);

  const handleDelete = async () => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${livre.titre}" ?`)) {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/livres/${livre.id_livre}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erreur suppression");
        onDelete(livre.id_livre);
      } catch (err) {
        console.error(err);
        alert("Impossible de supprimer le livre.");
      }
    }
  };

  const toggleFavori = async () => {
    if (!token)
      return alert("Vous devez être connecté pour ajouter un favori.");

    try {
      if (isFavori) {
        await fetch(
          `${process.env.REACT_APP_API_URL}/favoris/${livre.id_livre}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFavori(false);
        onFavoriChange?.(livre.id_livre, false);
      } else {
        await fetch(`${process.env.REACT_APP_API_URL}/favoris`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_livre: livre.id_livre }),
        });
        setIsFavori(true);
        onFavoriChange?.(livre.id_livre, true);
      }
    } catch (err) {
      console.error(err);
      alert("Impossible de mettre à jour les favoris.");
    }
  };

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

        <div className={classes.actions}>
          {userRole === 2 && (
            <button className={classes.iconBtn} onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}

          <button className={classes.iconBtn} onClick={toggleFavori}>
            <FontAwesomeIcon icon={isFavori ? fasHeart : farHeart} />
          </button>

          <Link to={`/livre/${livre.id_livre}`} className={classes.arrowBtn}>
            ➜
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
