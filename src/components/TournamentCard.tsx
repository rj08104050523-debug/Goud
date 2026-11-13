import React from 'react';
import { Trophy, Users, Clock, MapPin, Key } from 'lucide-react';
import { Tournament } from '../shared/tournamentRules';

interface TournamentCardProps {
  tournament: Tournament;
  isRegistered?: boolean;
  onJoin: (tournament: Tournament) => void;
  onViewRoom: (tournament: Tournament) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  tournament,
  isRegistered = false,
  onJoin,
  onViewRoom,
}) => {
  const isFreeFire = tournament.game === 'FREE FIRE MAX';
  const isFull = tournament.registeredCount >= tournament.maxSlots;
  const isLive = tournament.status === 'LIVE';
  const isCompleted = tournament.status === 'COMPLETED';

  const fillPercentage = Math.min(100, Math.round((tournament.registeredCount / tournament.maxSlots) * 100));

  return (
    <div
      className={`relative bg-zinc-950 border rounded-2xl overflow-hidden transition-all duration-300 hover:border-zinc-600 flex flex-col justify-between group ${
        isLive
          ? 'border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
          : isRegistered
          ? 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
          : 'border-zinc-800/80'
      }`}
    >
      {/* Top Banner & Badges */}
      <div className="p-4 pb-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`px-2.5 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                isFreeFire
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
              }`}
            >
              {tournament.game}
            </span>

            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px] font-bold text-zinc-300 uppercase">
              {tournament.matchType}
            </span>
          </div>

          <div>
            {isLive ? (
              <span className="px-2 py-0.5 bg-red-600 text-white rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE
              </span>
            ) : isCompleted ? (
              <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded text-[10px] font-bold uppercase">
                ENDED
              </span>
            ) : isRegistered ? (
              <span className="px-2 py-0.5 bg-emerald-600 text-black font-black rounded text-[10px] uppercase tracking-wider">
                REGISTERED
              </span>
            ) : (
              <span className="text-[10px] font-mono-num font-bold text-emerald-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {tournament.matchTime}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display font-black text-xl text-white group-hover:text-emerald-400 transition-colors leading-tight">
            {tournament.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
              <span>Map: {tournament.map}</span>
            </span>
            <span>·</span>
            <span>{tournament.matchDate}</span>
          </div>
        </div>

        {/* Prize Pool and Entry Fee Strip */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              TOTAL PRIZE POOL
            </span>
            <span className="text-lg font-black font-mono-num text-emerald-400 flex items-center gap-1 leading-none mt-0.5">
              <Trophy className="w-4 h-4" />
              <span>₹{tournament.prizePool.toLocaleString('en-IN')}</span>
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              ENTRY FEE
            </span>
            <span className="text-lg font-black font-mono-num text-amber-300 block leading-none mt-0.5">
              {tournament.entryFee === 0 ? 'FREE' : `₹${tournament.entryFee}`}
            </span>
          </div>
        </div>

        {/* Slots Filled Bar */}
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono-num text-zinc-400 mb-1">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-zinc-500" />
              <span>Slots: {tournament.registeredCount} / {tournament.maxSlots}</span>
            </span>
            <span className={isFull ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {isFull ? 'FULL' : `${tournament.maxSlots - tournament.registeredCount} Left`}
            </span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isFull
                  ? 'bg-red-500'
                  : fillPercentage > 75
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-zinc-900/40 border-t border-zinc-800/80">
        {isRegistered && tournament.roomReleased ? (
          <button
            onClick={() => onViewRoom(tournament)}
            className="w-full py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-[0.99] animate-pulse"
          >
            <Key className="w-3.5 h-3.5" />
            <span>VIEW ROOM ID & PASSWORD 🔑</span>
          </button>
        ) : isRegistered ? (
          <button
            disabled
            className="w-full py-2 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-display font-bold text-xs uppercase tracking-wider rounded-xl cursor-default text-center"
          >
            ✓ Slot Booked · Awaiting Room Release
          </button>
        ) : isCompleted ? (
          <button
            onClick={() => onJoin(tournament)}
            className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl"
          >
            View Match Standings
          </button>
        ) : isFull ? (
          <button
            disabled
            className="w-full py-2 bg-zinc-800 text-zinc-500 font-bold text-xs rounded-xl cursor-not-allowed"
          >
            Match Full
          </button>
        ) : (
          <button
            onClick={() => onJoin(tournament)}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-transform active:scale-[0.99]"
          >
            BOOK SLOT NOW (₹{tournament.entryFee})
          </button>
        )}
      </div>
    </div>
  );
};
