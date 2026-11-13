import React from 'react';

interface SceneProps {
  progress: number; // 0 to 1 across 5 seconds
  currentTime: number;
}

interface QuickCutFrame {
  id: number;
  bgImage: string;
  bgTransform: string;
  bgFilter: string;
  kicker: string;
  neonHeadline: string;
  neonClass: string;
  subQuote: string;
  proofBadge: string;
  accentBorder: string;
  accentGlow: string;
}

const QUICK_CUTS: QuickCutFrame[] = [
  {
    id: 1,
    bgImage: '/src/assets/images/esports_headshot_bg_1794469072537.jpg',
    bgTransform: 'scale(1.12) rotate(-1.5deg)',
    bgFilter: 'contrast(1.25) brightness(0.65) saturate(1.3)',
    kicker: 'PAST WINNER · ARYAN (DEV_SNIPER99)',
    neonHeadline: 'ARRE DOST! SUNA KYA?!',
    neonClass: 'text-cyan-300 neon-text-cyan',
    subQuote: '"Main pehle sirf timepass ke liye Free Fire khelta tha..."',
    proofBadge: 'BERMUDA SQUAD PRO CUP · #1',
    accentBorder: 'border-cyan-400',
    accentGlow: 'shadow-[0_0_28px_rgba(34,211,238,0.65)]',
  },
  {
    id: 2,
    bgImage: '/src/assets/images/esports_booyah_trophy_1794469072469.jpg',
    bgTransform: 'scale(1.18) rotate(1.5deg)',
    bgFilter: 'contrast(1.3) brightness(0.6) saturate(1.4)',
    kicker: 'BOOYAH! 14 KILLS · SUNDAY CLASH',
    neonHeadline: '₹2,750 CASH JEETA DOST!',
    neonClass: 'text-emerald-300 neon-text-emerald',
    subQuote: '"Dev eSports pe match jeet ke sach mein maza aa gaya!"',
    proofBadge: '+₹2,750 PRIZE WON',
    accentBorder: 'border-emerald-400',
    accentGlow: 'shadow-[0_0_28px_rgba(52,211,153,0.7)]',
  },
  {
    id: 3,
    bgImage: '/src/assets/images/esports_tourney_arena_1794469073392.jpg',
    bgTransform: 'scale(1.14) translate(-4px, 2px)',
    bgFilter: 'contrast(1.25) brightness(0.6) saturate(1.35)',
    kicker: 'ZERO SCAM · INSTANT PAYOUT',
    neonHeadline: '10 MIN MEIN SEEDHA UPI!',
    neonClass: 'text-amber-300 neon-text-amber',
    subQuote: '"Bina kisi jhanjhat ke cash sidha Paytm/UPI mein aa gaya!"',
    proofBadge: 'UPI VERIFIED · 10 MINS',
    accentBorder: 'border-amber-400',
    accentGlow: 'shadow-[0_0_28px_rgba(251,191,36,0.7)]',
  },
  {
    id: 4,
    bgImage: '/src/assets/images/esports_booyah_trophy_1794469072469.jpg',
    bgTransform: 'scale(1.22)',
    bgFilter: 'contrast(1.35) brightness(0.65) saturate(1.5)',
    kicker: 'REAL GAMERS · REAL CASH',
    neonHeadline: 'TU BHI TRY KAR DOST! 🔥',
    neonClass: 'text-pink-300 neon-text-pink',
    subQuote: '"Agla Booyah aur ₹2,750+ cash prize tera ho sakta hai!"',
    proofBadge: 'JOIN NEXT MATCH NOW',
    accentBorder: 'border-pink-400',
    accentGlow: 'shadow-[0_0_30px_rgba(244,114,182,0.75)]',
  },
];

