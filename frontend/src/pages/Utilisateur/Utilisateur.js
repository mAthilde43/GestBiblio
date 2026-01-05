import React, { useState, useEffect } from "react";
import classes from "./Utilisateur.module.css";

const Utilisateur = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [livresDisponibles, setLivresDisponibles] = useState([]);
  const [selectedLivre, setSelectedLivre] = useState("");

  // Charger utilisateurs
  useEffect(() => {
    fetchUsers();
    fetchLivres();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
      if (!response.ok) throw new Error("Erreur récupération utilisateurs");
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLivres = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/livres`);
      const data = await res.json();
      setLivresDisponibles(
        data.filter(
          (l) =>
            !users.some((u) =>
              (u.emprunts || []).some(
                (e) => e.id_livre === l.id_livre && !e.date_retour_effectif
              )
            )
        )
      );
    } catch (err) {
      console.error("Erreur chargement livres :", err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.nom.toLowerCase().includes(value) ||
          user.email.toLowerCase().includes(value) ||
          (user.emprunts || []).some((e) =>
            e.titre.toLowerCase().includes(value)
          )
      )
    );
  };
  const handleReturnBook = async (id_emprunt) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/emprunts/${id_emprunt}/return`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 🔄 recharger les données
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
      const data = await response.json();

      setUsers(data);
      setFilteredUsers(data);

      const updatedUser = data.find((u) => u.id_user === selectedUser.id_user);
      setSelectedUser(updatedUser);

      fetchLivres();
    } catch (err) {
      console.error(err);
      alert("Impossible de rendre le livre");
    }
  };

  const handleBorrowBook = async () => {
    if (!selectedLivre) return alert("Sélectionnez un livre");

    const dateRetour = new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000
    ).toISOString();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/emprunts/emprunterForUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            id_livre: Number(selectedLivre),
            id_user: selectedUser.id_user,
            date_retour_prevu: dateRetour,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      alert("Livre emprunté avec succès !");

      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
      const data = await response.json();

      setUsers(data);
      setFilteredUsers(data);

      // 🔥 METTRE À JOUR LE USER OUVERT
      const updatedUser = data.find((u) => u.id_user === selectedUser.id_user);

      setSelectedUser(updatedUser);

      // 🔄 MAJ livres disponibles
      fetchLivres();
      setSelectedLivre("");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (loading) return <p className={classes.loading}>Chargement...</p>;
  if (error) return <p className={classes.error}>{error}</p>;

  return (
    <div className={classes.container}>
      <h1>Gestion des utilisateurs</h1>

      <input
        type="text"
        placeholder="Rechercher par nom, email ou livre emprunté..."
        value={searchTerm}
        onChange={handleSearch}
        className={classes.searchInput}
      />

      <div className={classes.userTableContainer}>
        <table className={classes.userTable}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Livres non rendus</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const nonRendus = (user.emprunts || []).filter(
                (e) => !e.date_retour_effectif
              );
              return (
                <tr key={user.id_user}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{nonRendus.length}</td>
                  <td>
                    <button
                      className={classes.actionButton}
                      onClick={() => setSelectedUser(user)}
                    >
                      Voir plus
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Modal utilisateur */}
        {selectedUser && (
          <div className={classes.modalOverlay}>
            <div className={classes.modal}>
              <button
                className={classes.closeButton}
                onClick={() => setSelectedUser(null)}
              >
                X
              </button>
              <h2>
                {selectedUser.nom} {selectedUser.prenom}
              </h2>
              <p>Email: {selectedUser.email}</p>
              <p>Téléphone: {selectedUser.telephone || "Non renseigné"}</p>

              {/* Emprunts en cours */}
              <div className={classes.section}>
                <h3>Emprunts en cours</h3>
                {(selectedUser.emprunts || []).filter(
                  (e) => !e.date_retour_effectif
                ).length === 0 ? (
                  <p>Aucun emprunt en cours</p>
                ) : (
                  <ul className={classes.empruntList}>
                    {selectedUser.emprunts

                      .filter((e) => !e.date_retour_effectif)
                      .map((e, idx) => {
                        const isLate =
                          new Date(e.date_retour_prevu) < new Date();
                        return (
                          <li
                            key={idx}
                            className={classes.empruntItem}
                            style={{
                              borderLeft: isLate ? "4px solid red" : "",
                            }}
                          >
                            <strong>{e.titre || "Titre inconnu"}</strong>

                            <div>
                              Date emprunt:{" "}
                              {new Date(e.date_emprunt).toLocaleDateString()}
                            </div>
                            <div>
                              Date retour prévu:{" "}
                              {new Date(
                                e.date_retour_prevu
                              ).toLocaleDateString()}
                            </div>
                            <button
                              onClick={() => handleReturnBook(e.id_emprunt)}
                            >
                              Marquer comme rendu
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>

              {/* Emprunter un livre */}
              <div className={classes.section}>
                <h3>Emprunter un livre</h3>
                <select
                  value={selectedLivre}
                  onChange={(e) => setSelectedLivre(e.target.value)}
                >
                  <option value="">Sélectionnez un livre</option>
                  {livresDisponibles.map((l) => (
                    <option key={l.id_livre} value={l.id_livre}>
                      {l.titre}
                    </option>
                  ))}
                </select>
                <button onClick={handleBorrowBook}>Emprunter</button>
              </div>

              {/* Livres rendus */}
              <div className={classes.section}>
                <h3>Livres rendus</h3>
                {(selectedUser.emprunts || []).filter(
                  (e) => e.date_retour_effectif
                ).length === 0 ? (
                  <p>Aucun livre rendu</p>
                ) : (
                  <ul className={classes.empruntList}>
                    {selectedUser.emprunts
                      .filter((e) => e.date_retour_effectif)
                      .map((e, idx) => (
                        <li key={idx} className={classes.empruntItem}>
                          <strong>{e.titre || "Titre inconnu"}</strong>
                          <div>
                            Date emprunt:{" "}
                            {new Date(e.date_emprunt).toLocaleDateString()}
                          </div>
                          <div>
                            Date retour prévu:{" "}
                            {new Date(e.date_retour_prevu).toLocaleDateString()}
                          </div>
                          <div>
                            Date retour effectif:{" "}
                            {new Date(
                              e.date_retour_effectif
                            ).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Utilisateur;
