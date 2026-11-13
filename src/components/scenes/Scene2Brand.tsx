import React from 'react';

interface SceneProps {
  progress: number;
  currentTime: number;
}

export const Scene2Brand: React.FC<SceneProps> = ({ progress }) => {
  // Reveal timing: Logo blast at start (0-0.35), then website mockup & game badges (0.35 - 1.0)
  const isLogoBig = progress < 0.38;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between p-6">
      {/* Background with dark arena stage and grid overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: `url('/src/assets/images/esports_tourney_arena_1794469073392.jpg')`,
          transform: `scale(${1.05 + progress * 0.05})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80" />
      <div className="absolute inset-0 scanlines-overlay opacity-30" />

      {/* Anamorphic Light Streak Beam */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-full h-24 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent blur-xl transform -rotate-12 animate-light-streak" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
            <img 
              src="/src/assets/images/devesports_logo_emblem_1794469072892.jpg" 
              alt="Dev eSports" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-display font-black text-lg text-white tracking-wider block leading-none">
              DEV ESPORTS
            </span>
            <span className="text-[10px] font-bold text-red-400 tracking-widest block leading-none mt-0.5">
              OFFICIAL PLATFORM
            </span>
          </div>
        </div>

        <div className="px-3 py-1 bg-gradient-to-r from-red-600 to-amber-600 rounded-full font-bold text-[11px] text-white uppercase tracking-wider shadow-lg">
          🔥 DAILY TOURNAMENTS
        </div>
      </div>

      {/* Center Dynamic Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full">
        {/* Logo reveal stage or platform screen recording */}
        {isLogoBig ? (
          <div className="flex flex-col items-center justify-center animate-cam-shake">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              {/* Radial neon glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 blur-2xl opacity-60 animate-neon-glow" />
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-[0_0_50px_rgba(239,68,68,0.8)]">
                <img 
                  src="/src/assets/images/devesports_logo_emblem_1794469072892.jpg" 
                  alt="Dev eSports Logo Reveal"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Light beam overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none rounded-2xl" />
            </div>

            <h1 className="mt-6 font-display font-black text-5xl text-white tracking-tight leading-none text-center drop-shadow-[0_4px_20px_rgba(239,68,68,0.9)]">
              DEV ESPORTS
            </h1>
            <p className="text-amber-400 font-bold tracking-widest text-sm uppercase mt-1">
              INDIA&apos;S #1 ESPORTS CASH ARENA
            </p>
          </div>
        ) : (
          /* Website Screen Recording & Daily Tournaments Match Lobby */
          <div className="w-full max-w-sm flex flex-col items-center">
            {/* Headline Slam */}
            <div className="text-center mb-3">
              <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_15px_rgba(245,158,11,0.7)]">
                DAILY TOURNAMENTS
              </h1>
              <p className="text-red-400 font-black text-xs tracking-widest uppercase mt-1">
                INSTANT CASH PRIZE • FAIR MATCH ENGINE
              </p>
            </div>

            {/* Screen Recording Mockup */}
            <div className="w-full bg-zinc-950/95 border-2 border-red-600/70 rounded-2xl p-3 shadow-[0_0_35px_rgba(239,68,68,0.4)] backdrop-blur-md">
              {/* Browser chrome header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-[10px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="px-2 py-0.5 bg-zinc-900 rounded font-mono-num text-[10px] text-amber-300">
                  devesports.in/tournaments
                </div>
                <span className="text-emerald-400 font-bold">LIVE 🔴</span>
              </div>

              {/* Tournament Match Cards list */}
              <div className="mt-2.5 space-y-2">
                {/* Match 1: Free Fire */}
                <div className="p-2.5 bg-gradient-to-r from-zinc-900 to-red-950/40 border border-red-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-red-600/30 border border-red-500 flex items-center justify-center font-display font-black text-xs text-white">
                      FF
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Free Fire Solo Cup</span>
                        <span className="px-1.5 py-0.2 bg-red-600/80 text-[9px] rounded text-white font-bold">BERMUDA</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono-num">
                        Entry: <span className="text-amber-400 font-bold">₹20</span> · Pool: <span className="text-emerald-400 font-bold">₹2,000</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500 text-black text-[10px] font-black rounded-lg uppercase tracking-wider">
                    BOOK SLOT
                  </span>
                </div>

                {/* Match 2: PUBG Battlegrounds */}
                <div className="p-2.5 bg-gradient-to-r from-zinc-900 to-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-amber-600/30 border border-amber-500 flex items-center justify-center font-display font-black text-xs text-amber-300">
                      PUBG
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>PUBG Squad War</span>
                        <span className="px-1.5 py-0.2 bg-amber-600/80 text-[9px] rounded text-white font-bold">ERANGEL</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono-num">
                        Entry: <span className="text-amber-400 font-bold">₹50</span> · Pool: <span className="text-emerald-400 font-bold">₹5,000</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-md shadow-red-900/40">
                    BOOK SLOT
                  </span>
                </div>
              </div>

              {/* Sliding Game Badges */}
              <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-around">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>FREE FIRE MAX</span>
                </div>
                <span className="text-zinc-600">|</span>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  <span>PUBG / BGMI</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Voiceover Caption Bar */}
      <div className="relative z-10 p-3.5 bg-black/85 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl">
        <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-red-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>VOICEOVER (HINGLISH)</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-white tracking-wide leading-snug">
          &ldquo;Dev eSports pe Free Fire aur PUBG ke <span className="text-red-400">daily tournaments</span>, fair matches aur <span className="text-amber-400 underline decoration-amber-400 decoration-2">seedha cash prize!</span>&rdquo;
        </p>
      </div>
    </div>
  );
};
