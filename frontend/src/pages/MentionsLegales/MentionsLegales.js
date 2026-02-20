import React from "react";
import classes from "./MentionsLegales.module.css";

const MentionsLegales = () => {
  return (
    <div className={classes.container}>
      <h1>Mentions Légales</h1>

      <section className={classes.section}>
        <h2>1. Éditeur du site</h2>
        <p>
          <strong>Nom du site :</strong> BookLyst
        </p>
        <p>
          <strong>Adresse :</strong> 234 Avenue de Colmar, 67000 STRASBOURG
        </p>
        <p>
          <strong>Email :</strong> contact@booklyst.com
        </p>
        <p>
          <strong>Telephone :</strong> +33 3 88 43 08 00
        </p>
      </section>

      <section className={classes.section}>
        <h2>2. Hébergement</h2>
        <p>
          Le site BookLyst est heberge par un prestataire dont les coordonnées
          sont les suivantes :
        </p>
        <p>
          <strong>Hébergeur :</strong> [Nom de l'hébergeur]
        </p>
        <p>
          <strong>Adresse :</strong> [Adresse de l'hébergeur]
        </p>
      </section>

      <section className={classes.section}>
        <h2>3. Propriété intellectuelle</h2>
        <p>
          L'ensemble du contenu de ce site (textes, images, logos, icones, etc.)
          est protegé par le droit d'auteur. Toute reproduction, représentation,
          modification ou exploitation non autorisée est interdite.
        </p>
      </section>

      <section className={classes.section}>
        <h2>4. Responsabilité</h2>
        <p>
          BookLyst s'efforce de fournir des informations exactes et à jour.
          Toutefois, nous ne pouvons garantir l'exactitude, la complétude ou
          l'actualité des informations diffusées sur ce site.
        </p>
      </section>

      <section className={classes.section}>
        <h2>5. Liens externes</h2>
        <p>
          Le site peut contenir des liens vers d'autres sites web. BookLyst
          n'est pas responsable du contenu de ces sites externes.
        </p>
      </section>

      <section className={classes.section}>
        <h2>6. Contact</h2>
        <p>
          Pour toute question concernant ces mentions légales, vous pouvez nous
          contacter a l'adresse : contact@booklyst.com
        </p>
      </section>
    </div>
  );
};

export default MentionsLegales;
