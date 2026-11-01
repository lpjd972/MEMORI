import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { appareil, dejaInstallee, peutProposer, proposerInstallation, suivreInstallation } from "@/lib/installation";

/** Home screen button: put Memory Bible on the phone's home screen, with the steps for each phone */
const InstallerAppli = () => {
  const [, rafraichir] = useState(0);
  const [ouvert, setOuvert] = useState(false);
  const [installee, setInstallee] = useState(dejaInstallee);

  useEffect(() => suivreInstallation(() => rafraichir((n) => n + 1)), []);

  if (installee) return null;

  const cliquer = async () => {
    if (peutProposer()) {
      if (await proposerInstallation()) setInstallee(true);
      return;
    }
    setOuvert(true);
  };

  const quel = appareil();
  return (
    <>
      <motion.button
        data-tuto="installer"
        className="w-full bg-card text-foreground font-bold py-3 rounded-xl shadow-sm border border-dashed border-primary/50"
        onClick={cliquer}
        whileTap={{ scale: 0.97 }}
      >
        📲 Mettre le jeu sur l'écran d'accueil
      </motion.button>

      <AnimatePresence>
        {ouvert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOuvert(false)}
          >
            <motion.div
              className="bg-card rounded-2xl p-5 shadow-xl w-full max-w-sm"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-label="Mettre le jeu sur l'écran d'accueil"
            >
              <p className="text-lg font-extrabold text-foreground">📲 Sur l'écran d'accueil</p>
              <p className="text-sm text-muted-foreground mt-1">
                Une icône Memory Bible ouvre le jeu directement, sans chercher le lien. C'est gratuit.
              </p>
              <ol className="text-sm text-foreground mt-3 space-y-2 list-decimal pl-5">
                {quel === "iphone" ? (
                  <>
                    <li>Ouvre ce site avec <strong>Safari</strong>.</li>
                    <li>
                      Touche le bouton <strong>Partager</strong> (le carré avec une flèche vers le haut ⬆️), en bas de l'écran.
                    </li>
                    <li>
                      Choisis <strong>« Sur l'écran d'accueil »</strong>, puis <strong>Ajouter</strong>.
                    </li>
                  </>
                ) : quel === "android" ? (
                  <>
                    <li>
                      Touche les <strong>trois petits points ⋮</strong> en haut à droite du navigateur (Chrome).
                    </li>
                    <li>
                      Choisis <strong>« Ajouter à l'écran d'accueil »</strong> ou <strong>« Installer l'application »</strong>.
                    </li>
                    <li>Confirme : l'icône Memory Bible apparaît sur ton écran d'accueil.</li>
                  </>
                ) : (
                  <>
                    <li>
                      Dans Chrome ou Edge, clique sur l'icône <strong>Installer</strong> à droite de la barre d'adresse, ou sur
                      les <strong>trois petits points ⋮</strong> puis « Installer Memory Bible ».
                    </li>
                    <li>Sur un téléphone, ouvre ce site et suis les mêmes étapes dans le menu du navigateur.</li>
                  </>
                )}
              </ol>
              <button
                onClick={() => setOuvert(false)}
                className="w-full game-gradient text-primary-foreground font-bold py-3 rounded-xl mt-5"
              >
                J'ai compris
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstallerAppli;
