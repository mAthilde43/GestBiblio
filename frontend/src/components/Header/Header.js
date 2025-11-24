import React from "react";
import classes from "./Header.module.css";
import headerImage from "../../assets/images/header.jpg";
import SearchBar from "../SearchBar/SearchBar";

const Header = () => {
  return (
    <>
      <header
        className={classes.header}
        style={{ backgroundImage: `url(${headerImage})` }}
      >
        <div className={classes.overlay}>
          <div className={classes.textContainer}>
            <h1 className={classes.title}>Booklyst</h1>
            <h2 className={classes.subtitle}>
              Parce qu’un bon livre mérite une bonne gestion
            </h2>
          </div>
        </div>
      </header>
      <SearchBar />
    </>
  );
};

export default Header;
