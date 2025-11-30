import React, { useState, useEffect } from "react";
import classes from "./AddBook.module.css";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [themes, setThemes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [auteursExistants, setAuteursExistants] = useState([]);
  const [formData, setFormData] = useState({
    titre: "",
    auteur: "",
    date_parution: "",
    id_theme: "",
    description: "",
    image: null,
  });

  // Charger les thèmes et auteurs depuis l'API
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!res.ok) {
          throw new Error(
            `Erreur ${res.status} lors du chargement des auteurs`
          );
        }

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

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titre", formData.titre);
      formDataToSend.append("auteur", formData.auteur);
      formDataToSend.append("date_parution", formData.date_parution);
      formDataToSend.append("id_theme", formData.id_theme);
      formDataToSend.append("description", formData.description);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await fetch(`${process.env.REACT_APP_API_URL}/livres`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) {
        throw new Error("Erreur lors de l'ajout du livre");
      }

      const data = await res.json();
      console.log("Livre ajouté :", data);
      handleCancel();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setFormData({
      titre: "",
      auteur: "",
      date_parution: "",
      id_theme: "",
      description: "",
      image: null,
    });
  };

  return (
    <div className={classes.container}>
      <h1>Ajouter un livre</h1>
      <form onSubmit={handleSubmit} className={classes.form}>
        {/* Image */}
        <div className={classes.imageContainer}>
          {formData.image ? (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Prévisualisation"
              className={classes.preview}
            />
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
            <input
              type="text"
              name="auteur"
              value={formData.auteur}
              onChange={(e) => {
                setFormData({ ...formData, auteur: e.target.value });
                setShowDropdown(true); // afficher le dropdown dès qu'on tape
              }}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 100)} // délai pour permettre le clic sur option
              placeholder="Insérer le nom de l’auteur"
              autoComplete="off"
              required
            />
            {showDropdown && (
              <ul className={classes.dropdown}>
                {auteursExistants
                  .filter((auteur) =>
                    auteur.nom
                      .toLowerCase()
                      .includes(formData.auteur.toLowerCase())
                  )
                  .map((auteur) => (
                    <li
                      key={auteur.id_auteur}
                      onClick={() => {
                        setFormData({ ...formData, auteur: auteur.nom });
                        setShowDropdown(false);
                      }}
                    >
                      {auteur.nom}
                    </li>
                  ))}
              </ul>
            )}
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
            <select
              name="id_theme"
              value={formData.id_theme}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner le thème</option>
              {themes.map((theme) => (
                <option key={theme.id_theme} value={theme.id_theme}>
                  {theme.nom}
                </option>
              ))}
            </select>
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
            <button type="button" onClick={() => navigate("/")}>
              Annuler
            </button>
            <button type="button" onClick={handleCancel}>
              Réinitialiser
            </button>
            <button type="submit">Ajouter</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBook;
