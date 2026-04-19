import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.memori.game",
  appName: "MEMORI",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    AdMob: {
      // Android App ID — à remplacer par le vrai ID AdMob
      appId: "ca-app-pub-2237336875852898~XXXXXXXXXX",
    },
  },
};

export default config;
