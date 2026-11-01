import { useState } from "react";

interface VideoTutoProps {
  youtubeId: string;
  libelle?: string;
}

/** Button that opens JD's explanation video (YouTube, privacy-enhanced mode) right inside the game */
const VideoTuto = ({ youtubeId, libelle = "▶️ Voir la vidéo d'explication" }: VideoTutoProps) => {
  const [ouverte, setOuverte] = useState(false);
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <button
        onClick={() => setOuverte((o) => !o)}
        className="w-full text-sm font-extrabold bg-red-600 text-white px-4 py-3 rounded-xl shadow-sm"
        aria-expanded={ouverte}
      >
        {ouverte ? "✕ Fermer la vidéo" : libelle}
      </button>
      {ouverte && (
        <div className="w-full flex justify-center">
          <iframe
            className="rounded-xl bg-black"
            style={{ height: "min(70vh, 560px)", aspectRatio: "9 / 16", maxWidth: "100%" }}
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title="Vidéo d'explication des mots mêlés"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default VideoTuto;
