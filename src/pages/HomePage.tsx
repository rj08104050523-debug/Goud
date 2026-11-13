import React from 'react';
import {
  Flame,
  Trophy,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Users,
  MessageCircle,
} from 'lucide-react';
import { Tournament } from '../shared/tournamentRules';
import { TournamentCard } from '../components/TournamentCard';

interface HomePageProps {
  tournaments: Tournament[];
  userRegisteredTournamentIds: Set<string>;
  onSelectTab: (tab: string) => void;
  onJoinTournament: (tournament: Tournament) => void;
  onViewRoomDetails: (tournament: Tournament) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  tournaments,
  userRegisteredTournamentIds,
  onSelectTab,
  onJoinTournament,
  onViewRoomDetails,
}) => {
  const featuredTournaments = tournaments.slice(0, 4);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-900/90 via-black to-zinc-950 p-6 sm:p-12 shadow-[0_0_60px_rgba(16,185,129,0.15)]">
        {/* Glow backdrop meshes */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>DAILY CASH BATTLEGROUNDS LIVE</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-white tracking-tight uppercase leading-[0.95]">
            PLAY TOURNAMENTS. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400">
              WIN REAL CASH PRIZES.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            India&apos;s verified esports tournament platform for <strong>Free Fire MAX</strong> and <strong>BGMI (PUBG Mobile)</strong>. Compete in Solo, Duo, and Squad matches with automated room credentials and instant 15-minute UPI payouts.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectTab('tournaments')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>EXPLORE MATCHES</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('free-fire')}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Free Fire MAX Tournaments
            </button>

            <button
              onClick={() => onSelectTab('bgmi')}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-cyan-500/40 text-cyan-300 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              BGMI Matches
            </button>

            <button
              onClick={() => onSelectTab('promo')}
              className="px-5 py-3 bg-zinc-900 hover:bg-zinc-800 border border-red-500/50 text-red-300 font-display font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
            >
              Watch 45s Promo Reel
            </button>
          </div>
        </div>

        {/* Live Metrics Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-8 border-t border-zinc-800/80 font-mono-num">
          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase block font-bold">REGISTERED PLAYERS</span>
            <span className="text-xl sm:text-2xl font-black text-white">18,450+</span>
          </div>

          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase block font-bold">TOTAL TOURNAMENTS</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">1,280+</span>
          </div>

          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase block font-bold">TOTAL CASH PAID OUT</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">₹42,50,000+</span>
          </div>

          <div className="p-3 bg-black/60 rounded-xl border border-zinc-800">
            <span className="text-xs text-zinc-500 uppercase block font-bold">PAYOUT SETTLEMENT</span>
            <span className="text-xl sm:text-2xl font-black text-cyan-400">⚡ 15 MINS UPI</span>
          </div>
        </div>
      </section>

      {/* Game Categories Selection Banner */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              SELECT YOUR ARENA
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide mt-0.5">
              Choose Game & Enter Battleground
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free Fire MAX Card */}
          <div
            onClick={() => onSelectTab('free-fire')}
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-amber-950/20 border-2 border-amber-500/40 hover:border-amber-400 cursor-pointer overflow-hidden transition-all shadow-xl"
          >
            <div className="relative z-10 space-y-2">
              <span className="px-2.5 py-0.5 bg-amber-500 text-black text-[10px] font-black rounded uppercase tracking-wider">
                GARENA FREE FIRE MAX
              </span>
              <h3 className="font-display font-black text-3xl text-white group-hover:text-amber-400 transition-colors">
                FREE FIRE CASH CUPS
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm">
                Bermuda, Purgatory & Kalahari maps. Solo Headshot Bounties & Squad Carnage matches running every hour.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-400">
                <span>View Free Fire Matches</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* BGMI Card */}
          <div
            onClick={() => onSelectTab('bgmi')}
            className="group relative p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-cyan-950/20 border-2 border-cyan-500/40 hover:border-cyan-400 cursor-pointer overflow-hidden transition-all shadow-xl"
          >
            <div className="relative z-10 space-y-2">
              <span className="px-2.5 py-0.5 bg-cyan-500 text-black text-[10px] font-black rounded uppercase tracking-wider">
                BATTLEGROUNDS MOBILE INDIA
              </span>
              <h3 className="font-display font-black text-3xl text-white group-hover:text-cyan-400 transition-colors">
                BGMI PRO WARS
              </h3>
              <p className="text-xs text-zinc-300 max-w-sm">
                Erangel Classic, Miramar Sniper duels & Sanhok Bootcamp Squad clashes with official competitive point systems.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-cyan-400">
                <span>View BGMI Matches</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Live & Upcoming Tournaments */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              LIVE & UPCOMING MATCHES
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide mt-0.5">
              Today&apos;s Featured Cash Tournaments
            </h2>
          </div>

          <button
            onClick={() => onSelectTab('tournaments')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>See All ({tournaments.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredTournaments.map((tourney) => (
            <TournamentCard
              key={tourney.id}
              tournament={tourney}
              isRegistered={userRegisteredTournamentIds.has(tourney.id)}
              onJoin={onJoinTournament}
              onViewRoom={onViewRoomDetails}
            />
          ))}
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="p-8 rounded-3xl bg-zinc-950 border border-zinc-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            SIMPLE 4-STEP PROCESS
          </span>
          <h2 className="font-display font-black text-3xl text-white">
            HOW TO PLAY & WIN ON DEV ESPORTS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-2">
            <span className="font-display font-black text-2xl text-emerald-400">01</span>
            <h4 className="font-display font-bold text-base text-white">SELECT MATCH</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Choose Free Fire or BGMI match format (Solo, Duo, or Squad) matching your schedule.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-2">
            <span className="font-display font-black text-2xl text-purple-400">02</span>
            <h4 className="font-display font-bold text-base text-white">BOOK YOUR SLOT</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use your wallet balance to pay the small entry fee and confirm your slot number.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-2">
            <span className="font-display font-black text-2xl text-cyan-400">03</span>
            <h4 className="font-display font-bold text-base text-white">GET ROOM ID & PASS</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              15 mins before match, access room credentials directly on your dashboard.
            </p>
          </div>

          <div className="p-4 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl space-y-2">
            <span className="font-display font-black text-2xl text-amber-400">04</span>
            <h4 className="font-display font-bold text-base text-white">INSTANT CASH PRIZE</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Admin publishes results and prizes are credited to your UPI within 15 minutes!
            </p>
          </div>
        </div>
      </section>

      {/* Recent Champions Payout Wall */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              HALL OF FAME & PROOFS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide mt-0.5">
              Recent Booyah & Chicken Dinner Winners
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('leaderboard')}
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Full Leaderboard →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-black/80 border border-amber-500/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-400 flex items-center gap-1">
                <span>🔥 BOOYAH!</span>
                <span>(Free Fire)</span>
              </span>
              <span className="font-mono-num text-emerald-400">+₹2,750</span>
            </div>
            <div className="text-base font-black text-white font-display">
              DEV_Sniper99 (Team Alpha)
            </div>
            <p className="text-[11px] text-zinc-400">
              14 Kills · Bermuda Squad Pro Cup · Settled via UPI
            </p>
          </div>

          <div className="p-4 bg-black/80 border border-cyan-500/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-cyan-400 flex items-center gap-1">
                <span>🍗 CHICKEN DINNER!</span>
                <span>(BGMI)</span>
              </span>
              <span className="font-mono-num text-emerald-400">+₹3,500</span>
            </div>
            <div className="text-base font-black text-white font-display">
              ShadowKiller OP Squad
            </div>
            <p className="text-[11px] text-zinc-400">
              19 Kills · Erangel Mega War · Settled via Paytm
            </p>
          </div>

          <div className="p-4 bg-black/80 border border-purple-500/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-purple-400 flex items-center gap-1">
                <span>🎯 SNIPER CHAMPION</span>
              </span>
              <span className="font-mono-num text-emerald-400">+₹1,800</span>
            </div>
            <div className="text-base font-black text-white font-display">
              GodOP_Clutch
            </div>
            <p className="text-[11px] text-zinc-400">
              9 Headshot Kills · Kalahari Solo · Settled via UPI
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Community Banner */}
      <section className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-black to-emerald-950/70 border-2 border-emerald-500/60 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_35px_rgba(16,185,129,0.25)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-black shrink-0">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white leading-tight">
              Join Dev eSports Official WhatsApp Group
            </h3>
            <p className="text-xs text-zinc-300 mt-0.5">
              Get match alerts, room ID updates, and 24/7 organizer support on WhatsApp.
            </p>
          </div>
        </div>

        <a
          href="https://chat.whatsapp.com/DevEsportsOfficial"
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shrink-0 transition-transform active:scale-95"
        >
          JOIN WHATSAPP NOW
        </a>
      </section>
    </div>
  );
};
