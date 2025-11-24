import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./LivreDetails.module.css";
import { AuthContext } from "../../contexts/AuthContext";

const LivreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [livre, setLivre] = useState(null);
  const [isFavori, setIsFavori] = useState(false);
  const [emprunt, setEmprunt] = useState(null); // emprunt par l'utilisateur
  const [empruntGlobal, setEmpruntGlobal] = useState(null); // emprunt de quelqu'un d'autre

  // -----------------------------
  // 1️⃣ Récupérer détails du livre
  // -----------------------------
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/livres/${id}`)
      .then((res) => res.json())
      .then((data) => setLivre(data))
      .catch((err) => console.error(err));
  }, [id]);

  // ---------------------------------------------------
  // 2️⃣ Vérifier si l'utilisateur a emprunté ce livre
  // ---------------------------------------------------
  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_URL}/emprunts/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const empruntLivre = data.find(
          (e) => e.id_livre === Number(id) && !e.date_retour_effectif
        );
        setEmprunt(empruntLivre || null);
      })
      .catch((err) => console.error(err));
  }, [id, token]);

  // ---------------------------------------------------
  // 3️⃣ Vérifier si le livre est emprunté par quelqu'un
  // ---------------------------------------------------
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/emprunts/livre/${id}`)
      .then((res) => res.json())
      .then((data) => setEmpruntGlobal(data)) // data = emprunt actif ou null
      .catch((err) => console.error(err));
  }, [id]);

  // ----------------------------
  // 4️⃣ Vérifier si favori
  // ----------------------------
  useEffect(() => {
    if (!token) return;

    fetch(`${process.env.REACT_APP_API_URL}/favoris`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const favorisLivres = data.map((f) => f.Livre.id_livre);
        setIsFavori(favorisLivres.includes(Number(id)));
      })
      .catch((err) => console.error(err));
  }, [id, token]);

  // ----------------------------
  // 5️⃣ Toggle favori
  // ----------------------------
  const toggleFavori = async () => {
    if (!token) return alert("Vous devez être connecté.");

    try {
      if (isFavori) {
        await fetch(`${process.env.REACT_APP_API_URL}/favoris/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsFavori(false);
      } else {
        await fetch(`${process.env.REACT_APP_API_URL}/favoris`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id_livre: Number(id) }),
        });
        setIsFavori(true);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du favori.");
    }
  };

  // ----------------------------
  // 6️⃣ Emprunter un livre
  // ----------------------------
  const handleEmprunter = async () => {
    if (!token) return alert("Vous devez être connecté.");

    const dateRetour = new Date();
    dateRetour.setDate(dateRetour.getDate() + 14);

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/emprunts/emprunter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_livre: Number(id),
          date_retour_prevu: dateRetour,
        }),
      });

      setEmprunt({
        id_livre: Number(id),
        date_emprunt: new Date(),
        date_retour_prevu: dateRetour,
      });

      navigate("/emprunter", { state: { livre } });
    } catch (err) {
      console.error(err);
      alert("Impossible d'emprunter ce livre.");
    }
  };

  // ----------------------------
  // 7️⃣ Rendre un livre
  // ----------------------------
  const handleRendre = async () => {
    if (!token) return alert("Vous devez être connecté.");

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/emprunts/rendre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_livre: Number(id) }),
      });

      setEmprunt(null);
      alert("Livre rendu !");
    } catch (err) {
      console.error(err);
      alert("Impossible de rendre ce livre.");
    }
  };

  if (!livre) return <p>Chargement...</p>;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => window.history.back()}>
        Retour
      </button>

      <h1 className={styles.title}>{livre.titre}</h1>

      <div className={styles.contentWrapper}>
        <img
          src={
            livre.image_url
              ? `${process.env.REACT_APP_API_URL}${livre.image_url}`
              : "/placeholder.jpg"
          }
          alt={livre.titre}
          className={styles.bookImage}
        />

        <div className={styles.infoContainer}>
          <p>
            <strong>Auteur :</strong>{" "}
            {livre.Auteurs?.map((a) => `${a.prenom} ${a.nom}`).join(", ")}
          </p>

          <p>
            <strong>Date de parution :</strong>{" "}
            {livre.date_parution
              ? new Date(livre.date_parution).toLocaleDateString()
              : "Non renseignée"}
          </p>

          <p>
            <strong>Thème :</strong>{" "}
            {livre.Themes?.map((t) => t.nom).join(", ")}
          </p>

          <p>
            <strong>Description :</strong>
            <br />
            {livre.description || "Aucune description"}
          </p>

          {/* ---------- Boutons ---------- */}
          <div className={styles.buttonsRow}>
            <button className={styles.actionBtn} onClick={toggleFavori}>
              {isFavori ? "Retirer des favoris" : "Ajouter aux favoris"}
            </button>

            {/* LOGIQUE EMPRUNTER / INDIPO / RENDRE */}
            {emprunt ? (
              <button className={styles.actionBtn} onClick={handleRendre}>
                Rendre — emprunté le{" "}
                {new Date(emprunt.date_emprunt).toLocaleDateString()} (retour
                prévu le{" "}
                {new Date(emprunt.date_retour_prevu).toLocaleDateString()})
              </button>
            ) : empruntGlobal ? (
              <button className={styles.actionBtn} disabled>
                Livre indisponible
              </button>
            ) : (
              <button className={styles.actionBtn} onClick={handleEmprunter}>
                Emprunter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivreDetails;
