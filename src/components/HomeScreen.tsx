import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import { MODES, MODES_ORDER, STATS, getLevelConfig, type ModeAge } from "@/lib/gameData";
import { INITIAL_LIVES } from "@/hooks/useGameState";
import { Switch } from "@/components/ui/switch";
import InstallerAppli from "./InstallerAppli";
import Tutoriel from "./Tutoriel";
import { ecrireGuideAuto, lireGuideAuto, premiereVisite, type EtapeGuide } from "@/lib/tutoriel";

/** The guide opens by itself only once per visit, not each time the player comes back to the home screen */
let guideDejaOuvert = false;

interface HomeScreenProps {
  onStart: () => void;
  mode: ModeAge;
  onModeChange: (mode: ModeAge) => void;
  currentLevel: number;
  /** Level reached in each age category (each family member has their own progress) */
  levels: Partial<Record<ModeAge, number>>;
  onRestart: () => void;
  onBonus: () => void;
  /** The two other games: word search and fill-in-the-blank verses */
  onJeu: (jeu: "mots-meles" | "versets") => void;
  user?: User | null;
  profile?: { display_name: string | null } | null;
  onAuthClick?: () => void;
  onSignOut?: () => void;
  onLeaderboard?: () => void;
}

const HomeScreen = ({
  onStart,
  mode,
  onModeChange,
  currentLevel,
  levels,
  onRestart,
  onBonus,
  onJeu,
  user,
  profile,
  onAuthClick,
  onSignOut,
  onLeaderboard,
}: HomeScreenProps) => {
  const current = getLevelConfig(currentLevel, mode);
  /** Mots mêlés and Versets à trous need reading: the little ones (3-6) only play Memory */
  const petits = mode === "petits";
  const [guideAuto, setGuideAuto] = useState(() => !premiereVisite() && lireGuideAuto());
  const [etapesGuide, setEtapesGuide] = useState<EtapeGuide[] | null>(null);

  const ouvrirGuide = useCallback(() => {
    const etapes: EtapeGuide[] = [
      {
        titre: "👋 Bienvenue dans Memory Bible !",
        texte:
          "3 jeux pour découvrir la Parole de Dieu (Bible Louis Segond 1910), de 3 à 99 ans. Tout est gratuit : pas de publicité, rien à acheter.",
      },
      {
        cible: "qui-joue",
        titre: "Qui joue ?",
        texte:
          "Choisis ta catégorie : Petits (3-6 ans, avec un parent), Enfants (7-12 ans) ou Ados & adultes. Chacun garde son propre niveau, même sur un seul téléphone.",
      },
      {
        cible: "memory",
        titre: "🧠 Jeu 1 : le Memory",
        texte:
          "Retourne les cartes deux par deux pour trouver les paires. Ensuite, une question sur l'histoire ouvre le niveau suivant. Une erreur ? Le jeu te dit quel chapitre de la Bible relire.",
      },
      {
        cible: "mots-meles",
        titre: "🔤 Jeu 2 : les mots mêlés",
        texte: `Lis l'histoire, puis retrouve ses mots dans la grille : touche la première lettre, puis la dernière. Attention aux mots pièges venus d'autres histoires !${
          petits ? " Ce jeu est pour ceux qui savent lire (dès 7 ans) : les petits jouent au Memory." : ""
        }`,
      },
      {
        cible: "versets",
        titre: "✍️ Jeu 3 : les versets à trous",
        texte: `Complète les grands versets de la Bible avec les bons mots. Une erreur ? Ouvre ta Bible au bon passage.${
          petits ? " Ce jeu aussi est pour ceux qui savent lire (dès 7 ans)." : ""
        }`,
      },
      {
        cible: "bonus",
        titre: "🎁 Gagner des vies",
        texte: petits
          ? "Plus de cœurs ? Le Défi de la Parole (des questions simples, à faire avec papa ou maman), le labyrinthe « Rejoins Jésus » et la pause psaume."
          : "Plus de cœurs ? Le Défi de la Parole (jusqu'à +50 ❤️), la pause psaume (+9 ❤️) et les pauses louange.",
      },
      {
        titre: "⭐ Les étoiles",
        texte:
          "Tu gagnes des étoiles en réussissant les niveaux. Échange-les contre un indice (3 ⭐) ou contre des vies (3 ⭐ = 3 ❤️). Elles se gagnent seulement en jouant, jamais avec de l'argent.",
      },
      { cible: "classement", titre: "🏆 Le classement", texte: "Compare ton score avec les autres joueurs de ta catégorie." },
      user
        ? { titre: "👋 Tu es connecté", texte: "Ta progression est sauvegardée : tu la retrouves sur tous tes appareils." }
        : {
            cible: "connexion",
            titre: "🔐 Le compte (facultatif)",
            texte:
              "Tu n'es pas encore inscrit. Tu peux jouer sans compte : ta progression reste sur ce téléphone. Avec un compte gratuit, tu la retrouves sur tous tes appareils et tu apparais au classement.",
          },
      {
        cible: "installer",
        titre: "📲 Sur l'écran d'accueil",
        texte: "Mets Memory Bible sur l'écran d'accueil de ton téléphone : une icône ouvrira le jeu directement.",
      },
      {
        cible: "guide",
        titre: "❓ Revoir le guide",
        texte: "Tu peux revoir ce guide quand tu veux, et choisir s'il s'affiche à chaque ouverture du jeu.",
      },
    ];
    // skip the steps whose button is not on screen (already installed, no leaderboard…)
    setEtapesGuide(etapes.filter((e) => !e.cible || document.querySelector(`[data-tuto="${e.cible}"]`)));
  }, [petits, user]);

  useEffect(() => {
    if (guideDejaOuvert || !(premiereVisite() || lireGuideAuto())) return;
    guideDejaOuvert = true;
    const t = setTimeout(ouvrirGuide, 900); // after the home screen animation
    return () => clearTimeout(t);
  }, [ouvrirGuide]);

  const changerGuideAuto = (v: boolean) => {
    setGuideAuto(v);
    ecrireGuideAuto(v);
  };

  const finirGuide = () => {
    ecrireGuideAuto(guideAuto);
    setEtapesGuide(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 gap-6">
      <motion.div
        className="flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-7xl"
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          📖
        </motion.div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">Memory Bible</h1>
        <p className="text-base font-bold text-primary text-center">La Parole de Dieu, de la Genèse à l'Apocalypse</p>
      </motion.div>

      {user && profile && (
        <motion.div
          className="flex items-center gap-2 bg-card rounded-full px-4 py-2 shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-lg">👋</span>
          <span className="font-bold text-foreground text-sm">{profile.display_name ?? "Joueur"}</span>
        </motion.div>
      )}

      <motion.div
        data-tuto="qui-joue"
        className="w-full max-w-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs font-bold text-muted-foreground mb-2 text-center">Qui joue ?</p>
        <div className="grid grid-cols-3 gap-2">
          {MODES_ORDER.map((m) => (
            <button
              key={m}
              onClick={() => onModeChange(m)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 border-2 transition-colors ${
                mode === m ? "border-primary bg-primary/10" : "border-border bg-card"
              }`}
              aria-pressed={mode === m}
            >
              <span className="text-2xl">{MODES[m].emoji}</span>
              <span className="text-xs font-extrabold text-foreground leading-tight text-center">{MODES[m].label}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">{MODES[m].ages}</span>
              <span className="text-[10px] font-bold text-primary">
                {(m === mode ? currentLevel : levels[m] ?? 1) > 1
                  ? `Niveau ${m === mode ? currentLevel : levels[m]}`
                  : "Nouveau"}
              </span>
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">{MODES[mode].description}</p>
        {mode === "petits" && (
          <p className="text-xs font-bold text-primary mt-1 text-center">
            👨‍👩‍👧 Les petits jouent avec un parent : les écrans, c'est ensemble !
          </p>
        )}
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          data-tuto="memory"
          className="w-full game-gradient text-primary-foreground font-extrabold py-4 rounded-xl shadow-lg text-lg"
          onClick={onStart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          🧠 Memory · {currentLevel > 1 ? `continuer niveau ${currentLevel}` : "jouer"}
        </motion.button>
        {currentLevel > 1 && <p className="text-xs text-muted-foreground -mt-1">{current.label}</p>}

        <div className="grid grid-cols-2 gap-2 w-full">
          <motion.button
            data-tuto="mots-meles"
            className="bg-card text-foreground font-bold py-3 rounded-xl shadow-sm border border-border disabled:opacity-40"
            onClick={() => onJeu("mots-meles")}
            disabled={petits}
            whileTap={{ scale: 0.97 }}
          >
            🔤 Mots mêlés
            {petits && <span className="block text-[10px] font-semibold">dès 7 ans</span>}
          </motion.button>
          <motion.button
            data-tuto="versets"
            className="bg-card text-foreground font-bold py-3 rounded-xl shadow-sm border border-border disabled:opacity-40"
            onClick={() => onJeu("versets")}
            disabled={petits}
            whileTap={{ scale: 0.97 }}
          >
            ✍️ Versets à trous
            {petits && <span className="block text-[10px] font-semibold">dès 7 ans</span>}
          </motion.button>
        </div>

        <motion.button
          data-tuto="bonus"
          className="w-full bg-card text-foreground font-bold py-3 rounded-xl shadow-sm border border-border"
          onClick={onBonus}
          whileTap={{ scale: 0.97 }}
        >
          🎁 Bonus : Défi de la Parole & {petits ? "labyrinthe" : "louange"}
        </motion.button>

        {onLeaderboard && (
          <motion.button
            data-tuto="classement"
            className="w-full bg-card text-foreground font-bold py-3 rounded-xl shadow-sm border border-border"
            onClick={onLeaderboard}
            whileTap={{ scale: 0.97 }}
          >
            🏆 Classement
          </motion.button>
        )}

        {!user && onAuthClick && (
          <motion.button
            data-tuto="connexion"
            className="w-full bg-muted text-foreground font-bold py-3 rounded-xl"
            onClick={onAuthClick}
            whileTap={{ scale: 0.97 }}
          >
            🔐 Se connecter (facultatif)
          </motion.button>
        )}

        <InstallerAppli />

        <div data-tuto="guide" className="flex items-center justify-between w-full bg-card/60 rounded-xl px-3 py-2">
          <button onClick={ouvrirGuide} className="text-sm font-bold text-primary">
            ❓ Guide du jeu
          </button>
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            À l'ouverture
            <Switch checked={guideAuto} onCheckedChange={changerGuideAuto} aria-label="Afficher le guide à l'ouverture" />
          </label>
        </div>

        <div className="flex items-center gap-4 mt-1">
          {currentLevel > 1 && (
            <button onClick={onRestart} className="text-xs text-muted-foreground font-semibold underline">
              Recommencer « {MODES[mode].label} » depuis la Genèse
            </button>
          )}
          {user && onSignOut && (
            <button onClick={onSignOut} className="text-xs text-muted-foreground font-semibold">
              Déconnexion
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-muted-foreground text-sm font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <span>❤️ {INITIAL_LIVES} vies</span>
        <span>📜 {STATS.histoires} histoires</span>
        <span>❓ {STATS.questions} questions</span>
      </motion.div>
      <p className="text-[11px] text-muted-foreground text-center max-w-xs -mt-3">
        Un projet{" "}
        <a href="https://vie-de-louange.web.app" target="_blank" rel="noreferrer" className="underline">
          Vie de Louange
        </a>{" "}
        · Versets cités : Bible Louis Segond 1910 ·{" "}
        <a href="/privacy" className="underline">
          Confidentialité
        </a>
      </p>

      {etapesGuide && (
        <Tutoriel etapes={etapesGuide} auto={guideAuto} onAutoChange={changerGuideAuto} onFin={finirGuide} />
      )}
    </div>
  );
};

export default HomeScreen;
