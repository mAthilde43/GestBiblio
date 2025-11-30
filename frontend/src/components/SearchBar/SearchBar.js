import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./SearchBar.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const { user } = useContext(AuthContext);
  const [themes, setThemes] = useState([]);

  // Nouveaux états pour chaque champ
  const [search, setSearch] = useState("");
  const [author, setAuthor] = useState("");
  const [theme, setTheme] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/themes`);
        if (!response.ok) throw new Error("Erreur lors du fetch des thèmes");
        const data = await response.json();
        setThemes(data);
      } catch (err) {
        console.error("Erreur lors du chargement des thèmes :", err);
      }
    };
    fetchThemes();
  }, []);

  const handleReset = () => {
    setSearch("");
    setAuthor("");
    setTheme("");
    setDate("");
  };

  return (
    <div className={classes.searchContainer}>
      {user && user.id_role === 2 && (
        <Link to="/add-book" className={classes.addButton}>
          + Ajouter un livre
        </Link>
      )}

      <input
        type="text"
        placeholder="Rechercher un livre..."
        className={classes.input}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <input
        type="text"
        placeholder="Auteur"
        className={classes.input}
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />

      <select
        className={classes.select}
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="">Thème</option>
        {themes.map((theme) => (
          <option key={theme.id_theme} value={theme.nom}>
            {theme.nom}
          </option>
        ))}
      </select>

      <input
        type="date"
        className={classes.input}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Bouton reset à droite */}
      <button className={classes.resetButton} onClick={handleReset}>
        <FontAwesomeIcon icon={faRotateRight} />
      </button>
    </div>
  );
};

export default SearchBar;
