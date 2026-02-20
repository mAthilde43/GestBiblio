import React from "react";
import classes from "./PolitiqueConfidentialite.module.css";

const PolitiqueConfidentialite = () => {
  return (
    <div className={classes.container}>
      <h1>Politique de Confidentialité</h1>

      <section className={classes.section}>
        <h2>1. Introduction</h2>
        <p>
          Chez BookLyst, nous accordons une grande importance à la protection de
          vos données personnelles. Cette politique de confidentialité explique
          comment nous collectons, utilisons et protégeons vos informations
          conformement au Règlement Général sur la Protection des Données
          (RGPD).
        </p>
      </section>

      <section className={classes.section}>
        <h2>2. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul>
          <li>
            <strong>Données d'identification :</strong> nom, prénom, adresse
            email, numero de téléphone
          </li>
          <li>
            <strong>Données de compte :</strong> numéro de carte de
            bibliothèque, mot de passe (chiffré)
          </li>
          <li>
            <strong>Données d'utilisation :</strong> historique des emprunts,
            livres favoris
          </li>
        </ul>
      </section>

      <section className={classes.section}>
        <h2>3. Finalités du traitement</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Gérer votre compte utilisateur</li>
          <li>Permettre les emprunts et retours de livres</li>
          <li>Gérer vos favoris</li>
          <li>Vous contacter concernant vos emprunts</li>
          <li>Améliorer nos services</li>
        </ul>
      </section>

      <section className={classes.section}>
        <h2>4. Base légale du traitement</h2>
        <p>
          Le traitement de vos données est fondé sur l'execution du contrat de
          service entre vous et BookLyst, ainsi que sur votre consentement lors
          de l'inscription.
        </p>
      </section>

      <section className={classes.section}>
        <h2>5. Durée de conservation</h2>
        <p>
          Vos données sont conservées pendant toute la durée de votre
          inscription, puis supprimées dans un delai de 3 ans après la clôture
          de votre compte, sauf obligation légale de conservation.
        </p>
      </section>

      <section className={classes.section}>
        <h2>6. Vos droits (RGPD)</h2>
        <p>Conformement au RGPD, vous disposez des droits suivants :</p>
        <ul>
          <li>
            <strong>Droit d'accès :</strong> obtenir une copie de vos données
            personnelles
          </li>
          <li>
            <strong>Droit de rectification :</strong> corriger vos données
            inexactes
          </li>
          <li>
            <strong>Droit a l'effacement :</strong> demander la suppression de
            vos données
          </li>
          <li>
            <strong>Droit a la portabilite :</strong> recevoir vos données dans
            un format structure (disponible dans votre profil)
          </li>
          <li>
            <strong>Droit d'opposition :</strong> vous opposer au traitement de
            vos données
          </li>
        </ul>
        <p>Pour exercer ces droits, contactez-nous a : contact@booklyst.com</p>
      </section>

      <section className={classes.section}>
        <h2>7. Sécurite des données</h2>
        <p>
          Nous mettons en oeuvre des mesures techniques et organisationnelles
          appropriées pour protéger vos données contre tout accès non autorisé,
          modification, divulgation ou destruction.
        </p>
        <ul>
          <li>Chiffrement des mots de passe</li>
          <li>Connexions securisées (HTTPS)</li>
          <li>Acces restreint aux données</li>
        </ul>
      </section>

      <section className={classes.section}>
        <h2>8. Cookies</h2>
        <p>
          Ce site utilise uniquement des cookies techniques necessaires au bon
          fonctionnement du service (authentification). Aucun cookie de suivi ou
          publicitaire n'est utilisé.
        </p>
      </section>

      <section className={classes.section}>
        <h2>9. Contact</h2>
        <p>
          Pour toute question relative a la protection de vos données
          personnelles, vous pouvez nous contacter :
        </p>
        <p>
          <strong>Email :</strong> contact@booklyst.com
        </p>
        <p>
          <strong>Adresse :</strong> 234 Avenue de Colmar, 67000 STRASBOURG
        </p>
      </section>

      <section className={classes.section}>
        <h2>10. Mise a jour</h2>
        <p>
          Cette politique de confidentialité peut être mise à jour. La derniere
          mise a jour date du {new Date().toLocaleDateString("fr-FR")}.
        </p>
      </section>
    </div>
  );
};

export default PolitiqueConfidentialite;
