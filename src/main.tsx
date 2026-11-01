import { createRoot } from "react-dom/client";
import { Capacitor } from "@capacitor/core";
import App from "./App.tsx";
import "./index.css";
import { ecouterInstallation } from "./lib/installation";

ecouterInstallation();

// Service worker: lets the site be installed on the home screen (not needed inside the Android app)
if (import.meta.env.PROD && "serviceWorker" in navigator && !Capacitor.isNativePlatform()) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // pas grave : le site marche aussi sans
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
