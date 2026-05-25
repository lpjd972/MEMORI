import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from "remotion";

// ── Helpers ──────────────────────────────────────────────────────────────────

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useFade(from: number, to: number, reversed = false) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [from, to], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  return reversed ? 1 - progress : progress;
}

function useSpring(frame: number, delay = 0, stiffness = 120) {
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { stiffness, damping: 20 } });
}

// ── Background ────────────────────────────────────────────────────────────────

const BG = () => (
  <AbsoluteFill style={{ background: "linear-gradient(160deg,#0a0010 0%,#030305 50%,#000d1a 100%)" }}>
    {/* Grid */}
    <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.06 }}>
      <defs>
        <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#00F0FF" strokeWidth="0.8" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
    {/* Glow purple */}
    <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle,#B000FF33 0%,transparent 70%)", top: -200, left: -100 }} />
    {/* Glow cyan */}
    <div style={{ position: "absolute", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle,#00F0FF22 0%,transparent 70%)", bottom: 200, right: -200 }} />
  </AbsoluteFill>
);

// ── Particles ─────────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  x: (i * 67 + 120) % 1080,
  y: (i * 113 + 80) % 1920,
  size: 3 + (i % 4),
  color: i % 2 === 0 ? "#B000FF" : "#00F0FF",
  speed: 0.4 + (i % 3) * 0.2,
}));

const Particles = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: p.x,
            top: (p.y + frame * p.speed) % 1920,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: 0.6,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ── Logo SVG ──────────────────────────────────────────────────────────────────

const Logo = ({ size = 260 }: { size?: number }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible" }}>
    <defs>
      <linearGradient id="ng" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#B000FF" />
        <stop offset="45%" stopColor="#5B3CFF" />
        <stop offset="100%" stopColor="#00F0FF" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      <path d="M28 20A4 4 0 0 0 20 23L14 65A4 4 0 0 0 17 70L32 75A4 4 0 0 0 37 72L43 30A4 4 0 0 0 40 25Z" fill="url(#ng)" fillOpacity="0.15" stroke="url(#ng)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M72 20A4 4 0 0 1 80 23L86 65A4 4 0 0 1 83 70L68 75A4 4 0 0 1 63 72L57 30A4 4 0 0 1 60 25Z" fill="url(#ng)" fillOpacity="0.15" stroke="url(#ng)" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="36" y="12" width="28" height="66" rx="5" fill="url(#ng)" fillOpacity="0.2" stroke="url(#ng)" strokeWidth="3" />
      <path d="M12 55L26 55L36 45L50 52L64 45L74 55L88 55" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <circle cx="50" cy="52" r="3" fill="#fff" />
      <circle cx="26" cy="55" r="2" fill="#00F0FF" />
      <circle cx="74" cy="55" r="2" fill="#B000FF" />
      <line x1="42" y1="25" x2="58" y2="25" stroke="url(#ng)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="42" y1="35" x2="58" y2="35" stroke="url(#ng)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="46" y1="65" x2="54" y2="65" stroke="url(#ng)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </g>
  </svg>
);

// ── Memory Card ───────────────────────────────────────────────────────────────

const MemCard = ({ emoji, revealed, delay, frame }: { emoji: string; revealed: boolean; delay: number; frame: number }) => {
  const { fps } = useVideoConfig();
  const scale = spring({ frame: frame - delay, fps, config: { stiffness: 200, damping: 18 } });
  return (
    <div style={{
      width: 180, height: 220, borderRadius: 24,
      background: revealed ? "linear-gradient(135deg,#1a003a,#00152a)" : "linear-gradient(135deg,#0d0020,#000d1a)",
      border: `2.5px solid ${revealed ? "#B000FF" : "#ffffff22"}`,
      boxShadow: revealed ? "0 0 30px #B000FF88, 0 0 60px #B000FF44" : "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 72,
      transform: `scale(${scale})`,
      transition: "all 0.3s",
    }}>
      {revealed ? emoji : "?"}
    </div>
  );
};

// ── Stat Badge ────────────────────────────────────────────────────────────────

const StatBadge = ({ icon, value, label, delay, frame }: { icon: string; value: string; label: string; delay: number; frame: number }) => {
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { stiffness: 160, damping: 18 } });
  const opacity = interpolate(frame - delay, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 28,
      background: "linear-gradient(135deg,rgba(176,0,255,0.12),rgba(0,240,255,0.08))",
      border: "1.5px solid rgba(255,255,255,0.12)",
      borderRadius: 32, padding: "28px 48px",
      transform: `scale(${s}) translateX(${interpolate(s, [0, 1], [60, 0])}px)`,
      opacity,
      backdropFilter: "blur(8px)",
    }}>
      <span style={{ fontSize: 60 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 56, fontWeight: 900, background: "linear-gradient(90deg,#B000FF,#00F0FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", marginTop: 4, fontWeight: 600 }}>{label}</div>
      </div>
    </div>
  );
};

// ── Scene 1 : Intro Logo (0–120f = 0–4s) ─────────────────────────────────────

