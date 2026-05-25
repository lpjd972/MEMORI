import { Composition, registerRoot } from "remotion";
import { MemoriAd } from "./MemoriAd";

const RemotionRoot = () => {
  return (
    <Composition
      id="MemoriAd"
      component={MemoriAd}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};

registerRoot(RemotionRoot);
