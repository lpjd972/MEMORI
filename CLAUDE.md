# Memory Bible (anciennement MEMORI) — règles pour Claude

Le Memory de la Bible pour toute la famille (3 à 99 ans) : 3 jeux (Memory, Mots mêlés, Versets à trous), Bible
Louis Segond 1910. Projet de JD (« Un projet Vie de Louange »). Dépôt PRIVÉ `lpjd972/MEMORI`.
En ligne : https://memory-bible-jd.web.app (Firebase, projet `memory-bible-jd`) ; base : Supabase de JD.

## RÈGLE N°1 — on ne perd jamais rien
- **À la fin de chaque mission (et après chaque correction) : commit en français, puis push sur GitHub.**
  Branche de référence : `main` (refonte fusionnée le 01/11/2026, PR n°6).
- Puis mettre à jour la page du wiki (`projets/memory-bible.md`), une ligne en haut de son `journal.md`, et envoyer le wiki.
- Avant de pousser : récupérer d'abord ce qui est sur GitHub (une autre discussion peut avoir écrit). Jamais de push forcé.
- Jamais d'identifiant, de mot de passe, de clé secrète ni d'adresse e-mail dans le dépôt (la clé « publishable »
  Supabase du fichier `.env` est publique par nature).

## En début de session
1. Lire `README.md`, puis `docs/2026-10-29_CHECK-UP-et-REFONTE.md` (tout ce qui a été fait, rubrique par rubrique).
2. Sur le PC fixe, le jeu vit dans `C:\Users\jeand\Desktop\memory-bible` (branche `main`) ; mise en ligne par JD :
   `git pull` puis `npm run deploy` (deux commandes séparées).

## Règles du projet (décisions de JD)
- **Gratuit, sans argent, pour toujours** (01/11/2026) : aucun achat, aucun abonnement, aucune publicité, aucune
  bibliothèque de paiement. Les vies et les étoiles se gagnent seulement en jouant.
- Petits (3-6 ans) : Memory seulement, avec un parent ; jamais de YouTube pour eux (labyrinthe « Rejoins Jésus »,
  lien Bible App pour les enfants). Mots mêlés et Versets à trous : dès 7 ans.
- Toujours renvoyer vers la Bible (chapitre, verset), que la réponse soit juste ou fausse ; la bonne réponse n'est
  jamais donnée après une erreur.
- YouTube : jamais de récompense pour avoir regardé une vidéo (règle de YouTube).
- Vérifier : `npm test`, `npx tsc --noEmit -p tsconfig.app.json`, `npm run lint`, `npm run build`.
- Français, phrases simples, pas à pas : JD n'est pas développeur.

## Wiki commun de JD — C:\WIKI-JD
Ce projet est relié au wiki commun de JD, le même dossier sur toutes ses machines : C:\WIKI-JD
- En début de session : python C:\WIKI-JD\outils\synchroniser.py recevoir, puis lire C:\WIKI-JD\INDEX.md
  et la page de ce projet dans C:\WIKI-JD\projets\
- Quand l'état ou la prochaine action du projet change : mettre à jour cette page, ajouter une ligne en haut
  de C:\WIKI-JD\journal.md, puis python C:\WIKI-JD\outils\synchroniser.py envoyer "ce qui change"
- Règles du wiki : C:\WIKI-JD\CLAUDE.md (jamais d'identifiant ni de mot de passe ; on ne recopie pas le
  projet dans le wiki, on résume et on renvoie vers la page d'origine)
- Tout passe par GitHub (dépôts PRIVÉS de JD, compte lpjd972) : au début d'une discussion sur un projet,
  python C:\WIKI-JD\outils\projets_github.py recevoir "<dossier du projet>" ; à la fin (règle n°1),
  python C:\WIKI-JD\outils\projets_github.py envoyer "<dossier>" "ce qui change". Jamais d'identifiant sur GitHub :
  le contrôle refuse l'envoi ; les identifiants restent sur la machine. Détail : C:\WIKI-JD\CLAUDE.md.
- Courrier entre machines : au début, python C:\WIKI-JD\outils\courrier.py lire <vps|pc-fixe|pc-portable> ; répondre à ce qui attend.
- Discussion cloud (pas de C:\WIKI-JD) : cloner https://github.com/lpjd972/wiki-jd.git dans un dossier temporaire et lire son INDEX.md.
- Si C:\WIKI-JD n'existe pas sur cette machine : le dire à JD, ne pas le recréer à la main. Il s'installe par
  git clone https://github.com/lpjd972/wiki-jd.git C:\WIKI-JD (JD se connecte à GitHub si on le lui demande).
