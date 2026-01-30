import React, { useState, useEffect } from "react";
import classes from "./AddBook.module.css";
import { useNavigate, useParams } from "react-router-dom";

const AddBook = ({ editMode }) => {
  const [themes, setThemes] = useState([]);
  // dropdown per author input index
  const [showDropdownIndex, setShowDropdownIndex] = useState(null);
  const [auteursExistants, setAuteursExistants] = useState([]);
  // support multiple authors and themes
  const [formData, setFormData] = useState({
    titre: "",
    date_parution: "",
    description: "",
    image: null,
    currentImageUrl: "", // URL de l'image existante
  });
  const [authors, setAuthors] = useState([""]);
  const [selectedThemes, setSelectedThemes] = useState([""]);

  const { id } = useParams();
  const navigate = useNavigate();

  // Charger thèmes et auteurs
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/themes`);
        const data = await res.json();
        setThemes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des thèmes :", err);
      }
    };

    const fetchAuteurs = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/auteurs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        setAuteursExistants(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors du chargement des auteurs :", err);
        setAuteursExistants([]);
      }
    };

    fetchThemes();
    fetchAuteurs();
  }, []);

  // Charger livre si en édition
  useEffect(() => {
    if (editMode && id) {
      const fetchLivre = async () => {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_API_URL}/livres/${id}`,
          );
          if (!res.ok) throw new Error("Livre introuvable");
          const data = await res.json();
          setFormData({
            titre: data.titre || "",
            // load authors (names)
            // We'll set authors array separately below
            date_parution: data.date_parution?.split("T")[0] || "",
            description: data.description || "",
            image: null,
            currentImageUrl: data.image_url || "", // URL de l'image existante
          });
          // populate authors and themes arrays
          setAuthors(
            data.Auteurs && data.Auteurs.length
              ? data.Auteurs.map((a) => a.nom)
              : [""],
          );
          setSelectedThemes(
            data.Themes && data.Themes.length
              ? data.Themes.map((t) => t.id_theme)
              : [""],
          );
        } catch (err) {
          console.error(err);
          alert("Impossible de charger les informations du livre.");
        }
      };
      fetchLivre();
    }
  }, [editMode, id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleAuthorChange = (index, value) => {
    const newAuthors = [...authors];
    newAuthors[index] = value;
    setAuthors(newAuthors);
  };

  const addAuthor = () => setAuthors([...authors, ""]);
  const removeAuthor = (index) =>
    setAuthors(authors.filter((_, i) => i !== index));

  const handleThemeChange = (index, value) => {
    const newThemes = [...selectedThemes];
    newThemes[index] = value;
    setSelectedThemes(newThemes);
  };

  const addTheme = () => setSelectedThemes([...selectedThemes, ""]);
  const removeTheme = (index) =>
    setSelectedThemes(selectedThemes.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("titre", formData.titre);
    formDataToSend.append("date_parution", formData.date_parution);
    formDataToSend.append("description", formData.description);

    // append each author (repeat the same key so backend gets array or repeated values)
    authors.forEach((a) => {
      if (a && a.trim()) formDataToSend.append("auteur", a.trim());
    });

    // append each selected theme id
    selectedThemes.forEach((t) => {
      if (t) formDataToSend.append("id_theme", t);
    });

    // Ajouter l'image seulement si elle a été changée
    if (formData.image) formDataToSend.append("image", formData.image);

    try {
      const url = editMode
        ? `${process.env.REACT_APP_API_URL}/livres/${id}`
        : `${process.env.REACT_APP_API_URL}/livres`;
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Impossible de sauvegarder le livre");
    }
  };

  const handleCancel = () => navigate("/");

  return (
    <div className={classes.container}>
      <h1>{editMode ? "Modifier un livre" : "Ajouter un livre"}</h1>
      <form onSubmit={handleSubmit} className={classes.form}>
        {/* Image */}
        <div className={classes.imageContainer}>
          {formData.image ? (
            <>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Prévisualisation"
                className={classes.preview}
              />
              <label className={classes.editImageBtn}>
                Modifier l'image
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </label>
            </>
          ) : formData.currentImageUrl ? (
            <>
              <imgage
                src={`${process.env.REACT_APP_API_URL}${formData.currentImageUrl}`}
                alt="Image du livre"
                className={classes.preview}
              />
              <label className={classes.editImageBtn}>
                Modifier l'image
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  style={{ display: "none" }}
                />
              </label>
            </>
          ) : (
            <label className={classes.addImage}>
              Ajouter une image
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        {/* Infos livre */}
        <div className={classes.infoContainer}>
          <label>
            Titre :
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Titre du livre"
              required
            />
          </label>

          <label style={{ position: "relative" }}>
            Auteur :
            {authors.map((a, idx) => (
              <div key={idx} className={classes.authorRow}>
                <input
                  type="text"
                  value={a}
                  onChange={(e) => handleAuthorChange(idx, e.target.value)}
                  onFocus={() => setShowDropdownIndex(idx)}
                  onBlur={() =>
                    setTimeout(() => setShowDropdownIndex(null), 100)
                  }
                  placeholder="Insérer le nom de l’auteur"
                  autoComplete="off"
                  required={idx === 0}
                />
                <div className={classes.inlineButtons}>
                  {idx === authors.length - 1 ? (
                    <button
                      type="button"
                      onClick={addAuthor}
                      className={classes.addBtn}
                    >
                      +
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeAuthor(idx)}
                      className={classes.removeBtn}
                    >
                      −
                    </button>
                  )}
                </div>

                {showDropdownIndex === idx && (
                  <ul className={classes.dropdown}>
                    {auteursExistants
                      .filter((au) =>
                        au.nom.toLowerCase().includes((a || "").toLowerCase()),
                      )
                      .map((au) => (
                        <li
                          key={au.id_auteur}
                          onClick={() => {
                            handleAuthorChange(idx, au.nom);
                            setShowDropdownIndex(null);
                          }}
                        >
                          {au.nom}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </label>

          <label>
            Date de parution :
            <input
              type="date"
              name="date_parution"
              value={formData.date_parution}
              onChange={handleChange}
            />
          </label>

          <label>
            Thème :
            {selectedThemes.map((t, idx) => (
              <div key={idx} className={classes.themeRow}>
                <select
                  value={t}
                  onChange={(e) => handleThemeChange(idx, e.target.value)}
                  required={idx === 0}
                >
                  <option value="">Sélectionner le thème</option>
                  {themes.map((theme) => (
                    <option key={theme.id_theme} value={theme.id_theme}>
                      {theme.nom}
                    </option>
                  ))}
                </select>
                <div className={classes.inlineButtons}>
                  {idx === selectedThemes.length - 1 ? (
                    <button
                      type="button"
                      onClick={addTheme}
                      className={classes.addBtn}
                    >
                      +
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeTheme(idx)}
                      className={classes.removeBtn}
                    >
                      −
                    </button>
                  )}
                </div>
              </div>
            ))}
          </label>

          <label>
            Description :
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Insérer la description du livre"
            />
          </label>

          {/* Boutons */}
          <div className={classes.buttonContainer}>
            <button type="button" onClick={handleCancel}>
              Annuler
            </button>
            <button type="submit">{editMode ? "Modifier" : "Ajouter"}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
