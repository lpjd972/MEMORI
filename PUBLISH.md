# Publier MEMORI sur le Google Play Store

Guide pas-à-pas. MEMORI est une app web (React/Vite) emballée avec **Capacitor**.
Tu génères un fichier **`.aab`** (Android App Bundle) signé, puis tu l'uploades
sur le Play Store.

> Les étapes 1, 2, 3 et 6 ne peuvent être faites que par toi (compte, paiement,
> clé secrète, upload). Le reste est automatisable.

---

## Prérequis

- **Node.js** + **npm** (ou bun) installés
- **Android Studio** (inclut le SDK Android) → https://developer.android.com/studio
- **Java JDK 17+** (fourni par Android Studio)

---

## 1. Compte Google Play Console (25 $, une seule fois)

1. Va sur https://play.google.com/console
2. Crée un compte développeur (frais uniques de **25 $**).
3. Choisis un compte **personnel** ou **organisation** (organisation = vérification d'entreprise).

## 2. Configurer AdMob (sinon risque de suspension)

L'app contient un **faux** ID AdMob (`...~XXXXXXXXXX`). Il **doit** être remplacé.

1. Va sur https://apps.admob.com → crée l'app **MEMORI** (Android).
2. Récupère l'**App ID** (`ca-app-pub-XXXX~YYYY`) et crée tes **blocs publicitaires** (banner, interstitiel).
3. Remplace les placeholders dans :
   - `capacitor.config.ts` → champ `AdMob.appId`
   - `android/app/src/main/AndroidManifest.xml` → meta-data `com.google.android.gms.ads.APPLICATION_ID`
   - le code qui charge les blocs pub (cherche les IDs dans `src/`)

## 3. Générer ta clé de signature (keystore) — À GARDER PRÉCIEUSEMENT

> ⚠️ Si tu perds ce fichier ou son mot de passe, tu ne pourras **plus jamais**
> mettre à jour l'app. Sauvegarde-le hors du projet (gestionnaire de mots de passe,
> disque chiffré). Il ne doit **jamais** être committé dans Git.

Depuis le dossier `android/` :

```sh
keytool -genkey -v -keystore memori.keystore -alias memori \
  -keyalg RSA -keysize 2048 -validity 10000
```

Puis crée `android/keystore.properties` à partir de l'exemple fourni :

```sh
cp keystore.properties.example keystore.properties
```

…et remplis-le avec tes vrais mots de passe. Le `build.gradle` lit ce fichier
automatiquement et signe le build release.

## 4. Construire le bundle (.aab)

Depuis la racine du projet :

```sh
npm install
npm run build          # construit le site web dans dist/
npx cap sync android   # copie dist/ dans le projet Android
```

Puis génère le bundle signé. **Option A — ligne de commande :**

```sh
cd android
./gradlew bundleRelease
# Résultat : android/app/build/outputs/bundle/release/app-release.aab
```

**Option B — Android Studio :**

```sh
npx cap open android
```
Puis menu **Build > Generate Signed Bundle / APK > Android App Bundle**.

## 5. Préparer la fiche Play Store

Sur la Play Console, crée l'application et remplis :

- **Titre** : MEMORI (30 caractères max)
- **Description courte** (80 car.) + **description complète** (4000 car.)
- **Icône** : 512×512 px PNG
- **Image de présentation** : 1024×500 px
- **Captures d'écran** : au moins 2 (téléphone)
- **Politique de confidentialité** : une URL est **obligatoire** (l'app utilise pubs + Supabase/login)
- **Classification du contenu** : remplis le questionnaire
- **Sécurité des données** (Data safety) : déclare la collecte (compte, pub) — obligatoire
- **Public cible** et déclaration **publicités** : coche « contient des annonces »

## 6. Uploader et publier

1. Crée une version dans **Production** (ou commence par **Test interne**, recommandé).
2. Uploade le fichier `app-release.aab`.
3. Soumets pour examen. Le **premier examen** prend généralement quelques jours
   (les nouveaux comptes personnels demandent parfois 20 testeurs pendant 14 jours
   avant la prod publique).

---

## Mettre à jour l'app plus tard

À chaque nouvelle version, incrémente dans `android/app/build.gradle` :

```gradle
versionCode 2        // +1 à chaque upload
versionName "1.1"    // version visible par l'utilisateur
```

Puis refais les étapes 4 et 6 avec **le même keystore**.

---

## Alternative rapide : PWA / TWA

Comme MEMORI est déjà un site web, tu peux aussi le publier via
[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) (TWA) si tu héberges
le site (déjà sur Vercel d'après `vercel.json`). Mais le projet Capacitor actuel
est déjà prêt — suis ce guide.
