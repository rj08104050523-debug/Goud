import React from 'react';

interface SceneProps {
  progress: number;
  currentTime: number;
}

export const Scene3Booyah: React.FC<SceneProps> = ({ progress }) => {
  // Toggle between BOOYAH! stamp and CHICKEN DINNER! stamp
  const isBooyah = progress < 0.5;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between p-6">
      {/* Background with championship trophy & spotlight */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: `url('/src/assets/images/esports_booyah_trophy_1794469072469.jpg')`,
          transform: `scale(${1.08 - progress * 0.04})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/75" />

      {/* Floating Cascading Golden Coins FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute font-black text-amber-300 drop-shadow-[0_0_12px_rgba(245,158,11,0.9)] animate-coin-float"
            style={{
              top: `${(i * 18) % 80}%`,
              left: `${(i * 23 + 12) % 90}%`,
              animationDelay: `${(i * 0.25) % 2.5}s`,
              animationDuration: `${2.2 + (i % 3) * 0.4}s`,
              fontSize: `${22 + (i % 4) * 8}px`,
            }}
          >
            🪙
          </div>
        ))}
      </div>

      {/* Top Banner */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/90 border border-amber-300 rounded-lg text-black font-black text-xs tracking-wider uppercase shadow-lg">
          <span>🏆 100% VERIFIED WINNERS</span>
        </div>
        <div className="px-2.5 py-1 bg-black/80 border border-emerald-500/70 rounded font-mono-num text-xs text-emerald-400 font-bold flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>INSTANT UPI TRANSFER</span>
        </div>
      </div>

      {/* Center Hero Celebration & Winner Moment */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full">
        {/* Animated Victory Stamp: BOOYAH / CHICKEN DINNER */}
        <div className="text-center animate-heavy-impact">
          {isBooyah ? (
            <div className="inline-block px-6 py-2.5 bg-gradient-to-r from-amber-600 via-red-600 to-amber-600 border-4 border-amber-300 rounded-2xl transform -rotate-2 shadow-[0_0_40px_rgba(245,158,11,0.85)]">
              <span className="font-display font-black text-5xl sm:text-6xl text-white tracking-wider block drop-shadow-lg">
                🔥 BOOYAH! 🔥
              </span>
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-widest block">
                FREE FIRE CHAMPION
              </span>
            </div>
          ) : (
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-red-600 via-amber-600 to-red-600 border-4 border-amber-300 rounded-2xl transform rotate-1 shadow-[0_0_40px_rgba(239,68,68,0.85)]">
              <span className="font-display font-black text-4xl sm:text-5xl text-white tracking-wider block drop-shadow-lg">
                🍗 CHICKEN DINNER!
              </span>
              <span className="text-[11px] font-bold text-amber-200 uppercase tracking-widest block">
                PUBG BATTLEGROUNDS VICTOR
              </span>
            </div>
          )}
        </div>

        {/* Real Cash Payout Notification Toast */}
        <div className="mt-5 w-full max-w-xs bg-zinc-900/95 border-2 border-emerald-500 rounded-xl p-3 shadow-[0_0_30px_rgba(16,185,129,0.5)] backdrop-blur-md transform transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl">
              💰
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white">PAYMENT RECEIVED</span>
                <span className="text-[10px] font-mono-num text-emerald-400 font-bold">JUST NOW</span>
              </div>
              <div className="text-lg font-black font-mono-num text-emerald-400 leading-tight">
                +₹5,000.00
              </div>
              <div className="text-[10px] text-zinc-400">
                Transferred via UPI / Paytm · Dev eSports
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars List (Exact prompt text) */}
        <div className="mt-6 w-full max-w-sm space-y-2">
          <div className="p-2.5 bg-black/80 border border-amber-500/70 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="text-emerald-400 text-lg font-black">✅</span>
            <div>
              <span className="font-display font-black text-lg text-white tracking-wide block leading-none">
                FAIR MATCHES
              </span>
              <span className="text-[10px] text-zinc-400 block leading-none mt-1">
                Zero hackers, anti-cheat rooms, live spectator referee
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-black/80 border border-amber-500/70 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="text-emerald-400 text-lg font-black">✅</span>
            <div>
              <span className="font-display font-black text-lg text-amber-300 tracking-wide block leading-none">
                REAL CASH PRIZES
              </span>
              <span className="text-[10px] text-zinc-400 block leading-none mt-1">
                Direct bank, UPI & Paytm payout within 15 minutes
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-black/80 border border-amber-500/70 rounded-xl flex items-center gap-3 shadow-lg">
            <span className="text-emerald-400 text-lg font-black">✅</span>
            <div>
              <span className="font-display font-black text-lg text-white tracking-wide block leading-none">
                EASY REGISTRATION
              </span>
              <span className="text-[10px] text-zinc-400 block leading-none mt-1">
                1-click slot booking on website or WhatsApp
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Voiceover Caption Bar */}
      <div className="relative z-10 p-3.5 bg-black/85 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl">
        <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-red-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>VOICEOVER (HINGLISH)</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-white tracking-wide leading-snug">
          &ldquo;Easy registration, fair matches, aur jeetoge toh <span className="text-amber-400 underline decoration-amber-400 decoration-2">paisa seedha tumhare paas.</span> Koi jhanjhat nahi!&rdquo;
        </p>
      </div>
    </div>
  );
};
