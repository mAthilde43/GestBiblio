import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Vérifie si un token est stocké dans le localStorage au chargement
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      // Vérifier que les valeurs existent et ne sont pas "undefined" ou "null" en string
      if (
        storedToken &&
        storedToken !== "undefined" &&
        storedToken !== "null"
      ) {
        setToken(storedToken);
      }

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        const parsedUser = JSON.parse(storedUser);
        // Vérifier que le parsage a donné un objet valide
        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des données d'authentification:",
        error,
      );
      // Nettoyer le localStorage en cas d'erreur
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, []);

  // Fonction pour login
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Fonction pour logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
