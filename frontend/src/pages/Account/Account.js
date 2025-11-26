import React, { useState, useEffect, useContext } from "react";
import classes from "./Account.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import AvatarProfil from "../../assets/images/AvatarProfil.png";

const Account = () => {
  const { token } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (!token) throw new Error("Utilisateur non authentifié");

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error(
            "Erreur lors de la récupération du profil utilisateur"
          );
        }

        const data = await response.json();
        setCurrentUser(data);

        // Remplit les champs du formulaire
        setFormData({
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Gère les inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Envoie la mise à jour au backend
  const saveChanges = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedUser = await response.json();
      setCurrentUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className={classes.loading}>Chargement...</p>;
  if (error) return <p className={classes.error}>{error}</p>;
  if (!currentUser)
    return <p className={classes.error}>Utilisateur non trouvé</p>;

  return (
    <div className={classes.container}>
      <h1>Mon compte</h1>

      <div className={classes.profileCard}>
        <div className={classes.imageWrapper}>
          <img
            src={AvatarProfil}
            alt={`${currentUser.nom} ${currentUser.prenom}`}
            className={classes.profileImage}
          />
        </div>

        <div className={classes.infoSection}>
          {/* NOM */}
          <p>
            <strong>Nom : </strong>
            {editMode ? (
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                className={classes.input}
              />
            ) : (
              currentUser.nom
            )}
          </p>

          {/* PRÉNOM */}
          <p>
            <strong>Prénom : </strong>
            {editMode ? (
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                className={classes.input}
              />
            ) : (
              currentUser.prenom
            )}
          </p>

          {/* TÉLÉPHONE */}
          <p>
            <strong>Téléphone : </strong>
            {editMode ? (
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                className={classes.input}
              />
            ) : (
              currentUser.telephone || "Non renseigné"
            )}
          </p>

          {/* EMAIL (non modifiable) */}
          <p>
            <strong>Email :</strong> {currentUser.email}
          </p>

          {/* ROLE */}
          <p>
            <strong>Rôle :</strong> {currentUser.Role?.nom || "Inconnu"}
          </p>

          {/* CARD NUMBER */}
          <p>
            <strong>Numéro de carte :</strong> {currentUser.card_number}
          </p>

          {/* BOUTON MODIFIER */}
          {!editMode && (
            <button
              className={classes.button}
              onClick={() => setEditMode(true)}
            >
              Modifier
            </button>
          )}

          {/* BOUTONS ENREGISTRER + ANNULER CÔTE À CÔTÉ */}
          {editMode && (
            <div className={classes.buttonRow}>
              <button className={classes.button} onClick={saveChanges}>
                Enregistrer
              </button>

              <button
                className={classes.cancelButton}
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    nom: currentUser.nom,
                    prenom: currentUser.prenom,
                    telephone: currentUser.telephone || "",
                  });
                }}
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
