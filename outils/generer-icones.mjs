// Génère le logo et les icônes Android de Memory Bible à partir de public/logo.svg.
// Lancer depuis la racine du projet : node outils/generer-icones.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync("public/logo.svg", "utf8");
const res = "android/app/src/main/res";
const fond = "#18224D";

// Le dessin seul, sur fond transparent (premier plan de l'icône adaptative Android)
const dessin = svg.replace(/<rect width="100" height="100" rx="22" fill="url\(#fond\)"\/>/, "");
// Le logo sans coins arrondis (Android découpe lui-même l'icône)
const carre = svg.replace('rx="22" ', "");

const png = (source, size) => sharp(Buffer.from(source), { density: 600 }).resize(size, size).png();

await png(svg, 512).toFile("public/logo.png");
await sharp(Buffer.from(carre), { density: 600 }).resize(512, 512).jpeg({ quality: 92 }).toFile("public/logo.jpg");

const densites = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [d, size] of Object.entries(densites)) {
  await png(carre, size).toFile(`${res}/mipmap-${d}/ic_launcher.png`);
  await png(svg, size).toFile(`${res}/mipmap-${d}/ic_launcher_round.png`);
  // Premier plan adaptatif : 108 dp, dessin dans la zone sûre centrale (66 %)
  const full = Math.round(size * 2.25);
  const inner = Math.round(full * 0.62);
  const motif = await png(dessin, inner).toBuffer();
  await sharp({ create: { width: full, height: full, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: motif, gravity: "center" }])
    .png()
    .toFile(`${res}/mipmap-${d}/ic_launcher_foreground.png`);
}

// Écrans de démarrage : fond bleu nuit, logo au centre
const splashes = {
  drawable: [480, 320],
  "drawable-land-mdpi": [480, 320], "drawable-land-hdpi": [800, 480], "drawable-land-xhdpi": [1280, 720],
  "drawable-land-xxhdpi": [1600, 960], "drawable-land-xxxhdpi": [1920, 1280],
  "drawable-port-mdpi": [320, 480], "drawable-port-hdpi": [480, 800], "drawable-port-xhdpi": [720, 1280],
  "drawable-port-xxhdpi": [960, 1600], "drawable-port-xxxhdpi": [1280, 1920],
};
for (const [dir, [w, h]] of Object.entries(splashes)) {
  const logo = await png(dessin, Math.round(Math.min(w, h) * 0.45)).toBuffer();
  await sharp({ create: { width: w, height: h, channels: 4, background: fond } })
    .composite([{ input: logo, gravity: "center" }])
    .png()
    .toFile(`${res}/${dir}/splash.png`);
}
console.log("Icônes générées.");
