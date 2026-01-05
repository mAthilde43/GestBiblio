import React from "react";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>
        <div className={classes.left}>
          <h3>Booklyst</h3>
          <p>Parce qu’un bon livre mérite une bonne gestion.</p>
        </div>
        <div className={classes.center}>
          <h4>Liens utiles</h4>
          <ul>
            <li>
              <a href="/">Accueil</a>
            </li>
            <li>
              <a href="/catalogue">Catalogue</a>
            </li>
            <li>
              <a href="/emprunter">Emprunts</a>
            </li>
            <li>
              <a href="/favoris">Favoris</a>
            </li>
          </ul>
        </div>
        <div className={classes.right}>
          <h4>Contact</h4>
          <p>
            <strong>Adresse:</strong>{" "}
            <a
              href="https://www.google.com/maps/search/?api=1&query=234+Avenue+de+Colmar+67071+STRASBOURG"
              target="_blank"
              rel="noopener noreferrer"
            >
              234 Avenue de Colmar 67071 STRASBOURG
            </a>
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:contact@booklyst.com">contact@booklyst.com</a>
          </p>
          <p>
            <strong>Téléphone:</strong>{" "}
            <a href="tel:+33388430800">+33 3 88 43 08 00</a>
          </p>
        </div>
      </div>
      <div className={classes.bottom}>
        &copy; {new Date().getFullYear()} Booklyst. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
