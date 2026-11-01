# Memory Bible (anciennement MEMORI)

Le jeu de Memory de la Bible, de la Genèse à l'Apocalypse, pour jouer de 3 à 99 ans — avec aussi des mots mêlés et des versets à trous.
On retrouve les paires de cartes d'une histoire biblique, puis une question sur cette histoire ouvre le
niveau suivant. Aucune publicité. Refonte complète du 29/10/2026 : voir
[`docs/2026-10-29_CHECK-UP-et-REFONTE.md`](docs/2026-10-29_CHECK-UP-et-REFONTE.md).

## Où est quoi

| Fichier | Rôle |
|---|---|
| `src/lib/bible/histoires.ts` | les 31 histoires, dans l'ordre de la Bible : titre, passage, résumé, verset (Louis Segond 1910), cartes |
| `src/lib/bible/questions.ts` | les questions (niveau 1 petits, 2 enfants, 3 ados et adultes), avec leur référence |
| `src/lib/bible/motsMeles.ts`, `src/lib/bible/versets.ts` | les mots des mots mêlés et les versets à trous, avec leur référence |
| `src/components/MotsMelesGame.tsx`, `VersetsGame.tsx`, `Labyrinthe.tsx` | les deux autres jeux et le labyrinthe des petits |
| `src/lib/louanges.ts` | les chants de la « Pause louange » (liens YouTube, à remplir) |
| `src/lib/gameData.ts` | les règles : taille des plateaux, vies perdues, choix des questions selon l'âge |
| `src/pages/Index.tsx` | l'enchaînement des écrans : accueil → Memory → question → verset → niveau suivant |
| `outils/generer-icones.mjs` | refait le logo et les icônes Android à partir de `public/logo.svg` |
| `PUBLISH.md`, `STORE_LISTING.md`, `PRIVACY.md` | publication sur le Play Store, textes de la fiche, confidentialité |

## Règle de JD : gratuit, sans argent

Memory Bible est gratuit et le reste : aucun achat, aucun abonnement, aucune publicité. Les vies et les étoiles
se gagnent seulement en jouant. Le site s'installe sur l'écran d'accueil du téléphone (bouton sur l'accueil).

## Commandes

```sh
npm install        # une fois
npm run dev        # lancer le jeu sur l'ordinateur (adresse affichée dans la fenêtre)
npm test           # vérifier le contenu biblique et les règles du jeu
npm run lint       # contrôle du code
npm run build      # construire le site (dossier dist/)
npm run deploy     # publier le site sur Firebase Hosting (après « firebase login », voir PUBLISH.md)
```

L'appli Android se construit depuis GitHub (onglet Actions, « Build Android AAB ») : voir `PUBLISH.md`.

## Règles du contenu
- Versets cités : Bible **Louis Segond 1910** (domaine public). Aucun texte de la Parole de Vie 2017
  (protégée par le droit d'auteur) sans l'accord de l'Alliance biblique française.
- Chaque question a sa référence biblique ; les tests refusent une carte en double, une histoire sans
  assez de questions, ou un retour du contenu de l'ancien jeu (Disney, Escape Game).
- Pause louange : jamais de récompense pour avoir regardé une vidéo (règle de YouTube).
