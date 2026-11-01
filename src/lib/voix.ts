// Lecture à voix haute (pour les petits qui ne savent pas encore lire).
// Utilise la synthèse vocale du téléphone ou du navigateur, quand elle existe.

export function voixDisponible(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Retire les emojis pour que la voix ne les lise pas. */
function sansEmoji(texte: string): string {
  return texte
    .replace(/\p{Extended_Pictographic}|[\u{1F1E6}-\u{1F1FF}]|\u{FE0F}|\u{20E3}|\u{200D}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function lireAVoixHaute(morceaux: string[]): void {
  if (!voixDisponible()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const texte = morceaux.map(sansEmoji).filter(Boolean).join(". ");
  const phrase = new SpeechSynthesisUtterance(texte);
  phrase.lang = "fr-FR";
  phrase.rate = 0.9;
  const voixFr = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("fr"));
  if (voixFr) phrase.voice = voixFr;
  synth.speak(phrase);
}

export function arreterVoix(): void {
  if (voixDisponible()) window.speechSynthesis.cancel();
}