export const SceneTestimonial: React.FC<SceneProps> = ({ progress }) => {
  const cutIndex = progress < 0.25 ? 0 : progress < 0.52 ? 1 : progress < 0.78 ? 2 : 3;
  const activeCut = QUICK_CUTS[cutIndex];

  // Brief shutter flash right when each quick cut hits
  const cutLocalStart = [0, 0.25, 0.52, 0.78][cutIndex];
  const isShutterFlash = progress - cutLocalStart < 0.045;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between p-5">
      {/* Dynamic Quick-Cut Background */}
      <div
        key={`bg-${activeCut.id}`}
        className="absolute inset-0 bg-cover bg-center animate-quick-cut"
        style={{
          backgroundImage: `url('${activeCut.bgImage}')`,
          transform: activeCut.bgTransform,
          filter: activeCut.bgFilter,
        }}
      />

      {/* Neon vignette & scanlines */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/80" />
      <div className="absolute inset-0 scanlines-overlay opacity-40" />

      {/* Quick-cut shutter strobe */}
      {isShutterFlash && (
        <div className="absolute inset-0 bg-white/35 z-30 pointer-events-none" />
      )}

      {/* Top Winner Bar & Quick-Cut Counter */}
      <div className="relative z-10 flex items-center justify-between pt-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-black/80 border border-emerald-400/80 rounded-lg text-[10px] font-black tracking-wider text-emerald-300 uppercase shadow-[0_0_15px_rgba(16,185,129,0.5)]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>REAL WINNER</span>
        </div>

        <div className="px-2.5 py-1 bg-black/85 border border-cyan-400/70 rounded font-mono-num text-[10px] text-cyan-300 font-black tracking-widest shadow-[0_0_12px_rgba(34,211,238,0.45)]">
          QUICK CUT 0{activeCut.id}/04
        </div>
      </div>

      {/* Center Quick-Cut Testimonial Stage */}
      <div
        key={`stage-${activeCut.id}`}
        className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full text-center space-y-2.5 animate-quick-cut"
      >
        {/* Winner Identity Card */}
        <div className={`w-full max-w-[300px] bg-black/85 backdrop-blur-md border-2 ${activeCut.accentBorder} ${activeCut.accentGlow} rounded-2xl p-3 space-y-2`}>
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-amber-400 shrink-0 shadow-[0_0_16px_rgba(245,158,11,0.7)]">
              <img
                src="/src/assets/images/devesports_logo_emblem_1794469072892.jpg"
                alt="Aryan DEV_SNIPER99"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1">
                <span className="font-display font-black text-base text-white tracking-wide truncate">
                  ARYAN · DEV_SNIPER99
                </span>
                <span className="text-[9px] font-mono-num font-black px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded">
                  VERIFIED
                </span>
              </div>
              <p className="text-[10px] font-mono-num font-bold text-zinc-300 truncate">
                {activeCut.kicker}
              </p>
            </div>
          </div>

          {/* Neon Glow Headline */}
          <div className="py-1.5 px-2 bg-zinc-950/90 border border-zinc-800 rounded-xl">
            <h2
              className={`font-display font-black text-[30px] sm:text-[32px] uppercase tracking-tight leading-none ${activeCut.neonClass}`}
            >
              {activeCut.neonHeadline}
            </h2>
          </div>

          {/* Enthusiastic Hinglish Quote */}
          <p className="text-[13px] font-bold text-white leading-snug px-1">
            {activeCut.subQuote}
          </p>

          {/* Cash Prize Proof Strip */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/90 text-[10px] font-mono-num font-black">
            <span className="text-emerald-400 neon-text-emerald">
              💰 {activeCut.proofBadge}
            </span>
            <span className="text-amber-300">⚡ DEV ESPORTS</span>
          </div>
        </div>

        {/* Kinetic Cut Progress Dots */}
        <div className="flex items-center gap-1.5">
          {QUICK_CUTS.map((cut, idx) => (
            <div
              key={cut.id}
              className={`h-1.5 rounded-full transition-all duration-150 ${
                idx === cutIndex
                  ? 'w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.95)]'
                  : idx < cutIndex
                    ? 'w-3 bg-emerald-400'
                    : 'w-3 bg-zinc-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Voiceover Caption Bar */}
      <div className="relative z-10 p-3 bg-black/90 backdrop-blur-md border border-cyan-500/50 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.25)]">
        <div className="flex items-center gap-2 mb-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>WINNER TESTIMONIAL (HINGLISH)</span>
        </div>
        <p className="text-xs sm:text-[13px] font-bold text-white tracking-wide leading-snug">
          &ldquo;Arre dost! Main pichhle Sunday <span className="text-emerald-300 neon-text-emerald font-black">₹2,750 cash jeeta</span>, 10 min mein <span className="text-amber-300 underline decoration-amber-400 decoration-2">seedha UPI aa gaya!</span> Tu bhi try kar!&rdquo;
        </p>
      </div>
    </div>
  );
};
