# Memory Bible — check-up de l'ancien MEMORI et refonte (29/10/2026)

Demande de JD du 29/10/2026 : faire le check-up du jeu MEMORI, puis le refaire de A à Z sur le thème de
la Bible, sous le nom **Memory Bible**. Les questions Disney et dessins animés partent, l'Escape Game est
retiré pour de bon, les « pubs » deviennent des extraits de louange sur YouTube.

## 1. Le check-up de l'ancien MEMORI (état trouvé le 29/10/2026)

| Point vérifié | Résultat |
|---|---|
| Construction du site (`npm run build`) | ✅ fonctionne |
| Tests automatiques | ⚠ un seul test « vide » (il vérifiait `true = true`), rien sur le jeu |
| Contrôle du code (`npm run lint`) | ❌ 7 erreurs, dont une vraie erreur de React dans `Index.tsx` (l'indice) |
| Indice à 3 ⭐ | ❌ il retirait 3 points mais **ne donnait aucun indice** (message « Indice activé ! » seulement) |
| Écran d'accueil | ❌ annonçait « 50 vies, 10 niveaux » alors que le jeu donne 100 vies et des niveaux infinis |
| Fin de partie, bouton « Retour au menu » | ❌ remettait tout à zéro (niveau 1, score 0) sans prévenir |
| Question après une erreur | ❌ si la même question retombait (1 chance sur 55), l'écran restait bloqué |
| Pub « Obtenir un indice » | ❌ donnait 3 points, pas un indice |
| Pubs sur le téléphone (AdMob) | ❌ à chaque pub regardée, la récompense s'ajoutait une fois de plus (vies données 2, 3, 4 fois) ; et si la pub échouait, la récompense était donnée quand même |
| Pubs sur le site (AdSense) | ❌ risque pour le compte AdSense : AdSense interdit de récompenser quelqu'un parce qu'il regarde une pub (seul le format officiel « pub récompensée » d'AdMob le permet) |
| Langue de la page | ⚠ déclarée en anglais (`lang="en"`) pour un jeu en français |
| Clé Supabase dans `.env` (suivi par git) | ✅ acceptable : c'est la clé « publique » prévue pour être dans l'appli ; aucune clé secrète trouvée |

Tous ces points sont corrigés dans la nouvelle version (voir § 3).

## 2. Ce qu'est Memory Bible maintenant

- **Le même procédé, les mêmes règles** : on retourne les cartes, on trouve les paires, on perd des vies en
  cas d'erreur, puis **une question sur la Bible** ouvre le niveau suivant. Niveaux infinis, classement,
  sauvegarde avec un compte : tout est gardé.
- **Un niveau = une histoire de la Bible, dans l'ordre**, de la Genèse à l'Apocalypse : 31 histoires
  (Création, Adam et Ève, Noé, Babel, Abraham, Joseph, Moïse, la sortie d'Égypte, les dix commandements,
  Josué et Jéricho, Gédéon, Samson, Ruth, Samuel, David et Goliath, Salomon, Élie, Jonas, Daniel, Esther,
  la naissance de Jésus, son baptême, les disciples, les miracles, les paraboles, les rencontres de Jésus,
  la croix, la résurrection, la Pentecôte, Paul, l'Apocalypse). Après l'Apocalypse, on repart de la
  Genèse (« Tour 2 ») avec des plateaux plus grands et des questions plus difficiles.
- **Les cartes parlent de l'histoire** : pour Noé, l'arche, la colombe, la feuille d'olivier,
  l'arc-en-ciel, les animaux deux par deux… ; pour Josué, le Jourdain, Rahab, les trompettes, les sept
  tours, les murailles… 201 cartes en tout, chacune unique.
- **La question porte sur l'histoire qu'on vient de jouer** : 220 questions, chacune avec sa référence
  (« 📖 À lire : Genèse 8:11 »), affichée après la réponse.
- **Trois tranches d'âge**, choisies sur l'écran d'accueil (« Qui joue ? ») :

| | Petits (3 – 6 ans) | Enfants (7 – 12 ans) | Ados & adultes (13 – 99 ans) |
|---|---|---|---|
| Cartes | grandes images + mot | images + mots | **des mots seulement** |
| Plateau | 2 paires au début, 6 au plus | 3 au début, 12 au plus | 4 au début, 15 au plus |
| Questions | très simples, avec images, 3 choix, **lues à voix haute** | simples puis moyennes, 4 choix | moyennes puis pointues, 4 choix |
| Fin de niveau | une phrase simple qui raconte l'histoire | le verset de l'histoire | le verset de l'histoire |
| Vies perdues par erreur | 1 | 1 (2 au tour 2) | 1, puis 2, puis 3 |

- **L'indice marche** : pour 3 ⭐, il retire des mauvaises réponses (il en reste deux).
- **Fin de niveau** : un verset de la Bible **Louis Segond 1910** (par exemple Genèse 9:13 pour Noé).
- **Bouton 🔊 Écouter** sur chaque question (synthèse vocale du téléphone).

### La Bible utilisée
- **Louis Segond 1910** pour les versets cités : elle est dans le domaine public, on peut la citer librement.
- **Parole de Vie 2017** : elle est protégée par le droit d'auteur (Alliance biblique française). On ne
  recopie aucun de ses textes dans le jeu sans leur accord écrit. Si JD veut des versets en Parole de Vie
  pour les petits, il faut d'abord demander l'autorisation à l'Alliance biblique.
- Les noms suivent la Louis Segond (l'Éternel, Nebucadnetsar, Schadrac, Méschac et Abed-Nego, le ricin de
  Jonas, le grain de sénevé…). Les cartes évitent ce que la Bible ne dit pas (pas de « pomme » pour
  Adam et Ève, pas d'âne à la crèche).

## 3. Ce qui a été retiré ou corrigé
- **Escape Game retiré définitivement** (devinettes, suites de nombres, anagrammes).
- **Toutes les anciennes questions retirées** (Disney, Bob l'Éponge, sport, musique, géographie…).
- **Les pubs Google retirées** (AdMob sur le téléphone, AdSense sur le site, fichier `ads.txt`).
- Les bugs du § 1 corrigés ; le contrôle du code n'a plus d'erreur ; 11 tests automatiques vérifient le
  contenu biblique (cartes uniques, au moins 2 questions par histoire et par âge, aucune bonne réponse en
  double, plus aucune trace de Disney ni d'Escape Game) et le moteur du jeu.
- Nouveau nom partout (écran, page web, nom sous l'icône Android), **nouveau logo** (livre ouvert et
  croix dorée), nouvelles couleurs (bleu nuit et or), version Android passée à **2.0** (code de version 2).
- L'identifiant Play Store `com.memori.game` **ne change pas** : le changer créerait une nouvelle appli et
  ferait perdre la fiche existante.

## 4. ⚠ Les louanges YouTube : la règle à connaître (décision à prendre par JD)
L'idée de JD : à la place des pubs, faire écouter 30 secondes d'un chant de louange (par exemple
« Comment ne pas te louer ») pour aider les chaînes YouTube à se faire connaître, sans gagner d'argent.

**Problème : YouTube interdit de donner une récompense en échange du visionnage d'une vidéo.** Sa règle
pour les développeurs dit qu'on ne doit pas « inciter, récompenser, contraindre ou payer » quelqu'un pour
qu'il regarde une vidéo : le choix de regarder doit être libre. Des vues « contre des vies » seraient des
vues incitées : YouTube peut ne pas les compter, et cela pourrait même **nuire aux chaînes qu'on veut aider**.
Source : https://developers.google.com/youtube/terms/developer-policies-guide

**Ce qui a été fait, pour respecter la règle sans perdre l'idée :**
- **🎵 Pause louange** (menu Bonus, et proposée tous les 3 niveaux réussis) : 30 secondes d'un chant
  YouTube, puis le chant s'arrête, avec un bouton « Écouter le chant en entier sur YouTube » pour aller
  sur la chaîne. Libre et **sans récompense**.
- **📖 Défi de la Parole** (menu Bonus) : c'est lui qui fait gagner des vies : 3 questions sur les
  histoires déjà vues, +3 ❤️ par bonne réponse. On gagne des vies en apprenant la Bible.
- **La liste des chants est vide pour l'instant** : je n'ai pas pu ouvrir YouTube depuis l'ordinateur de
  travail pour vérifier des vidéos, et je n'invente pas d'adresses. Tant qu'elle est vide, la pause
  louange affiche un psaume à méditer pendant 30 secondes. Pour ajouter un chant : fichier
  `src/lib/louanges.ts` (mode d'emploi en haut du fichier) — ou JD envoie les liens à Claude.
- Conseil : prévenir chaque chaîne (ou lui demander son accord) avant de l'ajouter.

Si JD veut quand même lier les vies aux louanges, il suffit de le dire, mais c'est contraire à la règle
de YouTube : je le déconseille.

## 5. Ce qui reste à faire (par JD, dans l'ordre)
1. **Essayer le jeu** (copie de travail, `npm run dev`) et dire ce qu'il faut changer.
2. **Donner les liens des chants de louange** à mettre dans la pause louange.
3. **Play Console**, à la prochaine mise à jour :
   - fiche du Store : nouveau titre et textes (prêts dans `STORE_LISTING.md`), nouvelles captures ;
   - « Annonces » : répondre **Non, l'appli ne contient pas d'annonces** ;
   - « Sécurité des données » : retirer l'identifiant publicitaire ;
   - « Public cible » : si JD coche les moins de 13 ans, les règles « Familles » de Google s'appliquent
     (c'est possible car il n'y a plus de pub ; la connexion avec un compte reste facultative) ;
   - construire le nouveau fichier `.aab` (onglet Actions de GitHub, « Build Android AAB ») et l'envoyer.
4. Dans AdMob et AdSense : les blocs de pub de MEMORI ne servent plus ; JD peut les désactiver.
5. Relire quelques questions avec quelqu'un de son église : 220 questions ont été vérifiées avec leurs
   références, mais un deuxième regard est toujours utile.
6. **Site sur Firebase** (décision de JD du 29/10/2026 : « utilise Firebase plutôt » que Vercel) :
   créer le projet Firebase `memory-bible-jd` (`memory-bible` était déjà pris), `firebase login`, puis `npm run deploy` ; ajouter la nouvelle
   adresse dans Supabase ; débrancher Vercel. Marche à suivre : `PUBLISH.md`, « Le site web ».
   **Fait le 30/10/2026** : projet Firebase `memory-bible-jd` créé et site publié par JD depuis le PC fixe
   (`C:\Users\jeand\Desktop\memory-bible`) : https://memory-bible-jd.web.app. Restent : Supabase et Vercel.
7. **Comptes dans le Supabase de JD** (accord de JD du 30/10/2026, « les anciens joueurs recréeront leur
   compte ») : tables recréées dans le projet `jnfetpxchbnqejizjvef` (organisation « memori »), jeu branché
   dessus, inscription testée puis annulée. Corrigé au passage : le classement restait vide, faute de lien
   entre les scores et les profils. Restent pour JD : l'adresse du site et Google dans Supabase
   (`PUBLISH.md`, « Le site web », point 3), puis `git pull` et `npm run deploy` sur le PC fixe.
8. **Pause psaume récompensée** (demande de JD du 30/10/2026 : « que la pause de 30 secondes rapporte des
   vies ») : la « Pause psaume » (un verset des Psaumes, 30 s) donne +9 ❤️. La « Pause louange » avec un
   chant YouTube apparaîtra à côté quand JD aura donné ses liens ; elle reste sans récompense (règle de YouTube).
9. **Connexion Google en service** (30/10/2026) : client OAuth créé par JD dans le projet Google Cloud
   `memory-bible-jd`, Google activé dans Supabase. Vérifié dans les journaux de Supabase : connexion Google
   réussie depuis https://memory-bible-jd.web.app à 14h17 (heure du serveur), progression sauvegardée
   (niveau 4). Le compte Google déjà présent depuis avril a reçu sa fiche joueur (créée à la main par SQL).
10. **Pause louange alimentée** (30/10/2026) : la première liste de JD (25 vidéos YouTube) est dans
    `src/lib/louanges.ts`. Extrait de 30 s depuis le début de chaque vidéo, sans récompense ; le titre et
    la chaîne s'affichent dans le lecteur YouTube. Proposée aussi tous les 3 niveaux réussis.
11. **Demandes de JD du 30/10/2026** :
    - alerte quand il reste 20 cœurs ou moins (une fois, puis à nouveau seulement après être remonté au-dessus de 20),
      avec un bouton vers le Bonus ;
    - Défi de la Parole : +15 ❤️ par bonne réponse, +5 si 3/3, soit jusqu'à +50 ❤️ ; il devient plus difficile à
      chaque défi réussi (2/3 ou mieux), et pose d'abord des questions jamais vues (suivi sur l'appareil) ;
    - renvoi vers la Bible : après un défi, la liste des passages à relire ; dans une partie, après 2 mauvaises
      réponses au même niveau, « Tu bloques ? Prends ta Bible et relis… » avec le passage de l'histoire.
    - Pause psaume : +9 ❤️ (inchangé). Pause louange YouTube : toujours sans récompense (règle de YouTube).
12. **Plus de questions, et la Bible en main** (demande de JD du 30/10/2026) :
    - 333 questions de détail ajoutées (`src/lib/bible/questions-details.ts`) : **553 questions** en tout, chacune
      avec son verset. Objectif de JD : environ 100 par histoire (3 100) ; à compléter par séries, en vérifiant
      chaque réponse dans la Louis Segond 1910.
    - Question pour passer au niveau : après une erreur, la **même question revient** (choix mélangés) et la bonne
      réponse n'est **pas montrée** ; le jeu dit où la trouver (« relis tout le chapitre Genèse 41 »), avec un lien
      « Lire Genèse 41 (Louis Segond) » vers bible.com et les liens de l'appli gratuite « Bible » (YouVersion)
      pour Android et iPhone. Chaque erreur coûte toujours 1 cœur.
    - Défi de la Parole : pas de réponse montrée non plus, même renvoi vers le chapitre, puis question suivante.
    - Liens : de simples liens vers une appli gratuite d'un autre éditeur, sans partenariat. À vérifier par JD
      sur son téléphone : qu'un lien « Lire … » ouvre bien la Louis Segond (version 93 de bible.com).
13. **Vie de Louange dans le jeu** (demande de JD du 30/10/2026) : une « Pause louange » sur deux présente le site
    https://vie-de-louange.web.app (bouton « Visiter le site Vie de Louange ») au lieu d'un chant ; après un chant, un
    lien « Découvre aussi notre site Vie de Louange » ; en bas de l'accueil, « Un projet Vie de Louange ». Courrier
    écrit au PC fixe (wiki, lettre 0054) pour ajouter Memory Bible à la page « Mes projets » (`/projets`) du site.
14. **Une progression par catégorie** (demande de JD du 30/10/2026, compte familial) : sur un même compte (ou un
    même appareil sans compte), Petits, Enfants et Ados & adultes ont chacun leur niveau, leurs vies, leur score,
    leur classement et la difficulté de leur Défi de la Parole. Les boutons « Qui joue ? » affichent le niveau de
    chacun (« Niveau 18 », « Nouveau »). Base : colonne `mode` dans `game_progress` (clé : joueur + catégorie) et
    `game_scores`. La progression déjà faite sur le compte familial a été rangée dans « Petits » (niveau 18).
15. **Trois jeux, les étoiles comme monnaie, et les petits sans YouTube** (demandes de JD du 01/11/2026) :
    - l'accueil propose 3 jeux : 🧠 Memory, 🔤 **Mots mêlés**, ✍️ **Versets à trous** (les deux derniers dès 7 ans) ;
    - **Mots mêlés** : on lit d'abord le résumé de l'histoire, puis on cherche ses mots dans la grille (toucher la
      première puis la dernière lettre). Les mots trouvés se colorent et se barrent dans la liste, avec leur verset.
      Des **mots pièges** d'autres histoires s'y cachent : en trouver un explique d'où il vient (« … n'est pas dans
      l'histoire de … On le trouve dans … : Apocalypse 5:1 »). Grilles plus grandes, plus de mots, sens plus variés et
      plus de pièges au fil des niveaux. Fin de grille : le verset de l'histoire et où lire chaque mot ;
    - **Versets à trous** : 42 versets clés (Louis Segond 1910 : Abraham, Moïse, Josué, David, Jésus…) à compléter
      avec une banque de mots ; plus de trous et plus de mots pièges au fil des niveaux. Une erreur → « Ouvre ta
      Bible à … » et un lien vers le chapitre ; jamais la réponse donnée ;
    - **étoiles** : 3 ⭐ = 3 ❤️ (Bonus → « Échanger des étoiles ») ; dans la question du Memory, 3 ⭐ barrent une
      mauvaise réponse ; dans les nouveaux jeux, 3 ⭐ donnent un indice. Les gains par niveau ne changent pas ;
    - **Petits (3-6 ans)** : plus de YouTube. À la place : le **labyrinthe « Rejoins Jésus »** (« Laissez venir à moi
      les petits enfants », Matthieu 19:14) : +9 ❤️ après 30 s, on peut continuer, les labyrinthes grandissent ; un
      lien vers « La Bible App pour les enfants » (bibleappforkids.com) ; le lien Vie de Louange reste. Message à
      l'accueil et dans le Bonus : les petits jouent avec un parent.
16. **Guide, écran d'accueil du téléphone, et gratuité totale** (demandes de JD du 01/11/2026) :
    - **guide du jeu** : à la première visite, de petites fenêtres montrent chaque bouton de l'accueil (qui joue,
      les 3 jeux, le Bonus, les étoiles, le classement, le compte si on n'est pas inscrit, l'écran d'accueil).
      On peut le passer, le revoir (« ❓ Guide du jeu ») et choisir s'il s'affiche à chaque ouverture (interrupteur
      « À l'ouverture », réglage gardé sur l'appareil) ;
    - **sur l'écran d'accueil** : le site est devenu une appli web installable (manifeste, icônes, petit service
      worker « réseau d'abord » pour rester à jour). Bouton « 📲 Mettre le jeu sur l'écran d'accueil » : sur Android,
      il ouvre directement la fenêtre d'installation de Chrome ; sur iPhone, il explique Partager → « Sur l'écran
      d'accueil ». Le bouton disparaît quand le jeu est ouvert depuis l'icône ;
    - **règle de JD : aucun argent dans l'appli**. Installation et jeu gratuits ; aucun achat, aucun abonnement,
      aucune publicité. Les vies se gagnent en jouant (Défi de la Parole, pause psaume, louange pour les grands,
      labyrinthe pour les petits) ; les étoiles se gagnent en réussissant des niveaux et ne s'achètent jamais.
      Le badge « Premium » hérité de l'ancien jeu a été retiré de l'accueil (la colonne `is_premium` reste en base,
      sans usage).
17. **Les petits (3-6 ans) restent sur le Memory** (décision de JD du 01/11/2026 : ils ne savent pas encore lire) :
    Mots mêlés et Versets à trous sont grisés pour les Petits (« dès 7 ans ») et ne s'ouvrent pas pour eux, même par
    erreur. Après certains niveaux du Memory, les Petits se voient proposer le labyrinthe « Rejoins Jésus » au lieu
    d'une pause louange YouTube (oubli corrigé : il restait là un chant YouTube). Pour eux, le Bonus = Défi de la
    Parole (questions simples, avec un parent), pause psaume, labyrinthe, lien « La Bible App pour les enfants »,
    Vie de Louange. Toujours le principe : les petits jouent avec un parent.
18. **Mots mêlés : la consigne bien visible** (retour de JD du 01/11/2026, versets à trous validés) : avant de
    commencer, la consigne « Touche la première lettre d'un mot, puis sa dernière lettre » est en gros, dans un cadre
    jaune, avec une démonstration animée (un doigt trouve TERRE). Sous la grille, un bouton rappelle la consigne
    (« Maintenant, touche la dernière lettre du mot » après la première lettre) et montre l'exemple si on le touche.
    La vidéo d'explication de JD (sa chaîne YouTube, https://youtu.be/VXRIjRRtgmU) s'ouvre dans le jeu avec le
    bouton « ▶️ Voir la vidéo d'explication » (avant de commencer, et sous la grille avec l'exemple). Mots mêlés :
    dès 7 ans seulement, donc pas de YouTube pour les petits. Identifiant de la vidéo : `src/lib/jeux.ts`.
19. **Mots mêlés : vérifier et passer au niveau suivant** (retour de JD du 01/11/2026) : un bouton « ✅ Vérifier ma
    grille » reste toujours en bas de l'écran. Avant la fin, il dit combien de mots il reste ; quand tous les mots
    sont barrés, il devient vert et clignote, puis ouvre la fenêtre « Grille validée ! » (étoiles gagnées, verset de
    l'histoire, où lire chaque mot) avec le bouton « Passer au niveau 2 → ». Compteur « 3 / 5 mots trouvés » sous la
    liste. Bug corrigé : dans environ 1 grille sur 7, un mot apparaissait deux fois par hasard et l'une des deux
    copies était refusée (« pas un mot de la liste ») ; maintenant le mot compte partout où il est écrit (test ajouté).
20. **Tout retrouver avec son compte** (demande de JD du 01/11/2026 : niveau des mots mêlés revenu à 1 sur un autre
    appareil) : les niveaux des Mots mêlés, des Versets à trous et du labyrinthe, et la progression du Défi de la
    Parole, sont maintenant gardés avec le compte, pour chaque catégorie (colonne `jeux` de `game_progress`,
    migration `20261101120000_niveaux_des_autres_jeux.sql`). Chaque niveau gagné part tout de suite sur le compte ;
    sur un autre appareil, à la connexion, le jeu garde le plus avancé des deux (jamais de retour en arrière).
    Les niveaux gagnés avant cette mise à jour sont sur l'appareil où ils ont été joués : il suffit d'ouvrir le jeu
    une fois sur cet appareil, connecté, pour qu'ils partent sur le compte. Tests ajoutés (`src/test/sauvegarde.test.ts`).
