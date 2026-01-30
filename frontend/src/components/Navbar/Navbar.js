import { Link } from "react-router-dom";
import classes from "./Navbar.module.css";
import Logo from "../../assets/images/logoBooklyst.png";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

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
      <button
        className={classes.hamburger}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="primary-navigation"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={classes.bar} />
        <span className={classes.bar} />
        <span className={classes.bar} />
      </button>
      <ul
        className={`${classes.navLinks} ${open ? classes.open : ""}`}
        id="primary-navigation"
      >
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
              <Link to="/account" onClick={() => setOpen(false)}>
                Mon compte
              </Link>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className={classes.logoutButton}
              >
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </>
          ) : (
            <Link to="/auth/login" onClick={() => setOpen(false)}>
              Se connecter
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
