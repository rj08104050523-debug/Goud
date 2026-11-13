import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Flame, Zap, Crosshair } from 'lucide-react';

interface LeaderboardEntry {
  userId: string;
  name: string;
  inGameName: string;
  ffUid: string;
  bgmiId: string;
  totalEarnings: number;
  kills: number;
  matchesPlayed: number;
  points: number;
}

interface LeaderboardPageProps {
  onSelectPlayerProfile?: (userId: string) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onSelectPlayerProfile }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filterGame, setFilterGame] = useState<'ALL' | 'FREE FIRE' | 'BGMI'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leaderboard');
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const remaining = leaderboard.slice(3);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
            DEV ESPORTS PRO RANKINGS
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-0.5">
            Hall of Fame & Top Earners
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Top competitive players and squads ranked by total cash prizes won and tournament kills.
          </p>
        </div>

        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-bold shrink-0">
          <button
            onClick={() => setFilterGame('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterGame === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Rankings
          </button>
          <button
            onClick={() => setFilterGame('FREE FIRE')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterGame === 'FREE FIRE' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Free Fire MAX
          </button>
          <button
            onClick={() => setFilterGame('BGMI')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterGame === 'BGMI' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            BGMI
          </button>
        </div>
      </div>

      {/* Podium Top 3 Cards */}
      {top3.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Rank 2 - Silver */}
          <div
            onClick={() => onSelectPlayerProfile && onSelectPlayerProfile(top3[1].userId)}
            className="order-2 md:order-1 p-6 rounded-2xl bg-zinc-950 border border-zinc-700/80 hover:border-zinc-500 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 relative shadow-xl hover:-translate-y-1"
            title="Click to view full Gamer Profile & Achievements"
          >
            <div className="w-14 h-14 rounded-2xl bg-zinc-800 border-2 border-zinc-400 flex items-center justify-center text-zinc-200">
              <Medal className="w-8 h-8 text-zinc-300" />
            </div>
            <span className="px-2.5 py-0.5 bg-zinc-800 border border-zinc-600 rounded-full text-zinc-300 font-black text-xs">
              RANK #2
            </span>
            <div>
              <h3 className="font-display font-black text-xl text-white hover:text-emerald-400 transition-colors">{top3[1].inGameName}</h3>
              <p className="text-xs text-zinc-400">{top3[1].name}</p>
            </div>
            <div className="w-full pt-3 border-t border-zinc-800 flex justify-around text-xs font-mono-num">
              <div>
                <span className="text-[10px] text-zinc-500 block">TOTAL CASH</span>
                <span className="font-black text-emerald-400 text-base">₹{top3[1].totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block">KILLS</span>
                <span className="font-black text-white text-base">{top3[1].kills}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block">PTS</span>
                <span className="font-black text-cyan-400 text-base">{top3[1].points}</span>
              </div>
            </div>
          </div>

          {/* Rank 1 - Champion Gold (Center elevated) */}
          <div
            onClick={() => onSelectPlayerProfile && onSelectPlayerProfile(top3[0].userId)}
            className="order-1 md:order-2 p-6 rounded-2xl bg-gradient-to-b from-amber-950/40 via-zinc-950 to-zinc-950 border-2 border-amber-400 hover:border-amber-300 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 relative shadow-[0_0_35px_rgba(245,158,11,0.25)] md:-translate-y-2 hover:-translate-y-3"
            title="Click to view full Gamer Profile & Achievements"
          >
            <div className="w-16 h-16 rounded-2xl bg-amber-500 border-2 border-amber-300 flex items-center justify-center text-black shadow-lg">
              <Trophy className="w-9 h-9 fill-current" />
            </div>
            <span className="px-3 py-0.5 bg-amber-500 text-black font-black text-xs rounded-full uppercase tracking-wider">
              👑 RANK #1 CHAMPION
            </span>
            <div>
              <h3 className="font-display font-black text-2xl text-white hover:text-amber-300 transition-colors tracking-wide">{top3[0].inGameName}</h3>
              <p className="text-xs text-amber-300 font-bold">{top3[0].name}</p>
            </div>
            <div className="w-full pt-3 border-t border-zinc-800 flex justify-around text-xs font-mono-num">
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold">TOTAL WON</span>
                <span className="font-black text-emerald-400 text-lg">₹{top3[0].totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold">KILLS</span>
                <span className="font-black text-white text-lg">{top3[0].kills}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-400 block font-bold">POINTS</span>
                <span className="font-black text-amber-300 text-lg">{top3[0].points}</span>
              </div>
            </div>
          </div>

          {/* Rank 3 - Bronze */}
          <div
            onClick={() => onSelectPlayerProfile && onSelectPlayerProfile(top3[2].userId)}
            className="order-3 p-6 rounded-2xl bg-zinc-950 border border-amber-900/60 hover:border-amber-700 cursor-pointer transition-all flex flex-col items-center text-center space-y-3 relative shadow-xl hover:-translate-y-1"
            title="Click to view full Gamer Profile & Achievements"
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border-2 border-amber-700 flex items-center justify-center text-amber-500">
              <Award className="w-8 h-8" />
            </div>
            <span className="px-2.5 py-0.5 bg-amber-950 border border-amber-800 rounded-full text-amber-400 font-black text-xs">
              RANK #3
            </span>
            <div>
              <h3 className="font-display font-black text-xl text-white">{top3[2].inGameName}</h3>
              <p className="text-xs text-zinc-400">{top3[2].name}</p>
            </div>
            <div className="w-full pt-3 border-t border-zinc-800 flex justify-around text-xs font-mono-num">
              <div>
                <span className="text-[10px] text-zinc-500 block">TOTAL CASH</span>
                <span className="font-black text-emerald-400 text-base">₹{top3[2].totalEarnings.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block">KILLS</span>
                <span className="font-black text-white text-base">{top3[2].kills}</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block">PTS</span>
                <span className="font-black text-purple-400 text-base">{top3[2].points}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs font-bold text-zinc-400">
          <span>ALL PLAYERS STANDINGS</span>
          <span className="text-emerald-400 font-mono-num">Updated Live</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Player & IGN</th>
                <th className="py-3 px-4">Game IDs</th>
                <th className="py-3 px-4 text-center">Matches</th>
                <th className="py-3 px-4 text-center">Kills</th>
                <th className="py-3 px-4 text-center">Points</th>
                <th className="py-3 px-4 text-right">Total Cash Won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 font-mono-num">
              {leaderboard.map((player, idx) => (
                <tr
                  key={player.userId}
                  onClick={() => onSelectPlayerProfile && onSelectPlayerProfile(player.userId)}
                  className="hover:bg-zinc-900/60 cursor-pointer transition-colors group"
                  title="Click to view Gamer Profile, Stats & Achievements"
                >
                  <td className="py-3.5 px-4 font-black">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-display ${
                        idx === 0
                          ? 'bg-amber-500 text-black'
                          : idx === 1
                          ? 'bg-zinc-300 text-black'
                          : idx === 2
                          ? 'bg-amber-800 text-amber-200'
                          : 'bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white text-sm block font-sans leading-tight group-hover:text-emerald-400 transition-colors">
                      {player.inGameName}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-sans block mt-0.5">
                      {player.name}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-zinc-400">
                    <div>FF: <span className="text-amber-400">{player.ffUid || '—'}</span></div>
                    <div>BGMI: <span className="text-cyan-400">{player.bgmiId || '—'}</span></div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-zinc-300">
                    {player.matchesPlayed}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-white">
                    {player.kills}
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-cyan-400">
                    {player.points}
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-emerald-400 text-sm">
                    ₹{player.totalEarnings.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
