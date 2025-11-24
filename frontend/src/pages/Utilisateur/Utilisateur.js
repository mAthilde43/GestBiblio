import React, { useState, useEffect } from "react";
import classes from "./Utilisateur.module.css";

const Utilisateur = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/users");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs");
        }
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleView = (user) => {
    alert(
      `Nom: ${user.nom}\nPrénom: ${user.prenom}\nEmail: ${user.email}\nLivre emprunté: ${user.livre}`
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = users.filter(
      (user) =>
        user.nom.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.livre.toLowerCase().includes(value)
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

      <table className={classes.userTable}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Livre emprunté</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.email}</td>
              <td>{user.livre}</td>
              <td>
                <button
                  className={classes.actionButton}
                  onClick={() => handleView(user)}
                >
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Utilisateur;
