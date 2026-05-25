const Privacy = () => {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl text-foreground">
        <a href="/" className="text-primary underline text-sm">← Retour</a>
        <h1 className="mt-4 mb-2 text-3xl font-black">Politique de confidentialité</h1>
        <p className="mb-6 text-sm text-muted-foreground">Dernière mise à jour : 25 mai 2026</p>

        <p className="mb-4">
          La présente politique décrit comment l'application mobile <strong>Memori</strong>{" "}
          (« l'Application ») collecte, utilise et protège vos informations.
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">1. Informations collectées</h2>
        <p className="mb-2">
          <strong>Données de compte.</strong> Si vous créez un compte ou vous connectez (y compris via
          Google), nous collectons votre adresse e-mail et votre nom d'affichage, afin de gérer votre
          profil, sauvegarder votre progression et afficher le classement.
        </p>
        <p className="mb-2">
          <strong>Données de jeu.</strong> Nous enregistrons votre progression (niveaux, scores) pour la
          restaurer et l'afficher dans le classement.
        </p>
        <p className="mb-2">
          <strong>Publicité.</strong> L'Application affiche des publicités via Google AdMob, qui peut
          traiter votre identifiant publicitaire et des données techniques.{" "}
          <a className="text-primary underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            Politique de Google
          </a>.
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">2. Utilisation des données</h2>
        <p className="mb-2">
          Fournir et améliorer le jeu, gérer votre compte et le classement, afficher des publicités et
          assurer la sécurité.
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">3. Partage</h2>
        <p className="mb-2">
          Nous ne vendons pas vos données. Elles sont traitées par nos prestataires : Google AdMob
          (publicité) et Supabase (hébergement des comptes et données de jeu).
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">4. Sécurité</h2>
        <p className="mb-2">Les données sont transmises de manière chiffrée (HTTPS) et stockées de façon sécurisée.</p>

        <h2 className="mt-6 mb-2 text-xl font-bold">5. Vos droits</h2>
        <p className="mb-2">
          Vous pouvez demander l'accès à vos données ou leur suppression en nous contactant. La
          suppression du compte entraîne celle des données associées.
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">6. Enfants</h2>
        <p className="mb-2">
          L'Application n'est pas destinée aux moins de 13 ans et ne collecte pas sciemment leurs données.
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">7. Contact</h2>
        <p className="mb-2">
          <a className="text-primary underline" href="mailto:jeandenislouisphilippe@gmail.com">
            jeandenislouisphilippe@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default Privacy;
