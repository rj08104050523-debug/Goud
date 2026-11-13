import React, { useState, useEffect } from 'react';
import {
  Shield,
  PlusCircle,
  Key,
  Trophy,
  Users,
  Wallet,
  Bell,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Tournament } from '../shared/tournamentRules';

export const AdminDashboard: React.FC = () => {
  const { user, token, logout, login, quickSwitch } = useAuth();

  // Admin login form states
  const [adminEmail, setAdminEmail] = useState('admin@devesports.com');
  const [adminPass, setAdminPass] = useState('Admin@123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active admin tab
  const [adminTab, setAdminTab] = useState<
    'overview' | 'tournaments' | 'room-dispatch' | 'results' | 'withdrawals' | 'users' | 'broadcast'
  >('overview');

  // Metrics
  const [metrics, setMetrics] = useState<any>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Tournament creation modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGame, setNewGame] = useState<'FREE FIRE MAX' | 'BGMI'>('FREE FIRE MAX');
  const [newType, setNewType] = useState<'SOLO' | 'DUO' | 'SQUAD'>('SOLO');
  const [newMap, setNewMap] = useState('Bermuda');
  const [newEntryFee, setNewEntryFee] = useState(30);
  const [newPrizePool, setNewPrizePool] = useState(2000);
  const [newMaxSlots, setNewMaxSlots] = useState(48);
  const [newDate, setNewDate] = useState('Today');
  const [newTime, setNewTime] = useState('07:00 PM IST');
  const [createMsg, setCreateMsg] = useState<string | null>(null);

  // Room dispatch state
  const [selectedTourneyForRoom, setSelectedTourneyForRoom] = useState<string>('');
  const [dispatchRoomId, setDispatchRoomId] = useState('');
  const [dispatchRoomPass, setDispatchRoomPass] = useState('');
  const [roomMsg, setRoomMsg] = useState<string | null>(null);

  // Results & Winners declaration state
  const [selectedTourneyForResults, setSelectedTourneyForResults] = useState<string>('');
  const [winner1Uid, setWinner1Uid] = useState('789234510');
  const [winner1Name, setWinner1Name] = useState('DEV_Sniper99');
  const [winner1Kills, setWinner1Kills] = useState(14);
  const [winner1Prize, setWinner1Prize] = useState(1200);

  const [winner2Uid, setWinner2Uid] = useState('891029384');
  const [winner2Name, setWinner2Name] = useState('ShadowKiller_OP');
  const [winner2Kills, setWinner2Kills] = useState(8);
  const [winner2Prize, setWinner2Prize] = useState(500);

  const [resultsMsg, setResultsMsg] = useState<string | null>(null);

  // Broadcast state
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastMsg, setBroadcastMsg] = useState<string | null>(null);

  // Search user
  const [userSearch, setUserSearch] = useState('');

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin && token) {
      fetchAdminData();
    }
  }, [isAdmin, token]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Metrics
      const mRes = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (mRes.ok) {
        const mData = await mRes.json();
        setMetrics(mData);
      }

      // Tournaments
      const tRes = await fetch('/api/tournaments');
      if (tRes.ok) {
        const tData = await tRes.json();
        setTournaments(tData.tournaments || []);
        if (tData.tournaments?.length > 0 && !selectedTourneyForRoom) {
          setSelectedTourneyForRoom(tData.tournaments[0].id);
          setSelectedTourneyForResults(tData.tournaments[0].id);
        }
      }

      // Withdrawals
      const wRes = await fetch('/api/admin/withdrawals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (wRes.ok) {
        const wData = await wRes.json();
        setWithdrawals(wData.withdrawals || []);
      }

      // Users
      const uRes = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (uRes.ok) {
        const uData = await uRes.json();
        setAllUsers(uData.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    const res = await login(adminEmail, adminPass);
    setLoggingIn(false);
    if (!res.success) {
      setLoginError(res.error || 'Admin verification failed');
    }
  };

  const handleCreateTournament = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg(null);
    try {
      const res = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          game: newGame,
          matchType: newType,
          map: newMap,
          entryFee: Number(newEntryFee),
          prizePool: Number(newPrizePool),
          maxSlots: Number(newMaxSlots),
          matchDate: newDate,
          matchTime: newTime,
          status: 'UPCOMING',
          roomReleased: false,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setCreateMsg('Tournament created and published live on public website!');
      setShowCreateModal(false);
      await fetchAdminData();
      setTimeout(() => setCreateMsg(null), 3000);
    } catch (err: any) {
      setCreateMsg(err.message);
    }
  };

  const handleDeleteTournament = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;
    try {
      const res = await fetch(`/api/admin/tournaments/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDispatchRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoomMsg(null);
    try {
      const res = await fetch(`/api/admin/tournaments/${selectedTourneyForRoom}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: dispatchRoomId,
          roomPassword: dispatchRoomPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setRoomMsg('Room ID and Password released! Registered players have been notified.');
      setDispatchRoomId('');
      setDispatchRoomPass('');
      await fetchAdminData();
      setTimeout(() => setRoomMsg(null), 4000);
    } catch (err: any) {
      setRoomMsg(err.message);
    }
  };

  const handleDeclareResults = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultsMsg(null);
    try {
      const results = [
        {
          rank: 1,
          playerOrTeamName: winner1Name,
          playerUid: winner1Uid,
          kills: Number(winner1Kills),
          prizeWon: Number(winner1Prize),
        },
        {
          rank: 2,
          playerOrTeamName: winner2Name,
          playerUid: winner2Uid,
          kills: Number(winner2Kills),
          prizeWon: Number(winner2Prize),
        },
      ];

      const res = await fetch(`/api/admin/tournaments/${selectedTourneyForResults}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ results }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResultsMsg('Results declared and winning prizes credited to winner wallets!');
      await fetchAdminData();
      setTimeout(() => setResultsMsg(null), 4000);
    } catch (err: any) {
      setResultsMsg(err.message);
    }
  };

  const handleProcessWithdrawal = async (id: string, approve: boolean, customNote?: string) => {
    const note = customNote || (approve ? 'Approved by Admin - Payout processed via UPI' : 'Withdrawal rejected: Account verification needed');
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approve, adminNote: note }),
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBlock = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/toggle-block`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastMsg(null);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: broadcastTitle, message: broadcastMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBroadcastMsg('Broadcast announcement sent to all players!');
      setBroadcastTitle('');
      setBroadcastMessage('');
      await fetchAdminData();
      setTimeout(() => setBroadcastMsg(null), 4000);
    } catch (err: any) {
      setBroadcastMsg(err.message);
    }
  };

  // IF NOT ADMIN, RENDER SECURE LOGIN PAGE
  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-950 border border-purple-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(139,92,246,0.2)] space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-400 mx-auto">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wider">
              DEV ESPORTS ADMIN PORTAL
            </h1>
            <p className="text-xs text-zinc-400">
              Authorized Tournament Administration & Match Operations
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-200">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 font-mono-num"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-purple-950/50"
            >
              {loggingIn ? 'VERIFYING...' : 'ENTER SECURE ADMIN PANEL'}
            </button>
          </form>

          {/* Quick Demo Fill helper */}
          <div className="pt-3 border-t border-zinc-800 text-center">
            <button
              onClick={() => quickSwitch('admin')}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-purple-500/40 text-purple-300 text-xs font-bold rounded-lg"
            >
              ⚡ Fast 1-Click Chief Admin Auto-Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN IS AUTHENTICATED -> RENDER COMPLETE ADMIN DASHBOARD
  return (
    <div className="space-y-8">
      {/* Admin Top Navigation & Header */}
      <div className="p-6 rounded-3xl bg-zinc-950 border border-purple-500/40 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border-2 border-purple-500 flex items-center justify-center text-purple-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-purple-500 text-black text-[10px] font-black rounded uppercase">
                SUPER ADMIN
              </span>
              <span className="text-xs text-zinc-400 font-mono-num">{user.email}</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight mt-0.5">
              Dev eSports Control Center
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => quickSwitch('gamer')}
            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-emerald-400 font-bold text-xs rounded-xl"
          >
            ← Switch to Gamer View
          </button>
          <button
            onClick={logout}
            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/60 text-red-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {createMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-xs text-emerald-300">
          {createMsg}
        </div>
      )}

      {/* Admin Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3 text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard KPI Metrics' },
          { id: 'tournaments', label: 'Manage Tournaments' },
          { id: 'room-dispatch', label: 'Release Room Credentials' },
          { id: 'results', label: 'Declare Winners & Prizes' },
          { id: 'withdrawals', label: `Withdrawal Requests (${withdrawals.filter((w) => w.status === 'PENDING').length})` },
          { id: 'users', label: 'Manage Users' },
          { id: 'broadcast', label: 'Broadcast Alerts' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              adminTab === tab.id
                ? 'bg-purple-600 text-white font-black shadow-lg shadow-purple-950/50'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. OVERVIEW TAB */}
      {adminTab === 'overview' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono-num">
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                TOTAL PLATFORM REVENUE
              </span>
              <span className="text-2xl font-black text-emerald-400 block mt-1">
                ₹{metrics.totalRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-zinc-500">From tournament entry fees</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                ACTIVE TOURNAMENTS
              </span>
              <span className="text-2xl font-black text-white block mt-1">
                {metrics.activeTournaments} / {metrics.totalTournaments}
              </span>
              <span className="text-[10px] text-cyan-400">Scheduled / Live</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                TOTAL REGISTRATIONS
              </span>
              <span className="text-2xl font-black text-amber-400 block mt-1">
                {metrics.totalRegistrations}
              </span>
              <span className="text-[10px] text-zinc-500">Across all matches</span>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                PENDING PAYOUTS
              </span>
              <span className="text-2xl font-black text-red-400 block mt-1">
                ₹{metrics.pendingWithdrawalsAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-zinc-500">{metrics.pendingWithdrawalsCount} requests waiting</span>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 space-y-3">
            <h3 className="font-display font-black text-lg text-white">
              RECENT ADMIN AUDIT LOGS
            </h3>
            <div className="space-y-2">
              {metrics.recentLogs.map((log: any) => (
                <div
                  key={log.id}
                  className="p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-purple-400 block">{log.action}: {log.target}</span>
                    <span className="text-zinc-400 text-[11px]">{log.details}</span>
                  </div>
                  <span className="text-zinc-500 text-[10px] font-mono-num">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. TOURNAMENTS TAB */}
      {adminTab === 'tournaments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-xl text-white">
              TOURNAMENT REPOSITORY ({tournaments.length})
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>CREATE NEW TOURNAMENT</span>
            </button>
          </div>

          {/* Tournament List Table */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Title & Game</th>
                    <th className="py-3 px-4">Type & Map</th>
                    <th className="py-3 px-4 text-center">Entry</th>
                    <th className="py-3 px-4 text-center">Prize Pool</th>
                    <th className="py-3 px-4 text-center">Slots</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Room Released</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 font-mono-num">
                  {tournaments.map((t) => (
                    <tr key={t.id} className="hover:bg-zinc-900/40">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block font-sans">{t.title}</span>
                        <span className="text-[10px] text-zinc-400">{t.game}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-zinc-300">{t.matchType}</span>
                        <span className="text-[10px] text-zinc-500 block">Map: {t.map}</span>
                      </td>
                      <td className="py-3 px-4 text-center text-amber-300 font-black">
                        ₹{t.entryFee}
                      </td>
                      <td className="py-3 px-4 text-center text-emerald-400 font-black">
                        ₹{t.prizePool}
                      </td>
                      <td className="py-3 px-4 text-center text-zinc-300">
                        {t.registeredCount} / {t.maxSlots}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-900 text-zinc-300">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {t.roomReleased ? (
                          <span className="text-emerald-400 font-bold text-xs">✓ Released</span>
                        ) : (
                          <span className="text-zinc-500 text-xs">Pending</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTourneyForRoom(t.id);
                            setAdminTab('room-dispatch');
                          }}
                          className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900 border border-purple-500/50 text-purple-300 rounded text-[10px] font-bold"
                        >
                          Room ID
                        </button>
                        <button
                          onClick={() => handleDeleteTournament(t.id)}
                          className="p-1 text-red-400 hover:text-red-300"
                          title="Delete tournament"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TOURNAMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-white">
                CREATE ESPORTS TOURNAMENT
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateTournament} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">Tournament Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free Fire Purgatory Midnight War"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Game:</label>
                  <select
                    value={newGame}
                    onChange={(e: any) => setNewGame(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  >
                    <option value="FREE FIRE MAX">FREE FIRE MAX</option>
                    <option value="BGMI">BGMI / PUBG MOBILE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Match Type:</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  >
                    <option value="SOLO">SOLO</option>
                    <option value="DUO">DUO</option>
                    <option value="SQUAD">SQUAD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Map Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="Bermuda / Erangel / Miramar"
                    value={newMap}
                    onChange={(e) => setNewMap(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Max Participant Slots:</label>
                  <input
                    type="number"
                    required
                    value={newMaxSlots}
                    onChange={(e) => setNewMaxSlots(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Entry Fee (₹):</label>
                  <input
                    type="number"
                    required
                    value={newEntryFee}
                    onChange={(e) => setNewEntryFee(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-bold mb-1">Prize Pool (₹):</label>
                  <input
                    type="number"
                    required
                    value={newPrizePool}
                    onChange={(e) => setNewPrizePool(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono-num"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Match Date:</label>
                  <input
                    type="text"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Today / Tomorrow"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">Match Time:</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="08:30 PM IST"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg mt-2"
              >
                PUBLISH TOURNAMENT LIVE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. ROOM DISPATCH TAB */}
      {adminTab === 'room-dispatch' && (
        <div className="max-w-xl mx-auto p-6 bg-zinc-950 border border-purple-500/40 rounded-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Key className="w-6 h-6 text-purple-400" />
            <h2 className="font-display font-black text-2xl text-white">
              DISPATCH CUSTOM ROOM CREDENTIALS
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Publishing Room ID & Password immediately notifies all registered players and unlocks access on their user dashboards.
          </p>

          {roomMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-xs text-emerald-300">
              {roomMsg}
            </div>
          )}

          <form onSubmit={handleDispatchRoom} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Select Tournament:</label>
              <select
                value={selectedTourneyForRoom}
                onChange={(e) => setSelectedTourneyForRoom(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.game} · {t.registeredCount} Players)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Custom Room ID:</label>
              <input
                type="text"
                required
                placeholder="e.g. ROOM_FF_99218"
                value={dispatchRoomId}
                onChange={(e) => setDispatchRoomId(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Custom Room Password:</label>
              <input
                type="text"
                required
                placeholder="e.g. DEV_BERMUDA_PASS"
                value={dispatchRoomPass}
                onChange={(e) => setDispatchRoomPass(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg"
            >
              RELEASE TO REGISTERED PARTICIPANTS 🔑
            </button>
          </form>
        </div>
      )}

      {/* 4. RESULTS & WINNERS TAB */}
      {adminTab === 'results' && (
        <div className="max-w-2xl mx-auto p-6 bg-zinc-950 border border-amber-500/40 rounded-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-amber-400" />
            <h2 className="font-display font-black text-2xl text-white">
              DECLARE WINNERS & AUTO-CREDIT CASH PRIZES
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Publishing results marks the tournament as completed and automatically credits the specified prize money directly to the winner&apos;s wallet winning balance!
          </p>

          {resultsMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-xs text-emerald-300">
              {resultsMsg}
            </div>
          )}

          <form onSubmit={handleDeclareResults} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Select Tournament to Conclude:</label>
              <select
                value={selectedTourneyForResults}
                onChange={(e) => setSelectedTourneyForResults(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white"
              >
                {tournaments.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} (Prize: ₹{t.prizePool})
                  </option>
                ))}
              </select>
            </div>

            {/* Winner 1 */}
            <div className="p-3.5 bg-zinc-900/60 border border-amber-500/40 rounded-xl space-y-2">
              <span className="font-bold text-amber-400 block text-xs">👑 1ST PLACE WINNER (CHAMPION)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block">In-Game Name:</label>
                  <input
                    type="text"
                    required
                    value={winner1Name}
                    onChange={(e) => setWinner1Name(e.target.value)}
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block">UID:</label>
                  <input
                    type="text"
                    required
                    value={winner1Uid}
                    onChange={(e) => setWinner1Uid(e.target.value)}
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block">Kills:</label>
                  <input
                    type="number"
                    value={winner1Kills}
                    onChange={(e) => setWinner1Kills(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-400 block">Prize (₹):</label>
                  <input
                    type="number"
                    required
                    value={winner1Prize}
                    onChange={(e) => setWinner1Prize(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-black border border-emerald-500/40 rounded text-emerald-400 font-mono-num font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Winner 2 */}
            <div className="p-3.5 bg-zinc-900/60 border border-zinc-700 rounded-xl space-y-2">
              <span className="font-bold text-zinc-300 block text-xs">🥈 2ND PLACE WINNER</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block">In-Game Name:</label>
                  <input
                    type="text"
                    required
                    value={winner2Name}
                    onChange={(e) => setWinner2Name(e.target.value)}
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block">UID:</label>
                  <input
                    type="text"
                    required
                    value={winner2Uid}
                    onChange={(e) => setWinner2Uid(e.target.value)}
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block">Kills:</label>
                  <input
                    type="number"
                    value={winner2Kills}
                    onChange={(e) => setWinner2Kills(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white font-mono-num"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-emerald-400 block">Prize (₹):</label>
                  <input
                    type="number"
                    required
                    value={winner2Prize}
                    onChange={(e) => setWinner2Prize(Number(e.target.value))}
                    className="w-full px-2 py-1 bg-black border border-emerald-500/40 rounded text-emerald-400 font-mono-num font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-black font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg"
            >
              PUBLISH RESULTS & DISBURSE WALLET CASH 💰
            </button>
          </form>
        </div>
      )}

      {/* 5. WITHDRAWALS TAB */}
      {adminTab === 'withdrawals' && (
        <div className="space-y-4">
          <h2 className="font-display font-black text-xl text-white">
            PLAYER WITHDRAWAL REQUESTS
          </h2>

          {withdrawals.length === 0 ? (
            <p className="text-xs text-zinc-500">No withdrawal requests.</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((w) => (
                <div
                  key={w.id}
                  className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{w.userName}</span>
                      <span className="text-[10px] text-zinc-400 font-mono-num">{w.userEmail}</span>
                    </div>
                    <div className="text-xs font-mono-num text-zinc-300">
                      Amount: <strong className="text-emerald-400 font-bold">₹{w.amount}</strong> · Target UPI: <span className="text-amber-300">{w.upiId}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 block font-mono-num">Requested: {w.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {w.status === 'PENDING' ? (
                      <>
                        <button
                          onClick={() => handleProcessWithdrawal(w.id, true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Approve & Pay</span>
                        </button>
                        <button
                          onClick={() => handleProcessWithdrawal(w.id, false)}
                          className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-500/40 text-red-300 font-bold text-xs rounded-xl flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    ) : (
                      <span
                        className={`px-2.5 py-1 rounded text-xs font-bold uppercase font-mono-num ${
                          w.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'
                        }`}
                      >
                        {w.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. USERS MANAGEMENT TAB */}
      {adminTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-display font-black text-xl text-white">
              PLAYER ACCOUNTS ({allUsers.length})
            </h2>
            <input
              type="text"
              placeholder="Search by name, email or in-game UID..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-500 w-full sm:w-64"
            />
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-num">
                <thead className="bg-zinc-900/60 border-b border-zinc-800 text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-sans">
                  <tr>
                    <th className="py-3 px-4">Player & Email</th>
                    <th className="py-3 px-4">IGN & Game IDs</th>
                    <th className="py-3 px-4 text-center">Wallet</th>
                    <th className="py-3 px-4 text-center">Winnings</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {allUsers
                    .filter((u) => {
                      if (!userSearch.trim()) return true;
                      const q = userSearch.toLowerCase();
                      return (
                        u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q) ||
                        u.inGameName.toLowerCase().includes(q) ||
                        (u.ffUid && u.ffUid.includes(q)) ||
                        (u.bgmiId && u.bgmiId.includes(q))
                      );
                    })
                    .map((u) => (
                      <tr key={u.id} className="hover:bg-zinc-900/40">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block font-sans">{u.name}</span>
                          <span className="text-[10px] text-zinc-400">{u.email}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-emerald-400 font-sans block">{u.inGameName}</span>
                          <span className="text-[10px] text-zinc-500 block">FF: {u.ffUid || '—'} · BGMI: {u.bgmiId || '—'}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-white">
                          ₹{u.walletBalance}
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-amber-400">
                          ₹{u.winningBalance}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {u.isBlocked ? (
                            <span className="px-2 py-0.5 bg-red-950 text-red-400 text-[10px] font-bold rounded">
                              BLOCKED
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] font-bold rounded">
                              ACTIVE
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleBlock(u.id)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                              u.isBlocked
                                ? 'bg-emerald-600 text-black hover:bg-emerald-500'
                                : 'bg-red-900/60 text-red-300 hover:bg-red-900 border border-red-500/40'
                            }`}
                          >
                            {u.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. BROADCAST ANNOUNCEMENT TAB */}
      {adminTab === 'broadcast' && (
        <div className="max-w-xl mx-auto p-6 bg-zinc-950 border border-purple-500/40 rounded-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-purple-400" />
            <h2 className="font-display font-black text-2xl text-white">
              BROADCAST SYSTEM ANNOUNCEMENT
            </h2>
          </div>
          <p className="text-xs text-zinc-400">
            Send an instant notification banner to all registered players on the platform.
          </p>

          {broadcastMsg && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-500 rounded-xl text-xs text-emerald-300">
              {broadcastMsg}
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-300 mb-1">Alert Title:</label>
              <input
                type="text"
                required
                placeholder="e.g. ⚡ ₹10,000 Mega Sunday Cup Slots Open!"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-300 mb-1">Message Content:</label>
              <textarea
                required
                rows={3}
                placeholder="Enter alert details..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-display font-black text-sm uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>SEND BROADCAST NOTIFICATION</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