const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame, fps, config: { stiffness: 100, damping: 16 } });
  const titleOpacity = interpolate(frame, [30, 55], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [30, 55], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subOpacity = interpolate(frame, [55, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineWidth = interpolate(frame, [80, 110], [0, 520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
      <div style={{ transform: `scale(${logoScale})`, filter: "drop-shadow(0 0 40px #B000FF) drop-shadow(0 0 80px #00F0FF44)" }}>
        <Logo size={320} />
      </div>
      <div style={{ opacity: titleOpacity, transform: `translateY(${titleY}px)`, textAlign: "center" }}>
        <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: 16, color: "#fff", fontFamily: "system-ui,sans-serif", textShadow: "0 0 40px #00F0FF88" }}>
          MEMOR<span style={{ color: "#00F0FF" }}>I</span>
        </div>
      </div>
      <div style={{ opacity: subOpacity, textAlign: "center" }}>
        <div style={{ fontSize: 36, color: "rgba(255,255,255,0.55)", letterSpacing: 8, fontWeight: 600, fontFamily: "system-ui,sans-serif", textTransform: "uppercase" }}>
          Le Jeu de Mémoire Ultime
        </div>
        <div style={{ marginTop: 20, height: 2, background: "linear-gradient(90deg,transparent,#B000FF,#00F0FF,transparent)", width: lineWidth, margin: "20px auto 0" }} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2 : Cards reveal (120–240f = 4–8s) ─────────────────────────────────

const SceneCards = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const CARDS = [
    { emoji: "🦁", revealed: frame > 30 },
    { emoji: "🌙", revealed: frame > 50 },
    { emoji: "⚡", revealed: frame > 70 },
    { emoji: "🦋", revealed: frame > 55 },
    { emoji: "🔮", revealed: frame > 40 },
    { emoji: "🎯", revealed: frame > 65 },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60 }}>
      <div style={{ opacity: titleOpacity, textAlign: "center" }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: "#fff", fontFamily: "system-ui,sans-serif", letterSpacing: 4 }}>
          Mémorise. Révèle.
        </div>
        <div style={{ fontSize: 38, color: "#00F0FF", fontWeight: 700, marginTop: 12, fontFamily: "system-ui,sans-serif" }}>
          Bat tous les records.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
        {CARDS.map((c, i) => (
          <MemCard key={i} emoji={c.emoji} revealed={c.revealed} delay={20 + i * 10} frame={frame} />
        ))}
      </div>

      <div style={{
        background: "linear-gradient(90deg,#B000FF,#00F0FF)",
        borderRadius: 60, padding: "20px 60px",
        fontSize: 36, fontWeight: 900, color: "#fff",
        fontFamily: "system-ui,sans-serif",
        opacity: interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        boxShadow: "0 0 40px #B000FF88",
      }}>
        + de 500 niveaux
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3 : Stats (240–360f = 8–12s) ───────────────────────────────────────

const SceneStats = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const STATS = [
    { icon: "🧠", value: "∞", label: "Niveaux infinis", delay: 10 },
    { icon: "🏆", value: "#1", label: "Classement mondial", delay: 25 },
    { icon: "❤️", value: "100", label: "Vies au départ", delay: 40 },
    { icon: "🌍", label: "Sauvegarde cloud", value: "Auto", delay: 55 },
  ];

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 48, paddingInline: 80 }}>
      <div style={{ opacity: titleOpacity, textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 64, fontWeight: 900, color: "#fff", fontFamily: "system-ui,sans-serif" }}>
          Pourquoi <span style={{ color: "#B000FF" }}>MEMORI</span> ?
        </div>
      </div>
      {STATS.map((s, i) => (
        <StatBadge key={i} icon={s.icon} value={s.value} label={s.label} delay={s.delay} frame={frame} />
      ))}
    </AbsoluteFill>
  );
};

// ── Scene 4 : CTA (360–450f = 12–15s) ────────────────────────────────────────

const SceneCTA = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logoScale = spring({ frame: frame - 10, fps, config: { stiffness: 120, damping: 16 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const btnScale = spring({ frame: frame - 40, fps, config: { stiffness: 200, damping: 14 } });
  const pulse = 1 + Math.sin(frame * 0.15) * 0.03;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60 }}>
      <div style={{ transform: `scale(${logoScale})`, filter: "drop-shadow(0 0 60px #B000FF) drop-shadow(0 0 120px #00F0FF55)", opacity }}>
        <Logo size={240} />
      </div>

      <div style={{ opacity, textAlign: "center" }}>
        <div style={{ fontSize: 88, fontWeight: 900, color: "#fff", fontFamily: "system-ui,sans-serif", letterSpacing: 10, textShadow: "0 0 60px #fff4" }}>
          MEMORI
        </div>
        <div style={{ fontSize: 34, color: "rgba(255,255,255,0.5)", letterSpacing: 6, fontFamily: "system-ui,sans-serif", marginTop: 8 }}>
          JOUE GRATUITEMENT
        </div>
      </div>

      <div style={{
        transform: `scale(${btnScale * pulse})`,
        background: "linear-gradient(135deg,#B000FF,#00F0FF)",
        borderRadius: 80, padding: "36px 100px",
        fontSize: 48, fontWeight: 900, color: "#fff",
        fontFamily: "system-ui,sans-serif",
        boxShadow: "0 0 60px #B000FF99, 0 0 120px #00F0FF44",
        letterSpacing: 4,
      }}>
        🎮 JOUER MAINTENANT
      </div>

      <div style={{ opacity: interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), textAlign: "center" }}>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.4)", fontFamily: "system-ui,sans-serif" }}>
          memori-gamma.vercel.app
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ──────────────────────────────────────────────────────────

export const MemoriAd = () => {
  const frame = useCurrentFrame();
  const globalOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: globalOpacity, fontFamily: "system-ui,sans-serif" }}>
      <BG />
      <Particles />

      <Sequence from={0} durationInFrames={120}>
        <SceneIntro />
      </Sequence>

      <Sequence from={120} durationInFrames={120}>
        <SceneCards />
      </Sequence>

      <Sequence from={240} durationInFrames={120}>
        <SceneStats />
      </Sequence>

      <Sequence from={360} durationInFrames={90}>
        <SceneCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
