import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./SearchBar.module.css";
import { AuthContext } from "../../contexts/AuthContext";

const SearchBar = () => {
  const { user } = useContext(AuthContext);
  const [themes, setThemes] = useState([]); // Stocke les thèmes

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/themes`); // Appel à ton backend
        if (!response.ok) throw new Error("Erreur lors du fetch des thèmes");
        const data = await response.json();
        setThemes(data); // Stocke les thèmes dans l'état
      } catch (err) {
        console.error("Erreur lors du chargement des thèmes :", err);
      }
    };

    fetchThemes();
  }, []);

  return (
    <div className={classes.searchContainer}>
      {/* Bouton Ajouter un livre visible seulement pour id_role = 2 */}
      {user && user.id_role === 2 && (
        <Link to="/add-book" className={classes.addButton}>
          + Ajouter un livre
        </Link>
      )}

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher un livre..."
        className={classes.input}
      />

      {/* Auteur */}
      <input type="text" placeholder="Auteur" className={classes.input} />

      {/* Thème dynamique */}
      <select className={classes.select}>
        <option value="">Thème</option>
        {themes.map((theme) => (
          <option key={theme.id_theme} value={theme.nom}>
            {theme.nom}
          </option>
        ))}
      </select>

      {/* Disponibilité */}
      <input type="date" className={classes.input} />
    </div>
  );
};

export default SearchBar;
