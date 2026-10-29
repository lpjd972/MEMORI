const Privacy = () => {
  return (
    <div className="min-h-screen bg-background px-6 py-10">
      <div className="mx-auto max-w-2xl text-foreground">
        <a href="/" className="text-primary underline text-sm">← Retour</a>
        <h1 className="mt-4 mb-2 text-3xl font-black">Politique de confidentialité</h1>
        <p className="mb-6 text-sm text-muted-foreground">Dernière mise à jour : 29 octobre 2026</p>

        <p className="mb-4">
          La présente politique décrit comment l'application <strong>Memory Bible</strong>{" "}
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
          <strong>Aucune publicité.</strong> L'Application n'affiche aucune publicité et n'utilise pas
          votre identifiant publicitaire.
        </p>
        <p className="mb-2">
          <strong>Pause louange (YouTube).</strong> Si vous choisissez de lancer une « pause louange », un
          extrait de chant est lu depuis YouTube (mode « confidentialité renforcée »). YouTube, service de
          Google, peut alors traiter des données techniques (adresse IP, appareil).{" "}
          <a className="text-primary underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            Politique de Google
          </a>.
        </p>
        <p className="mb-2">
          <strong>Sur l'appareil.</strong> La tranche d'âge choisie (Petits, Enfants, Ados & adultes) est
          gardée sur votre appareil uniquement.
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">2. Utilisation des données</h2>
        <p className="mb-2">
          Fournir et améliorer le jeu, gérer votre compte et le classement, et assurer la sécurité.
        </p>

        <h2 className="mt-6 mb-2 text-xl font-bold">3. Partage</h2>
        <p className="mb-2">
          Nous ne vendons pas vos données. Elles sont traitées par notre prestataire Supabase
          (hébergement des comptes et données de jeu) et, seulement pendant une pause louange, par YouTube.
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
          Memory Bible peut être joué par des enfants <strong>sans compte</strong> : rien n'est alors envoyé
          sur internet, en dehors d'une pause louange choisie. La création d'un compte est réservée aux
          personnes de 15 ans et plus, ou se fait par un parent.
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
