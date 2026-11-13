import React from 'react';

interface SceneProps {
  progress: number;
  currentTime: number;
}

export const Scene5CTA: React.FC<SceneProps> = ({ progress }) => {
  // Flash burst happens around progress 0.65
  const isFlash = progress > 0.62 && progress < 0.78;

  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between p-6">
      {/* Background arena with vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
        style={{
          backgroundImage: `url('/src/assets/images/esports_headshot_bg_1794469072537.jpg')`,
          transform: `scale(${1.1 - progress * 0.05})`,
          filter: 'brightness(0.35) contrast(1.2)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/90" />

      {/* Screen flashbang white burst */}
      {isFlash && (
        <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-heavy-impact" />
      )}

      {/* Top Brand Tag */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg overflow-hidden border border-amber-500">
            <img 
              src="/src/assets/images/devesports_logo_emblem_1794469072892.jpg" 
              alt="Dev eSports" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-display font-black text-sm text-white tracking-wider">
            DEV ESPORTS
          </span>
        </div>
        <div className="px-3 py-1 bg-red-600 rounded-full font-black text-[11px] text-white uppercase tracking-wider animate-pulse">
          JOIN NOW
        </div>
      </div>

      {/* Center Layout: Final Logo & CTA Text Slam */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto w-full text-center py-2">
        {/* Final Shield Logo with intense neon red & gold aura */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-2">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600 via-amber-500 to-red-600 blur-xl opacity-80 animate-neon-glow" />
          <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.9)]">
            <img 
              src="/src/assets/images/devesports_logo_emblem_1794469072892.jpg" 
              alt="Dev eSports Official Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Big Bold Animated Text (Exact Prompt Requirement) */}
        <div className="w-full max-w-sm mt-1">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_15px_rgba(239,68,68,0.9)]">
            WEBSITE + WHATSAPP LINK
          </h1>
          <div className="mt-1 px-3 py-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-xl inline-flex items-center gap-2 shadow-lg">
            <span className="font-display font-black text-xl text-black uppercase tracking-wider">
              DESCRIPTION MEIN
            </span>
            <span className="text-xl animate-bounce">👇</span>
          </div>
        </div>

        {/* Down-Arrow Animation Pointing to Description */}
        <div className="mt-4 flex flex-col items-center gap-1 animate-bounce-glow">
          <div className="w-10 h-10 rounded-full bg-red-600/90 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,1)]">
            <svg className="w-6 h-6 text-amber-300 fill-current animate-pulse" viewBox="0 0 24 24">
              <path d="M12 21l-8-8h5V3h6v10h5z" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest bg-black/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
            CHECK DESCRIPTION BELOW 👇
          </span>
        </div>
      </div>

      {/* Bottom Voiceover Caption Bar */}
      <div className="relative z-10 p-3.5 bg-black/85 backdrop-blur-md border border-zinc-800 rounded-xl shadow-2xl">
        <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-red-400 uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>VOICEOVER (HINGLISH)</span>
        </div>
        <p className="text-base sm:text-lg font-bold text-white tracking-wide leading-snug">
          &ldquo;Dono ki link description mein di hui hai. <span className="text-amber-400 underline decoration-amber-400 decoration-2">Abhi click karo, register karo,</span> aur apni skill se jeeto!&rdquo;
        </p>
      </div>
    </div>
  );
};
