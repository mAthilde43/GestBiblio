import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./SearchBar.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ onSearch }) => {
  const { user } = useContext(AuthContext);
  const [themes, setThemes] = useState([]);
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
    onSearch({ search: "", author: "", theme: "", date: "" });
  };

  const handleChange = (field, value) => {
    if (field === "search") setSearch(value);
    if (field === "author") setAuthor(value);
    if (field === "theme") setTheme(value);
    if (field === "date") setDate(value);

    onSearch({
      search: field === "search" ? value : search,
      author: field === "author" ? value : author,
      theme: field === "theme" ? value : theme,
      date: field === "date" ? value : date,
    });
  };

  return (
    <div className={classes.searchContainer}>
      {user?.id_role === 2 && (
        <Link to="/add-book" className={classes.addButton}>
          + Ajouter un livre
        </Link>
      )}

      <input
        type="text"
        placeholder="Rechercher un livre..."
        className={classes.input}
        value={search}
        onChange={(e) => handleChange("search", e.target.value)}
      />

      <input
        type="text"
        placeholder="Auteur"
        className={classes.input}
        value={author}
        onChange={(e) => handleChange("author", e.target.value)}
      />

      <select
        className={classes.select}
        value={theme}
        onChange={(e) => handleChange("theme", e.target.value)}
      >
        <option value="">Thème</option>
        {themes.map((t) => (
          <option key={t.id_theme} value={t.nom}>
            {t.nom}
          </option>
        ))}
      </select>

      <button className={classes.resetButton} onClick={handleReset}>
        <FontAwesomeIcon icon={faRotateRight} />
      </button>
    </div>
  );
};

export default SearchBar;
