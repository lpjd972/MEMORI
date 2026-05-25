import { useCallback } from "react";
import { Capacitor } from "@capacitor/core";

// Vrais blocs "Récompensé" AdMob (production)
const REWARDED_ANDROID = "ca-app-pub-4559651446193139/6423895001";
const REWARDED_IOS = "ca-app-pub-4559651446193139/6423895001"; // TODO: bloc iOS dédié si app iOS

// Test IDs utilisés en dev (Google officiels)
const TEST_REWARDED_ANDROID = "ca-app-pub-3940256099942544/5224354917";
const TEST_REWARDED_IOS = "ca-app-pub-3940256099942544/1712485313";

export function useAdMob() {
  const isNative = Capacitor.isNativePlatform();

  const showRewardedAd = useCallback(async (onRewarded: () => void) => {
    if (!isNative) {
      // Fallback web : la vraie pub AdSense s'affiche dans PubsTab via AdBanner
      onRewarded();
      return;
    }

    try {
      const { AdMob, RewardAdPluginEvents } = await import("@capacitor-community/admob");

      const isAndroid = Capacitor.getPlatform() === "android";
      const isProd = import.meta.env.PROD;
      const adId = isProd
        ? (isAndroid ? REWARDED_ANDROID : REWARDED_IOS)
        : (isAndroid ? TEST_REWARDED_ANDROID : TEST_REWARDED_IOS);

      await AdMob.prepareRewardVideoAd({
        adId,
        isTesting: !isProd,
      });

      AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        onRewarded();
      });

      await AdMob.showRewardVideoAd();
    } catch (e) {
      console.error("AdMob error:", e);
      // Fallback si AdMob échoue
      onRewarded();
    }
  }, [isNative]);

  return { isNative, showRewardedAd };
}
