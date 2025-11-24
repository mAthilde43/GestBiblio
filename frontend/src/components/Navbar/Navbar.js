import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
import Logo from "../../assets/images/logoBooklyst.png";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);

  const isLoggedIn = !!token && !!user;
  console.log("Navbar user:", user);
  const isAdmin = isLoggedIn && user.id_role === 2;

  return (
    <nav className={classes.navbar}>
      <div className={classes.logo}>
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <ul className={classes.navLinks}>
        {isAdmin && (
          <li>
            <Link to="/users">Utilisateurs</Link>
          </li>
        )}
        <li>
          <Link to="/catalogue">Catalogue</Link>
        </li>

        {/* Nouveau lien Favoris */}
        {isLoggedIn && (
          <li>
            <Link to="/favoris">Favoris</Link>
          </li>
        )}

        {isLoggedIn && (
          <li>
            <Link to="/emprunter">Emprunts</Link>
          </li>
        )}

        <li>
          {isLoggedIn ? (
            <>
              <Link to="/account">Mon compte</Link>
              <button onClick={logout} className={classes.logoutButton}>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </>
          ) : (
            <Link to="/auth/login">Se connecter</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
