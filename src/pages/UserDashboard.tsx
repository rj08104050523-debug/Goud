import React, { useState, useEffect } from 'react';
import {
  User,
  Key,
  Wallet,
  Bell,
  Clock,
  Shield,
  CheckCircle,
  Copy,
  Check,
  Edit2,
  Save,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Tournament } from '../shared/tournamentRules';

interface UserDashboardProps {
  onOpenWallet: () => void;
  onViewRoomDetails: (tournament: Tournament) => void;
  onExploreMatches: () => void;
  onNavigateProfile?: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onOpenWallet,
  onViewRoomDetails,
  onExploreMatches,
  onNavigateProfile,
}) => {
  const { user, token, updateProfile, refreshUser } = useAuth();
  const [joinedTournaments, setJoinedTournaments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [inGameName, setInGameName] = useState(user?.inGameName || '');
  const [ffUid, setFfUid] = useState(user?.ffUid || '');
  const [bgmiId, setBgmiId] = useState(user?.bgmiId || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch joined tournaments
      const tourRes = await fetch('/api/user/tournaments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (tourRes.ok) {
        const d = await tourRes.json();
        setJoinedTournaments(d.tournaments || []);
      }

      // Fetch notifications
      const notifRes = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (notifRes.ok) {
        const d = await notifRes.json();
        setNotifications(d.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfile({ inGameName, ffUid, bgmiId });
    if (res.success) {
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      {/* Profile & Wallet Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-xl">
        {/* Left: User Profile */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 via-purple-600 to-cyan-500 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center font-display font-black text-2xl text-white">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display font-black text-2xl sm:text-3xl text-white leading-none">
                {user.name}
              </h1>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-bold uppercase">
                ACTIVE PLAYER
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono-num">{user.email} · {user.mobile || 'No mobile'}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono-num">
              <span className="text-zinc-300">
                IGN: <strong className="text-white">{user.inGameName}</strong>
              </span>
              <span>·</span>
              <span className="text-amber-400">
                FF UID: <strong>{user.ffUid || 'Not Linked'}</strong>
              </span>
              <span>·</span>
              <span className="text-cyan-400">
                BGMI ID: <strong>{user.bgmiId || 'Not Linked'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Wallet & Quick Actions */}
        <div className="lg:col-span-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 p-4 bg-zinc-900/60 border border-zinc-800 rounded-2xl">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              TOTAL WALLET BALANCE
            </span>
            <span className="text-2xl font-black font-mono-num text-emerald-400 block leading-tight">
              ₹{user.walletBalance.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-amber-300 font-mono-num block">
              Winning Balance: ₹{user.winningBalance.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <button
              onClick={onOpenWallet}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>WALLET & UPI</span>
            </button>
            {onNavigateProfile && (
              <button
                onClick={onNavigateProfile}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-900/60 to-zinc-900 hover:to-zinc-800 border border-purple-500/50 text-purple-300 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors"
              >
                <Trophy className="w-3 h-3 text-purple-400" />
                <span>Gamer Profile & Badges</span>
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded-lg flex items-center justify-center gap-1"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit Game UIDs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit UIDs Form Drawer */}
      {isEditing && (
        <form onSubmit={handleSaveProfile} className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3 animate-in fade-in">
          <h3 className="font-display font-black text-sm text-white uppercase tracking-wider">
            UPDATE IN-GAME CHARACTER IDENTIFIERS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">In-Game Name (IGN):</label>
              <input
                type="text"
                required
                value={inGameName}
                onChange={(e) => setInGameName(e.target.value)}
                className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-mono-num"
              />
            </div>
            <div>
              <label className="block text-amber-400 mb-1">Free Fire UID:</label>
              <input
                type="text"
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value)}
                placeholder="e.g. 789234510"
                className="w-full px-3 py-1.5 bg-zinc-900 border border-amber-500/40 rounded-lg text-white font-mono-num"
              />
            </div>
            <div>
              <label className="block text-cyan-400 mb-1">BGMI Character ID:</label>
              <input
                type="text"
                value={bgmiId}
                onChange={(e) => setBgmiId(e.target.value)}
                placeholder="e.g. 5192837465"
                className="w-full px-3 py-1.5 bg-zinc-900 border border-cyan-500/40 rounded-lg text-white font-mono-num"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-lg flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 bg-zinc-800 text-zinc-400 text-xs rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Profile and game UIDs updated successfully.</span>
        </div>
      )}

      {/* Main 2-Column: Joined Matches & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): My Joined Matches & Room Credentials */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-400" />
              <h2 className="font-display font-black text-xl text-white tracking-wide">
                MY JOINED MATCHES ({joinedTournaments.length})
              </h2>
            </div>
            <button
              onClick={onExploreMatches}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Book More Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {joinedTournaments.length === 0 ? (
            <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
              <p className="text-xs text-zinc-400">
                You haven&apos;t registered for any tournaments yet.
              </p>
              <button
                onClick={onExploreMatches}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
              >
                BROWSE TOURNAMENTS & BOOK A SLOT
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {joinedTournaments.map((t) => (
                <div
                  key={t.id}
                  className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded text-[10px] font-black uppercase">
                        SLOT #{t.slotNumber} BOOKED
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">
                        {t.game} · {t.matchType}
                      </span>
                    </div>

                    <h3 className="font-display font-black text-lg text-white">
                      {t.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono-num">
                      <span>Map: {t.map}</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t.matchTime}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <span className="text-xs font-mono-num text-amber-300 font-bold">
                      Prize Pool: ₹{t.prizePool}
                    </span>

                    {t.roomReleased ? (
                      <button
                        onClick={() => onViewRoomDetails(t)}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-1.5 animate-pulse"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>VIEW ROOM ID & PASS 🔑</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] text-zinc-400 font-mono-num">
                        Room ID unlocks 15m before match
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Notifications & Live Alerts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h2 className="font-display font-black text-xl text-white tracking-wide">
              NOTIFICATIONS & ALERTS
            </h2>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
            {notifications.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">No notifications yet.</p>
            ) : (
              notifications.slice(0, 6).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white leading-tight">
                      {notif.title}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono-num">
                      {notif.createdAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
