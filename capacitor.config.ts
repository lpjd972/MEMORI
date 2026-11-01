import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.memori.game",
  appName: "Memory Bible",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
