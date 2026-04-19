import { useCallback } from "react";
import { Capacitor } from "@capacitor/core";

// IDs AdMob — remplacer par les vrais IDs après création dans AdMob console
const ADMOB_INTERSTITIAL_ID = Capacitor.getPlatform() === "android"
  ? "ca-app-pub-2237336875852898/XXXXXXXXXX"   // Android interstitiel
  : "ca-app-pub-2237336875852898/XXXXXXXXXX";   // iOS interstitiel

// Test IDs utilisés en dev (Google officiels)
const TEST_INTERSTITIAL_ANDROID = "ca-app-pub-3940256099942544/1033173712";
const TEST_INTERSTITIAL_IOS = "ca-app-pub-3940256099942544/4411468910";

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

      const adId = Capacitor.getPlatform() === "android"
        ? TEST_INTERSTITIAL_ANDROID
        : TEST_INTERSTITIAL_IOS;

      await AdMob.prepareRewardVideoAd({
        adId,
        isTesting: true, // mettre false en prod
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
