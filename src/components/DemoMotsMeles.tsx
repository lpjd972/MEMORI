import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Petite démonstration animée : un doigt touche la première lettre de TERRE, puis la dernière,
// le mot se colore et se barre dans la liste. Elle tourne en boucle.
const LIGNES = ["AMORS", "TERRE", "LICPU"];
const CASE = 36;
const ECART = 4;
const PAS = CASE + ECART;
const ETAPES = 6;

const DemoMotsMeles = () => {
  const [etape, setEtape] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setEtape((e) => (e + 1) % ETAPES), 1000);
    return () => clearInterval(t);
  }, []);

  const trouve = etape >= 3;
  const doigt = etape === 0 ? null : etape === 1 ? 0 : etape >= 2 ? 4 : null;
  const legende =
    etape <= 1 ? "1. Touche la première lettre : T" : etape === 2 ? "2. Puis la dernière lettre : E" : "3. Le mot TERRE est trouvé !";

  return (
    <div className="flex flex-col items-center gap-2 bg-muted/60 rounded-xl p-3" aria-label="Démonstration : comment trouver un mot">
      <div className="relative" style={{ width: 5 * PAS - ECART, height: 3 * PAS - ECART }}>
        {LIGNES.map((ligne, l) =>
          ligne.split("").map((lettre, c) => {
            const dansMot = l === 1;
            const touche = dansMot && ((etape >= 1 && c === 0) || (etape >= 2 && c === 4));
            return (
              <div
                key={`${l}-${c}`}
                className={`absolute rounded-md font-extrabold flex items-center justify-center text-base transition-colors ${
                  dansMot && trouve
                    ? "bg-emerald-300 text-slate-900"
                    : touche
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground"
                }`}
                style={{ width: CASE, height: CASE, left: c * PAS, top: l * PAS }}
              >
                {lettre}
              </div>
            );
          })
        )}
        {doigt !== null && !trouve && (
          <motion.span
            className="absolute text-3xl pointer-events-none"
            initial={false}
            animate={{ left: doigt * PAS + 14, top: PAS + 18 }}
            transition={{ duration: 0.5 }}
          >
            👆
          </motion.span>
        )}
      </div>
      <p className="text-sm font-bold text-foreground">{legende}</p>
      <span
        className={`text-sm font-bold px-2 py-1 rounded-lg ${trouve ? "bg-emerald-300 text-slate-900 line-through" : "bg-card text-foreground"}`}
      >
        Terre
      </span>
    </div>
  );
};

export default DemoMotsMeles;
