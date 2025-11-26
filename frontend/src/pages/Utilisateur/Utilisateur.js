import React, { useState, useEffect } from "react";
import classes from "./Utilisateur.module.css";

const Utilisateur = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`);
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des utilisateurs");
        const data = await response.json();

        // filtrer les utilisateurs avec au moins un livre non rendu
        const nonRenduUsers = data.filter((u) =>
          (u.emprunts || []).some((e) => !e.date_retour_effectif)
        );

        setUsers(nonRenduUsers);
        setFilteredUsers(nonRenduUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(
      (user) =>
        user.nom.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        (user.emprunts || []).some((e) => e.titre.toLowerCase().includes(value))
    );
    setFilteredUsers(filtered);
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
                      .map((e, idx) => (
                        <li key={idx} className={classes.empruntItem}>
                          <strong>{e.titre}</strong>
                          <div>
                            Date emprunt :{" "}
                            {new Date(e.date_emprunt).toLocaleDateString()}
                          </div>
                          <div>
                            Date retour prévu :{" "}
                            {new Date(e.date_retour_prevu).toLocaleDateString()}
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

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
                          <strong>{e.titre}</strong>
                          <div>
                            Date emprunt :{" "}
                            {new Date(e.date_emprunt).toLocaleDateString()}
                          </div>
                          <div>
                            Date retour prévu :{" "}
                            {new Date(e.date_retour_prevu).toLocaleDateString()}
                          </div>
                          <div>
                            Date retour effectif :{" "}
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
