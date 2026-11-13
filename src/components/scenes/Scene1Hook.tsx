import React from 'react';

interface SceneProps {
  progress: number; // 0 to 1 in this scene
  currentTime: number;
}

export const Scene1Hook: React.FC<SceneProps> = ({ progress }) => {
  // Headshot hitmarker occurs around progress 0.25
  const isHeadshot = progress > 0.24 && progress < 0.65;
  const isSlam = progress > 0.45;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between p-6">
      {/* Background with sniper crosshair and headshot action */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: `url('/src/assets/images/esports_headshot_bg_1794469072537.jpg')`,
          transform: isHeadshot ? 'scale(1.12) translate(-2px, 3px)' : 'scale(1.03)',
          filter: isHeadshot ? 'contrast(1.4) brightness(1.2)' : 'contrast(1.1)',
        }}
      />

      {/* Dark gradient & red vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-red-950/20 to-black/80" />

      {/* Top Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1 bg-red-600/90 border border-red-500 rounded text-xs font-black tracking-wider text-white uppercase shadow-lg shadow-red-900/40">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>PRO GAMING LEAGUE</span>
        </div>
        <div className="px-2.5 py-1 bg-black/60 border border-zinc-800 rounded font-mono-num text-xs text-amber-400 font-bold">
          FREE FIRE & PUBG
        </div>
      </div>

      {/* Center Target & Headshot Crosshair FX */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        {/* Animated Scope HUD */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Outer circle */}
          <div className="absolute inset-0 border-2 border-red-500/60 rounded-full animate-spin [animation-duration:12s]" />
          <div className="absolute inset-2 border border-dashed border-amber-500/40 rounded-full" />
          
          {/* Crosshair ticks */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-red-500/80" />
          <div className="absolute left-0 right-0 h-0.5 bg-red-500/80" />

          {/* Hitmarker Flash */}
          {isHeadshot && (
            <div className="absolute inset-0 flex flex-col items-center justify-center animate-heavy-impact">
              {/* Skull icon / Hitmarker */}
              <div className="w-16 h-16 rounded-full bg-red-600/90 border-2 border-white flex items-center justify-center shadow-[0_0_35px_#dc2626]">
                <svg className="w-10 h-10 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 3.31 1.61 6.24 4.1 8.04.14.1.32.16.51.16h.79c.41 0 .75-.34.75-.75v-1.5c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v1.5c0 .41.34.75.75.75h1.7c.41 0 .75-.34.75-.75v-1.5c0-.41.34-.75.75-.75h1.5c.41 0 .75.34.75.75v1.5c0 .41.34.75.75.75h.79c.19 0 .37-.06.51-.16C20.39 18.24 22 15.31 22 12c0-5.52-4.48-10-10-10zm-3 12c-.83 0-1.5-.67-1.5-1.5S8.17 11 9 11s1.5.67 1.5 1.5S9.83 14 9 14zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <span className="mt-2 text-xl font-black font-display text-amber-300 tracking-wider bg-black/80 px-3 py-0.5 rounded border border-amber-500 shadow-lg">
                HEADSHOT! +₹500
              </span>
            </div>
          )}
        </div>

        {/* Big Text Slam */}
        <div className={`mt-8 text-center transition-all duration-300 ${isSlam ? 'scale-100 opacity-100' : 'scale-75 opacity-90'}`}>
          <div className="inline-block transform -rotate-1">
            <h1 className="font-display font-black text-5xl sm:text-6xl text-white tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              GAME KHELO,
            </h1>
            <h1 className="font-display font-black text-6xl sm:text-7xl text-amber-400 tracking-tight leading-none drop-shadow-[0_0_25px_rgba(245,158,11,0.8)] mt-1 flex items-center justify-center gap-2">
              <span>KAMAO</span>
              <span className="text-5xl">💰</span>
            </h1>
          </div>

          <div className="mt-3 px-4 py-1.5 bg-red-950/80 border border-red-500/70 rounded-full inline-flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
            <span className="text-red-400 font-bold text-xs uppercase tracking-widest">
              DAILY CASH PRIZES FROM YOUR PHONE
            </span>
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
          &ldquo;Bhai, game toh roz khelte ho... <span className="text-amber-400 underline decoration-amber-400 decoration-2">ab usi game se kamao bhi!</span>&rdquo;
        </p>
      </div>
    </div>
  );
};
