import React from 'react';

interface SceneProps {
  progress: number;
  currentTime: number;
}

export const Scene4Leaderboard: React.FC<SceneProps> = ({ progress }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black flex flex-col justify-between p-6">
      {/* Background arena */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{
          backgroundImage: `url('/src/assets/images/esports_tourney_arena_1794469073392.jpg')`,
          transform: `scale(${1.04 + progress * 0.04})`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-black/80" />
      <div className="absolute inset-0 scanlines-overlay opacity-30" />

      {/* Top Banner Header */}
      <div className="relative z-10 text-center">
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight uppercase leading-none drop-shadow-[0_2px_15px_rgba(245,158,11,0.6)]">
          AAJ KA LEADERBOARD & TIME
        </h1>
        <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mt-1">
          DAILY MATCH SLOTS & TOP EARNERS LIST
        </p>
      </div>

      {/* Center Layout: Leaderboard & Schedule */}
      <div className="relative z-10 flex-1 flex flex-col justify-center my-auto w-full space-y-2 py-1">
        {/* Top 3 Live Leaderboard Card */}
        <div className="bg-zinc-950/90 border border-amber-500/50 rounded-xl p-2.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-zinc-800 text-[10px] font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span>🏆</span>
              <span>TODAY&apos;S TOP CASH EARNERS</span>
            </span>
            <span className="font-mono-num text-emerald-400 text-[9px]">LIVE RANKINGS</span>
          </div>

          <div className="space-y-1 font-mono-num">
            {/* Rank 1 */}
            <div className="flex items-center justify-between p-1 bg-gradient-to-r from-amber-950/40 to-transparent border border-amber-500/30 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-black text-[10px] flex items-center justify-center font-display">
                  1
                </span>
                <span className="text-[11px] font-bold text-white">Dev_Sniper99</span>
                <span className="text-[8px] px-1 bg-red-900/60 text-red-300 rounded">FF</span>
              </div>
              <span className="text-[11px] font-black text-emerald-400">₹14,200</span>
            </div>

            {/* Rank 2 */}
            <div className="flex items-center justify-between p-1 bg-zinc-900/60 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-zinc-400 text-black font-black text-[10px] flex items-center justify-center font-display">
                  2
                </span>
                <span className="text-[11px] font-bold text-zinc-200">ShadowKiller</span>
                <span className="text-[8px] px-1 bg-amber-900/60 text-amber-300 rounded">PUBG</span>
              </div>
              <span className="text-[11px] font-black text-emerald-400">₹9,800</span>
            </div>

            {/* Rank 3 */}
            <div className="flex items-center justify-between p-1 bg-zinc-900/60 rounded-lg">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-800 text-amber-200 font-black text-[10px] flex items-center justify-center font-display">
                  3
                </span>
                <span className="text-[11px] font-bold text-zinc-200">GodOP_Clutch</span>
                <span className="text-[8px] px-1 bg-red-900/60 text-red-300 rounded">FF</span>
              </div>
              <span className="text-[11px] font-black text-emerald-400">₹7,450</span>
            </div>
          </div>
        </div>

        {/* Today's Timetable / Slot Schedule */}
        <div className="bg-zinc-950/90 border border-red-500/50 rounded-xl p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 text-[11px] font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 text-red-400">
              <span>⏰</span>
              <span>TODAY&apos;S TOURNAMENT TIMETABLE</span>
            </span>
            <span className="text-amber-400 text-[10px] font-bold">SLOTS OPEN</span>
          </div>

          <div className="space-y-1.5 font-mono-num text-xs">
            <div className="flex items-center justify-between p-1.5 bg-zinc-900/80 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">04:00 PM</span>
                <span className="text-white font-medium">Free Fire Solo (Bermuda)</span>
              </div>
              <span className="text-emerald-400 font-bold">₹2,000 Pool</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-zinc-900/80 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">06:30 PM</span>
                <span className="text-white font-medium">PUBG Squad (Erangel)</span>
              </div>
              <span className="text-emerald-400 font-bold">₹5,000 Pool</span>
            </div>

            <div className="flex items-center justify-between p-1.5 bg-zinc-900/80 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-400">09:00 PM</span>
                <span className="text-white font-medium">Free Fire Duo (Kalahari)</span>
              </div>
              <span className="text-emerald-400 font-bold">₹3,500 Pool</span>
            </div>
          </div>
        </div>

        {/* Side-by-Side: WhatsApp Logo & Website Logo (Exact Prompt Requirement) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* WhatsApp Card */}
          <div className="p-3 bg-gradient-to-br from-emerald-950/60 to-black border-2 border-emerald-500 rounded-xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl shrink-0 shadow-md">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.49 0-2.95-.4-4.23-1.16l-.3-.18-3.14.82.84-3.06-.2-.31a8.163 8.163 0 01-1.25-4.36c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.19-8.2 8.19zm4.5-6.14c-.25-.12-1.46-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.49-.07 1.69-.7 1.93-1.38.24-.68.24-1.26.17-1.38-.07-.11-.23-.19-.48-.31z"/>
              </svg>
            </div>
            <div className="overflow-hidden">
              <span className="font-display font-black text-sm text-white tracking-wide block leading-tight">
                WHATSAPP
              </span>
              <span className="text-[10px] text-emerald-400 font-bold block truncate">
                Slot & Room Pass
              </span>
            </div>
          </div>

          {/* Website Card */}
          <div className="p-3 bg-gradient-to-br from-red-950/60 to-black border-2 border-red-500 rounded-xl flex items-center gap-2.5 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white text-xl shrink-0 shadow-md">
              <svg className="w-6 h-6 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="overflow-hidden">
              <span className="font-display font-black text-sm text-white tracking-wide block leading-tight">
                DEV ESPORTS
              </span>
              <span className="text-[10px] text-red-400 font-bold block truncate">
                devesports.in
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
          &ldquo;Aaj ka leaderboard, time aur slot ki details <span className="text-emerald-400">WhatsApp</span> aur <span className="text-red-400">website</span>, <span className="text-amber-400 underline decoration-amber-400 decoration-2">dono jagah mil jayengi.</span>&rdquo;
        </p>
      </div>
    </div>
  );
};
