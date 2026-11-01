// Put the website on the phone's home screen (icon that opens the game directly).
// Android / Chrome: the browser offers an install prompt, which we keep for our button.
// iPhone / Safari: no prompt exists, so we explain the steps (Share → Add to Home Screen).

import { Capacitor } from "@capacitor/core";

interface InvitationInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let invitation: InvitationInstallation | null = null;
const abonnes = new Set<() => void>();
const prevenir = () => abonnes.forEach((f) => f());

export function ecouterInstallation(): void {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    invitation = e as InvitationInstallation;
    prevenir();
  });
  window.addEventListener("appinstalled", () => {
    invitation = null;
    prevenir();
  });
}

export function suivreInstallation(f: () => void): () => void {
  abonnes.add(f);
  return () => abonnes.delete(f);
}

/** Already opened from the home screen icon (or inside the Android app): nothing to install */
export function dejaInstallee(): boolean {
  if (Capacitor.isNativePlatform()) return true;
  const nav = navigator as Navigator & { standalone?: boolean };
  return window.matchMedia?.("(display-mode: standalone)").matches || nav.standalone === true;
}

export type Appareil = "iphone" | "android" | "ordinateur";

export function appareil(): Appareil {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "iphone";
  if (/Android/i.test(ua)) return "android";
  return "ordinateur";
}

export const peutProposer = (): boolean => invitation !== null;

/** Opens the browser's own install window; returns true if the person accepted */
export async function proposerInstallation(): Promise<boolean> {
  if (!invitation) return false;
  const inv = invitation;
  await inv.prompt();
  const { outcome } = await inv.userChoice;
  invitation = null;
  prevenir();
  return outcome === "accepted";
}
