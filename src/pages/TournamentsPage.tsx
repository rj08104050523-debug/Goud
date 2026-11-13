import React, { useState } from 'react';
import { Search, Filter, Trophy, AlertCircle, CheckCircle, Shield, Calendar, TrendingUp, Clock, Flame } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Tournament } from '../shared/tournamentRules';
import { TournamentCard } from '../components/TournamentCard';
import { useAuth } from '../context/AuthContext';

interface TournamentsPageProps {
  tournaments: Tournament[];
  userRegisteredTournamentIds: Set<string>;
  initialGameFilter?: 'ALL' | 'FREE FIRE MAX' | 'BGMI';
  onRegisterSuccess: () => void;
  onOpenWallet: () => void;
  onViewRoomDetails: (tournament: Tournament) => void;
}

export const TournamentsPage: React.FC<TournamentsPageProps> = ({
  tournaments,
  userRegisteredTournamentIds,
  initialGameFilter = 'ALL',
  onRegisterSuccess,
  onOpenWallet,
  onViewRoomDetails,
}) => {
  const { user, token } = useAuth();

  const [gameFilter, setGameFilter] = useState<'ALL' | 'FREE FIRE MAX' | 'BGMI'>(initialGameFilter);
  const [matchTypeFilter, setMatchTypeFilter] = useState<'ALL' | 'SOLO' | 'DUO' | 'SQUAD'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UPCOMING' | 'LIVE' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected tournament for booking modal
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [teamName, setTeamName] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter list
  const filtered = tournaments.filter((t) => {
    if (gameFilter !== 'ALL' && t.game !== gameFilter) return false;
    if (matchTypeFilter !== 'ALL' && t.matchType !== matchTypeFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match = t.title.toLowerCase().includes(q) || t.map.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleOpenJoin = (tourney: Tournament) => {
    setSelectedTournament(tourney);
    setBookingError(null);
    setBookingSuccess(false);
    setTeamName(user?.inGameName ? `${user.inGameName}'s Squad` : '');
  };

  const handleConfirmRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTournament || !token) return;

    setBookingError(null);
    setIsBooking(true);

    try {
      const res = await fetch(`/api/tournaments/${selectedTournament.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teamName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBookingSuccess(true);
      onRegisterSuccess();
      setTimeout(() => {
        setSelectedTournament(null);
        setBookingSuccess(false);
      }, 1800);
    } catch (err: any) {
      setBookingError(err.message || 'Slot booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const participationTrendData = [
    { day: 'Mon', players: 1420, matches: 16, prizeDistributed: '₹48k' },
    { day: 'Tue', players: 1780, matches: 20, prizeDistributed: '₹62k' },
    { day: 'Wed', players: 2150, matches: 24, prizeDistributed: '₹75k' },
    { day: 'Thu', players: 2490, matches: 28, prizeDistributed: '₹88k' },
    { day: 'Fri', players: 3250, matches: 36, prizeDistributed: '₹120k' },
    { day: 'Sat', players: 4120, matches: 46, prizeDistributed: '₹165k' },
    { day: 'Sun (Today)', players: 4890, matches: 54, prizeDistributed: '₹195k' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
            DEV ESPORTS TOURNAMENT ARENA
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight mt-0.5">
            Competitive Daily Cash Tournaments
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Pick your battleground, book your verified slot, and win direct cash rewards.
          </p>
        </div>

        {/* Game Quick Switcher */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-bold shrink-0">
          <button
            onClick={() => setGameFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              gameFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => setGameFilter('FREE FIRE MAX')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              gameFilter === 'FREE FIRE MAX' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Free Fire MAX
          </button>
          <button
            onClick={() => setGameFilter('BGMI')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              gameFilter === 'BGMI' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            BGMI
          </button>
        </div>
      </div>

      {/* Tournament Schedule & 7-Day Participation Trends Section */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-black border border-zinc-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl text-white tracking-wide uppercase">
                  Tournament Schedule & Participation Trends
                </h2>
                <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full">
                  LIVE 7-DAY METRICS
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Real-time player registrations and slot bookings across Free Fire MAX and BGMI daily circuits.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-num">
            <div className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">7D TOTAL PLAYERS</span>
              <span className="text-sm font-black text-emerald-400">20,100+</span>
            </div>
            <div className="px-3 py-1.5 bg-zinc-900/80 border border-zinc-800 rounded-xl">
              <span className="text-[10px] text-zinc-500 uppercase block font-bold">PEAK TODAY</span>
              <span className="text-sm font-black text-cyan-400">4,890 Active</span>
            </div>
          </div>
        </div>

        {/* Visual Recharts Area Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={participationTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="playerGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="matchGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                />
                <YAxis
                  stroke="#71717a"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#09090b',
                    borderColor: '#27272a',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#ffffff',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.8)',
                  }}
                  itemStyle={{ padding: '2px 0' }}
                  labelStyle={{ fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}
                />
                <Area
                  type="monotone"
                  dataKey="players"
                  name="Players Registered"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#playerGlow)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Schedule Timetable highlight */}
          <div className="bg-black/60 border border-zinc-800 rounded-2xl p-4 space-y-3 font-mono-num">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-3.5 h-3.5" />
                <span>TODAY&apos;S SCHEDULE SLOTS</span>
              </span>
              <span className="text-[10px] text-emerald-400">AUTO ROOM DROP</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 bg-zinc-900/70 border border-zinc-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">04:00 PM IST</div>
                  <div className="text-[10px] text-amber-400">FF MAX Bermuda Solo</div>
                </div>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">
                  Room Open
                </span>
              </div>

              <div className="p-2 bg-zinc-900/70 border border-zinc-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">07:30 PM IST</div>
                  <div className="text-[10px] text-cyan-400">BGMI Erangel Mega Squad</div>
                </div>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded">
                  7 Slots Left
                </span>
              </div>

              <div className="p-2 bg-zinc-900/70 border border-zinc-800/80 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">09:00 PM IST</div>
                  <div className="text-[10px] text-purple-400">FF MAX Kalahari Duo</div>
                </div>
                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-bold rounded">
                  Fast Filling
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by tournament title or map (e.g. Bermuda, Erangel)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Match Type Pills */}
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span className="text-zinc-500 mr-1 text-[11px] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Format:</span>
          </span>
          {(['ALL', 'SOLO', 'DUO', 'SQUAD'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setMatchTypeFilter(type)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                matchTypeFilter === type
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 text-xs font-bold">
          {(['ALL', 'UPCOMING', 'LIVE', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                statusFilter === st
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Tournaments Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
          <Trophy className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="font-display font-black text-xl text-white">NO MATCHES FOUND</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            No tournaments currently match your selected filters. Try switching the game or match format.
          </p>
          <button
            onClick={() => {
              setGameFilter('ALL');
              setMatchTypeFilter('ALL');
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-bold text-white hover:bg-zinc-800"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tourney) => (
            <TournamentCard
              key={tourney.id}
              tournament={tourney}
              isRegistered={userRegisteredTournamentIds.has(tourney.id)}
              onJoin={handleOpenJoin}
              onViewRoom={onViewRoomDetails}
            />
          ))}
        </div>
      )}

      {/* Interactive Match Slot Booking Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold">
                  🎟️
                </span>
                <div>
                  <h3 className="font-display font-black text-lg text-white leading-none">
                    CONFIRM MATCH SLOT
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {selectedTournament.game} · {selectedTournament.matchType} · Map: {selectedTournament.map}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTournament(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              {bookingSuccess ? (
                <div className="p-6 bg-emerald-950/40 border border-emerald-500 rounded-2xl text-center space-y-2">
                  <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-display font-black text-xl text-white">
                    SLOT BOOKING CONFIRMED!
                  </h4>
                  <p className="text-xs text-zinc-300">
                    Your slot is locked. Room ID and password will be released 15 minutes before match start in your dashboard.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmRegistration} className="space-y-4">
                  {bookingError && (
                    <div className="p-3 bg-red-950/50 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}

                  {/* Tournament Title & Details */}
                  <div className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white text-sm">{selectedTournament.title}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-num">
                      <div className="p-2 bg-black/60 rounded-lg">
                        <span className="text-[10px] text-zinc-400 block">ENTRY FEE</span>
                        <span className="text-sm font-black text-amber-300">
                          ₹{selectedTournament.entryFee}
                        </span>
                      </div>
                      <div className="p-2 bg-black/60 rounded-lg">
                        <span className="text-[10px] text-zinc-400 block">PRIZE POOL</span>
                        <span className="text-sm font-black text-emerald-400">
                          ₹{selectedTournament.prizePool.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Check & Balance Strip */}
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-400 block font-bold">YOUR WALLET BALANCE</span>
                      <span className="text-sm font-black font-mono-num text-white">
                        ₹{user?.walletBalance ?? 0}
                      </span>
                    </div>

                    {(user?.walletBalance ?? 0) < selectedTournament.entryFee ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTournament(null);
                          onOpenWallet();
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-lg"
                      >
                        + Add Money
                      </button>
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-400">
                        ✓ Balance Sufficient
                      </span>
                    )}
                  </div>

                  {/* UID Info display */}
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1 text-xs">
                    <span className="font-bold text-zinc-400 text-[10px] uppercase">
                      IN-GAME PLAYER CREDENTIALS
                    </span>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>IGN: <strong>{user?.inGameName || 'Not Set'}</strong></span>
                      <span>
                        {selectedTournament.game === 'FREE FIRE MAX'
                          ? `FF UID: ${user?.ffUid || 'Missing ⚠️'}`
                          : `BGMI ID: ${user?.bgmiId || 'Missing ⚠️'}`}
                      </span>
                    </div>
                  </div>

                  {/* Team Name for Duo / Squad */}
                  {selectedTournament.matchType !== 'SOLO' && (
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 mb-1">
                        Team / Squad Name:
                      </label>
                      <input
                        type="text"
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="e.g. Team Dev Assassins"
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isBooking || (user?.walletBalance ?? 0) < selectedTournament.entryFee}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg transition-transform active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>
                      {isBooking
                        ? 'BOOKING SLOT...'
                        : `PAY ₹${selectedTournament.entryFee} & CONFIRM SLOT`}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
