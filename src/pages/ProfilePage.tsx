import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Zap,
  Crosshair,
  Coins,
  Shield,
  CheckCircle,
  Copy,
  Check,
  Edit2,
  Save,
  Clock,
  Key,
  Wallet,
  ArrowUpRight,
  Share2,
  ExternalLink,
  ChevronRight,
  Gamepad2,
  Sparkles,
  Lock,
  User,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  TournamentHistoryItem,
  UserStats,
  WinningsBreakdown,
  Achievement,
} from '../shared/profileRules';
import { Tournament, UserAccount } from '../shared/tournamentRules';

interface ProfilePageProps {
  onOpenWallet: () => void;
  onViewRoomDetails: (tournament: Tournament) => void;
  onExploreMatches: () => void;
  targetUserId?: string | null;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onOpenWallet,
  onViewRoomDetails,
  onExploreMatches,
  targetUserId,
}) => {
  const { user: authUser, token, updateProfile, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'tournaments' | 'achievements' | 'edit'>('overview');
  const [tournamentFilter, setTournamentFilter] = useState<'ALL' | 'COMPLETED' | 'UPCOMING' | 'WON'>('ALL');
  const [achievementFilter, setAchievementFilter] = useState<'ALL' | 'UNLOCKED' | 'LOCKED'>('ALL');

  // Loaded Profile Data
  const [profileUser, setProfileUser] = useState<UserAccount | null>(null);
  const [winnings, setWinnings] = useState<WinningsBreakdown | null>(null);
  const [tournamentHistory, setTournamentHistory] = useState<TournamentHistoryItem[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState('');
  const [editIgn, setEditIgn] = useState('');
  const [editFfUid, setEditFfUid] = useState('');
  const [editBgmiId, setEditBgmiId] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editDiscord, setEditDiscord] = useState('');
  const [editRole, setEditRole] = useState<'Rusher' | 'Sniper' | 'IGL' | 'Assault' | 'Support'>('Rusher');
  const [editGame, setEditGame] = useState<'FREE FIRE MAX' | 'BGMI' | 'BOTH'>('BOTH');
  const [editMobile, setEditMobile] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Copied toast indicators
  const [copiedFf, setCopiedFf] = useState(false);
  const [copiedBgmi, setCopiedBgmi] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const isOwnProfile = !targetUserId || (authUser && authUser.id === targetUserId);

  useEffect(() => {
    fetchProfileData();
  }, [targetUserId, token]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const endpoint = targetUserId
        ? `/api/user/profile/${targetUserId}`
        : '/api/user/profile';

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(endpoint, { headers });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch player profile');
      }

      const data = await res.json();
      setProfileUser(data.user);
      setWinnings(data.winnings);
      setTournamentHistory(data.tournamentHistory || []);
      setStats(data.stats);
      setAchievements(data.achievements || []);

      // Populate edit fields
      if (data.user) {
        setEditName(data.user.name || '');
        setEditIgn(data.user.inGameName || '');
        setEditFfUid(data.user.ffUid || '');
        setEditBgmiId(data.user.bgmiId || '');
        setEditBio(data.user.bio || '');
        setEditDiscord(data.user.discord || '');
        setEditRole(data.user.preferredRole || 'Rusher');
        setEditGame(data.user.preferredGame || 'BOTH');
        setEditMobile(data.user.mobile || '');
      }
    } catch (err: any) {
      console.error('Profile fetch error:', err);
      setFetchError(err.message || 'Error loading profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyFf = () => {
    if (profileUser?.ffUid) {
      navigator.clipboard.writeText(profileUser.ffUid);
      setCopiedFf(true);
      setTimeout(() => setCopiedFf(false), 2000);
    }
  };

  const handleCopyBgmi = () => {
    if (profileUser?.bgmiId) {
      navigator.clipboard.writeText(profileUser.bgmiId);
      setCopiedBgmi(true);
      setTimeout(() => setCopiedBgmi(false), 2000);
    }
  };

  const handleShareProfile = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editIgn.trim()) {
      setSaveSuccessMsg('In-Game Name (IGN) cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await updateProfile({
        name: editName,
        inGameName: editIgn.trim(),
        ffUid: editFfUid.trim(),
        bgmiId: editBgmiId.trim(),
        bio: editBio,
        discord: editDiscord,
        preferredRole: editRole,
        preferredGame: editGame,
        mobile: editMobile,
      });

      if (res.success) {
        setSaveSuccessMsg('Gaming profile and character IDs updated successfully!');
        await fetchProfileData();
        await refreshUser();
        setTimeout(() => setSaveSuccessMsg(null), 3500);
        setActiveTab('overview');
      } else {
        setSaveSuccessMsg(res.error || 'Failed to update profile.');
      }
    } catch (err: any) {
      setSaveSuccessMsg(err.message || 'Error saving changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Filtered lists
  const filteredTournaments = tournamentHistory.filter((item) => {
    if (tournamentFilter === 'COMPLETED') return item.status === 'COMPLETED';
    if (tournamentFilter === 'UPCOMING') return item.status === 'UPCOMING' || item.status === 'LIVE';
    if (tournamentFilter === 'WON') return item.prizeWon > 0 || item.isWinner;
    return true;
  });

  const filteredAchievements = achievements.filter((ach) => {
    if (achievementFilter === 'UNLOCKED') return ach.unlocked;
    if (achievementFilter === 'LOCKED') return !ach.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXp = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + (a.xpReward || 0), 0);

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'CONQUEROR':
        return { label: 'CONQUEROR', color: 'from-amber-400 via-rose-500 to-red-600', text: 'text-amber-300' };
      case 'MASTER':
        return { label: 'MASTER', color: 'from-purple-500 to-indigo-600', text: 'text-purple-300' };
      case 'DIAMOND':
        return { label: 'DIAMOND', color: 'from-cyan-400 to-blue-600', text: 'text-cyan-300' };
      case 'PLATINUM':
        return { label: 'PLATINUM', color: 'from-emerald-400 to-teal-600', text: 'text-emerald-300' };
      case 'GOLD':
        return { label: 'GOLD', color: 'from-yellow-400 to-amber-600', text: 'text-yellow-300' };
      case 'SILVER':
        return { label: 'SILVER', color: 'from-zinc-300 to-zinc-500', text: 'text-zinc-300' };
      default:
        return { label: 'BRONZE', color: 'from-amber-700 to-amber-900', text: 'text-amber-400' };
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Crosshair':
        return <Crosshair className="w-5 h-5 text-red-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'Coins':
        return <Coins className="w-5 h-5 text-emerald-400" />;
      case 'Medal':
        return <Medal className="w-5 h-5 text-yellow-400" />;
      case 'Shield':
        return <Shield className="w-5 h-5 text-blue-400" />;
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Flame className="w-5 h-5 text-amber-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-bold text-zinc-400">Loading Dev eSports Gamer Profile...</p>
      </div>
    );
  }

  if (fetchError || !profileUser) {
    return (
      <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4 max-w-lg mx-auto my-12">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="font-display font-black text-2xl text-white">Player Profile Not Found</h2>
        <p className="text-xs text-zinc-400">{fetchError || 'Unable to load profile data. Please try again.'}</p>
        <button
          onClick={fetchProfileData}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 mx-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  const tierInfo = getTierBadge(stats?.tier);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================================
          HERO BANNER: DEV ESPORTS PRO GAMER PASSPORT / ID CARD
         ========================================================================= */}
      <div className="relative rounded-3xl bg-zinc-950 border border-zinc-800/90 overflow-hidden shadow-2xl">
        {/* Ambient background glow & scanline */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Gamer Avatar & Bio */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar with Frame */}
            <div className="relative shrink-0">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${tierInfo.color} p-1 shadow-[0_0_25px_rgba(16,185,129,0.35)]`}>
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center font-display font-black text-3xl sm:text-4xl text-white">
                  {profileUser.inGameName ? profileUser.inGameName.charAt(0).toUpperCase() : profileUser.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-black border border-emerald-500 text-[10px] font-black text-emerald-400 rounded-md font-mono-num uppercase tracking-wider shadow">
                PRO ID
              </span>
            </div>

            {/* Gamer Meta */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-wide">
                  {profileUser.inGameName || profileUser.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r ${tierInfo.color} text-black uppercase tracking-wider`}>
                  {tierInfo.label}
                </span>
                {profileUser.role === 'admin' && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/40 rounded text-[10px] font-bold uppercase">
                    CHIEF ADMIN
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 font-mono-num">
                <span className="text-zinc-200 font-bold">{profileUser.name}</span>
                <span>•</span>
                <span>{profileUser.email}</span>
                {profileUser.mobile && (
                  <>
                    <span>•</span>
                    <span>{profileUser.mobile}</span>
                  </>
                )}
              </div>

              {profileUser.bio && (
                <p className="text-xs text-zinc-300 italic max-w-xl line-clamp-2">
                  &ldquo;{profileUser.bio}&rdquo;
                </p>
              )}

              {/* Combat tags */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold">
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg flex items-center gap-1">
                  <Gamepad2 className="w-3 h-3 text-emerald-400" />
                  <span>{profileUser.preferredGame || 'FREE FIRE & BGMI'}</span>
                </span>
                <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-lg flex items-center gap-1">
                  <Crosshair className="w-3 h-3" />
                  <span>Role: {profileUser.preferredRole || 'Rusher'}</span>
                </span>
                {profileUser.discord && (
                  <span className="px-2 py-0.5 bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 rounded-lg">
                    Discord: {profileUser.discord}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Gaming Passport Actions */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => setActiveTab('edit')}
                  className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>EDIT GAMING PROFILE & UIDs</span>
                </button>
                <button
                  onClick={onOpenWallet}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WALLET & WITHDRAWALS</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleShareProfile}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{copiedShare ? 'LINK COPIED!' : 'SHARE PROFILE'}</span>
              </button>
            )}

            <button
              onClick={handleShareProfile}
              className="px-3 py-1.5 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-white text-[11px] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3 h-3" />
              <span>{copiedShare ? 'Copied to Clipboard!' : 'Copy Profile Link'}</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
            REGISTERED GAMING IDS STRIP (Free Fire UID & BGMI ID with one-click copy)
           ===================================================================== */}
        <div className="border-t border-zinc-800/80 bg-zinc-900/50 p-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-num">
          {/* Free Fire UID */}
          <div className="p-3 bg-zinc-950/70 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-sans">
                  FREE FIRE UID
                </span>
              </div>
              <span className="text-sm font-black text-white block mt-0.5">
                {profileUser.ffUid || 'Not Linked'}
              </span>
            </div>
            {profileUser.ffUid ? (
              <button
                onClick={handleCopyFf}
                title="Copy Free Fire UID"
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
              >
                {copiedFf ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            ) : (
              isOwnProfile && (
                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-[10px] font-bold text-amber-400 hover:underline font-sans"
                >
                  + Link UID
                </button>
              )
            )}
          </div>

          {/* BGMI Character ID */}
          <div className="p-3 bg-zinc-950/70 border border-cyan-500/30 rounded-xl flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider font-sans">
                  BGMI CHARACTER ID
                </span>
              </div>
              <span className="text-sm font-black text-white block mt-0.5">
                {profileUser.bgmiId || 'Not Linked'}
              </span>
            </div>
            {profileUser.bgmiId ? (
              <button
                onClick={handleCopyBgmi}
                title="Copy BGMI Character ID"
                className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors"
              >
                {copiedBgmi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            ) : (
              isOwnProfile && (
                <button
                  onClick={() => setActiveTab('edit')}
                  className="text-[10px] font-bold text-cyan-400 hover:underline font-sans"
                >
                  + Link ID
                </button>
              )
            )}
          </div>

          {/* Total Winnings Strip Summary */}
          <div className="p-3 bg-zinc-950/70 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-sans block">
                TOTAL WON CASH
              </span>
              <span className="text-base font-black text-emerald-400 block mt-0.5">
                ₹{winnings?.totalPrizeMoneyWon.toLocaleString('en-IN') || 0}
              </span>
            </div>
            <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
          </div>

          {/* Achievements Summary */}
          <div className="p-3 bg-zinc-950/70 border border-purple-500/30 rounded-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider font-sans block">
                ACHIEVEMENTS EARNED
              </span>
              <span className="text-base font-black text-white block mt-0.5">
                {unlockedCount} / {achievements.length} <span className="text-xs text-purple-400">({totalXp} XP)</span>
              </span>
            </div>
            <Award className="w-5 h-5 text-purple-400 shrink-0" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          KEY FINANCIAL METRICS & TOTAL WINNINGS CARD
         ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Prize Won */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden group hover:border-emerald-500/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL PRIZE MONEY
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono-num text-emerald-400">
            ₹{winnings?.totalPrizeMoneyWon.toLocaleString('en-IN') || 0}
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono-num">
            {stats?.wins || 0} Match Victories · {stats?.podiums || 0} Podiums
          </p>
        </div>

        {/* Metric 2: Available Winning Balance */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden group hover:border-amber-500/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              WITHDRAWABLE BALANCE
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono-num text-amber-300">
            ₹{winnings?.availableWinningBalance.toLocaleString('en-IN') || 0}
          </div>
          {isOwnProfile && (
            <button
              onClick={onOpenWallet}
              className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 mt-1 transition-colors"
            >
              <span>Instant UPI Withdrawal</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Metric 3: Total Kills & KD */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL KILLS
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono-num text-white">
            {stats?.totalKills || 0}
          </div>
          <p className="text-[11px] text-cyan-400 mt-1 font-mono-num">
            Avg {stats?.avgKillsPerMatch || 0} Kills / Match
          </p>
        </div>

        {/* Metric 4: Win Rate & Matches */}
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 relative overflow-hidden group hover:border-purple-500/50 transition-colors shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              WIN RATE %
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black font-mono-num text-purple-300">
            {stats?.winRate || 0}%
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 font-mono-num">
            {stats?.tournamentsJoined || 0} Tourneys Joined · {stats?.podiumRate || 0}% Podium Rate
          </p>
        </div>
      </div>

      {/* =========================================================================
          PROFILE NAVIGATION TABS (Overview, Tournament History, Achievements, Edit)
         ========================================================================= */}
      <div className="border-b border-zinc-800 flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/50 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Overview & Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('tournaments')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'tournaments'
              ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/50 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Tournament History ({tournamentHistory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('achievements')}
          className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
            activeTab === 'achievements'
              ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/50 shadow'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
          }`}
        >
          <Medal className="w-3.5 h-3.5" />
          <span>Achievements ({unlockedCount}/{achievements.length})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-4 py-2.5 rounded-xl transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'edit'
                ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/50 shadow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile & UIDs</span>
          </button>
        )}
      </div>

      {/* =========================================================================
          TAB 1: OVERVIEW & PERFORMANCE
         ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Col (7 cols): Performance Summary & Match Highlights */}
            <div className="lg:col-span-7 space-y-6">
              {/* Financial Ledger Breakdown */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-lg text-white tracking-wide flex items-center gap-2">
                    <Coins className="w-4 h-4 text-emerald-400" />
                    <span>EARNINGS & ROI BREAKDOWN</span>
                  </h3>
                  <span className="text-[10px] font-mono-num text-zinc-400 uppercase">
                    INR (₹) LEDGER
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono-num">
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-sans">Gross Cash Won</span>
                    <span className="text-lg font-black text-emerald-400 block mt-0.5">
                      ₹{winnings?.totalPrizeMoneyWon.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-sans">Total Withdrawn</span>
                    <span className="text-lg font-black text-zinc-200 block mt-0.5">
                      ₹{winnings?.totalWithdrawn.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-sans">Entry Fees Paid</span>
                    <span className="text-lg font-black text-amber-400 block mt-0.5">
                      ₹{winnings?.totalEntryFeesSpent.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-sans">Net Tournament Profit</span>
                    <span className={`text-lg font-black block mt-0.5 ${
                      (winnings?.netProfit || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {(winnings?.netProfit || 0) >= 0 ? '+' : ''}₹{winnings?.netProfit.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80">
                    <span className="text-[10px] text-zinc-400 block font-sans">Wallet Cash Balance</span>
                    <span className="text-lg font-black text-cyan-400 block mt-0.5">
                      ₹{winnings?.currentWalletBalance.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                  <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800/80 flex flex-col justify-center">
                    {isOwnProfile && (
                      <button
                        onClick={onOpenWallet}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-black text-xs font-black rounded-lg text-center"
                      >
                        Add/Withdraw Money
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Tournaments Preview */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-lg text-white tracking-wide flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>RECENT TOURNAMENT PARTICIPATION</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('tournaments')}
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All ({tournamentHistory.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {tournamentHistory.length === 0 ? (
                  <div className="py-8 text-center space-y-3">
                    <p className="text-xs text-zinc-400">No tournaments joined yet.</p>
                    {isOwnProfile && (
                      <button
                        onClick={onExploreMatches}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-md"
                      >
                        EXPLORE TOURNAMENTS & JOIN MATCH
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {tournamentHistory.slice(0, 3).map((item) => (
                      <div
                        key={item.tournamentId}
                        className="p-3.5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">
                              {item.game} • {item.matchType}
                            </span>
                            {item.isWinner && (
                              <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded text-[9px] font-black uppercase">
                                👑 RANK #1 VICTORY
                              </span>
                            )}
                            {item.isPodium && !item.isWinner && (
                              <span className="px-1.5 py-0.2 bg-zinc-400/20 text-zinc-200 border border-zinc-400/40 rounded text-[9px] font-bold uppercase">
                                PODIUM RANK #{item.rank}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-[11px] text-zinc-400 font-mono-num block">
                            Slot #{item.slotNumber} • {item.map} • {item.matchTime}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          {item.prizeWon > 0 ? (
                            <span className="text-sm font-black font-mono-num text-emerald-400 block">
                              +₹{item.prizeWon.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-xs text-zinc-500 font-mono-num block">
                              {item.status}
                            </span>
                          )}
                          <span className="text-[10px] text-zinc-400 font-mono-num">
                            {item.kills} Kills
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Col (5 cols): Achievements Highlight & Pro Gamer Passport */}
            <div className="lg:col-span-5 space-y-6">
              {/* Achievements Highlight */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-black text-lg text-white tracking-wide flex items-center gap-2">
                    <Medal className="w-4 h-4 text-purple-400" />
                    <span>ACHIEVEMENT BADGES</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('achievements')}
                    className="text-xs font-bold text-purple-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All ({unlockedCount}/{achievements.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs font-mono-num mb-1.5 text-zinc-400">
                    <span>Career Badges Unlocked</span>
                    <span className="text-purple-400 font-bold">{unlockedCount} / {achievements.length}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                      style={{ width: `${(unlockedCount / (achievements.length || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {achievements.slice(0, 4).map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between transition-colors ${
                        ach.unlocked
                          ? 'bg-zinc-900/80 border-purple-500/40'
                          : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center">
                          {getAchievementIcon(ach.icon)}
                        </div>
                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                          ach.tier === 'DIAMOND'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : ach.tier === 'GOLD'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {ach.tier}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white truncate leading-tight">
                          {ach.title}
                        </h5>
                        <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                          {ach.description}
                        </p>
                      </div>
                      <div className="mt-2 pt-1 border-t border-zinc-800/60 flex items-center justify-between text-[10px] font-mono-num">
                        <span className={ach.unlocked ? 'text-emerald-400 font-bold' : 'text-zinc-500'}>
                          {ach.unlocked ? 'UNLOCKED' : `${ach.progress}/${ach.maxProgress}`}
                        </span>
                        <span className="text-purple-400">+{ach.xpReward} XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dev eSports Gamer Card / ID Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-emerald-500/40 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span className="font-display font-black text-sm text-white tracking-widest uppercase">
                      OFFICIAL GAMER ID CARD
                    </span>
                  </div>
                  <span className="text-[9px] font-mono-num px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
                    VERIFIED
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono-num">
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-500">Player Tag:</span>
                    <span className="text-white font-bold">{profileUser.inGameName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-500">Free Fire UID:</span>
                    <span className="text-amber-400 font-bold">{profileUser.ffUid || 'Not Linked'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-500">BGMI Char ID:</span>
                    <span className="text-cyan-400 font-bold">{profileUser.bgmiId || 'Not Linked'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-zinc-800">
                    <span className="text-zinc-500">Account ID:</span>
                    <span className="text-zinc-300 font-mono-num">{profileUser.id}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-zinc-500">Member Since:</span>
                    <span className="text-zinc-400">{profileUser.createdAt || 'Nov 2026'}</span>
                  </div>
                </div>

                {isOwnProfile && (
                  <button
                    onClick={() => setActiveTab('edit')}
                    className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border border-zinc-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Update Character Identifiers</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: TOURNAMENT HISTORY (Dedicated view of all joined tournaments, winnings, ranks)
         ========================================================================= */}
      {activeTab === 'tournaments' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
            <div>
              <h3 className="font-display font-black text-xl text-white tracking-wide">
                COMPETITIVE TOURNAMENT HISTORY
              </h3>
              <p className="text-xs text-zinc-400">
                Log of registered custom rooms, placements, kills scored, and prize money payouts.
              </p>
            </div>

            <div className="flex flex-wrap items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-bold">
              <button
                onClick={() => setTournamentFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  tournamentFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({tournamentHistory.length})
              </button>
              <button
                onClick={() => setTournamentFilter('COMPLETED')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  tournamentFilter === 'COMPLETED' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Completed Matches
              </button>
              <button
                onClick={() => setTournamentFilter('UPCOMING')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  tournamentFilter === 'UPCOMING' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Upcoming / Active
              </button>
              <button
                onClick={() => setTournamentFilter('WON')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  tournamentFilter === 'WON' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Prizes Won 🏆
              </button>
            </div>
          </div>

          {/* Tournament List */}
          {filteredTournaments.length === 0 ? (
            <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-3xl space-y-4">
              <Trophy className="w-12 h-12 text-zinc-600 mx-auto" />
              <h4 className="font-display font-black text-xl text-white">No Tournaments Match Filter</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                No tournament records found for the selected filter. Join open Free Fire or BGMI tournaments to start building your record!
              </p>
              {isOwnProfile && (
                <button
                  onClick={onExploreMatches}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg"
                >
                  BROWSE TOURNAMENTS
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTournaments.map((t) => (
                <div
                  key={t.tournamentId}
                  className="p-5 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-zinc-700 transition-all shadow-xl"
                >
                  {/* Left: Tournament & Status */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        t.game === 'FREE FIRE MAX'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        {t.game}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase">
                        {t.matchType} • {t.map}
                      </span>
                      <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono-num rounded">
                        Slot #{t.slotNumber}
                      </span>
                      {t.teamName && (
                        <span className="text-[10px] text-zinc-400 font-mono-num">
                          Team: <strong className="text-white">{t.teamName}</strong>
                        </span>
                      )}
                    </div>

                    <h4 className="font-display font-black text-lg text-white">
                      {t.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono-num">
                      <span className="flex items-center gap-1 text-emerald-400">
                        <Clock className="w-3.5 h-3.5" />
                        {t.matchDate} • {t.matchTime}
                      </span>
                      <span>•</span>
                      <span>Entry Fee: ₹{t.entryFee}</span>
                      <span>•</span>
                      <span className="text-amber-400 font-bold">Pool: ₹{t.prizePool}</span>
                    </div>
                  </div>

                  {/* Right: Placement & Winnings */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-900 shrink-0">
                    {t.rank !== null ? (
                      <div className="text-left md:text-right">
                        <div className="flex items-center gap-1.5 md:justify-end">
                          {t.rank === 1 ? (
                            <span className="px-2.5 py-0.5 bg-amber-500 text-black text-xs font-black rounded-md uppercase tracking-wider">
                              👑 RANK #1 CHAMPION
                            </span>
                          ) : t.rank <= 3 ? (
                            <span className="px-2.5 py-0.5 bg-zinc-300 text-black text-xs font-black rounded-md uppercase tracking-wider">
                              PODIUM RANK #{t.rank}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold rounded">
                              Rank #{t.rank}
                            </span>
                          )}
                        </div>

                        <div className="text-xs font-mono-num text-zinc-300 mt-1">
                          <span>{t.kills} Kills</span>
                          <span className="mx-1">•</span>
                          <span className="text-cyan-400">{t.totalPoints} Points</span>
                        </div>

                        {t.prizeWon > 0 && (
                          <div className="text-base font-black font-mono-num text-emerald-400 mt-0.5">
                            WON: ₹{t.prizeWon.toLocaleString('en-IN')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-left md:text-right">
                        <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold rounded-lg uppercase">
                          {t.status}
                        </span>
                        <p className="text-[11px] text-zinc-500 mt-1 font-mono-num">
                          Match Pending
                        </p>
                      </div>
                    )}

                    {/* Room credentials button if available */}
                    {isOwnProfile && t.status !== 'COMPLETED' && (
                      t.canAccessRoom ? (
                        <button
                          onClick={() => onViewRoomDetails(t as any)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:brightness-110 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow flex items-center gap-1 animate-pulse"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>ROOM ID & PASS 🔑</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-zinc-500 font-mono-num">
                          Room ID unlocks 15m before start
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: ACHIEVEMENTS & MEDALS
         ========================================================================= */}
      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-950 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
                DEV ESPORTS BADGES OF HONOR
              </span>
              <h3 className="font-display font-black text-2xl text-white tracking-wide mt-0.5">
                Player Achievements & Accolades
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Unlock competitive badges by eliminating opponents, claiming tournament victories, and winning cash.
              </p>
            </div>

            <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1 text-xs font-bold shrink-0">
              <button
                onClick={() => setAchievementFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  achievementFilter === 'ALL' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                All ({achievements.length})
              </button>
              <button
                onClick={() => setAchievementFilter('UNLOCKED')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  achievementFilter === 'UNLOCKED' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Unlocked ({unlockedCount})
              </button>
              <button
                onClick={() => setAchievementFilter('LOCKED')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  achievementFilter === 'LOCKED' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Locked ({achievements.length - unlockedCount})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAchievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  ach.unlocked
                    ? 'bg-zinc-950 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] hover:border-purple-400'
                    : 'bg-zinc-950/60 border-zinc-800/80 opacity-70 hover:opacity-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      ach.unlocked
                        ? 'bg-zinc-900 border border-purple-500/40 text-purple-400 shadow-md'
                        : 'bg-zinc-900/60 text-zinc-600'
                    }`}>
                      {getAchievementIcon(ach.icon)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        ach.tier === 'DIAMOND'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : ach.tier === 'GOLD'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : ach.tier === 'SILVER'
                          ? 'bg-zinc-400/20 text-zinc-200 border border-zinc-400/40'
                          : 'bg-amber-800/20 text-amber-400 border border-amber-800/40'
                      }`}>
                        {ach.tier}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-display font-black text-lg text-white">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-zinc-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono-num">
                    <span className="text-zinc-500 text-[11px]">Progress:</span>
                    <span className={ach.unlocked ? 'text-emerald-400 font-bold' : 'text-zinc-300'}>
                      {ach.unlocked ? 'COMPLETED' : `${ach.progress} / ${ach.maxProgress}`}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        ach.unlocked ? 'bg-emerald-500' : 'bg-purple-600'
                      }`}
                      style={{ width: `${Math.min(100, (ach.progress / (ach.maxProgress || 1)) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] font-bold">
                    <span className="text-purple-400">+{ach.xpReward} XP Reward</span>
                    {ach.unlocked ? (
                      <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                        <Check className="w-3.5 h-3.5" />
                        <span>UNLOCKED</span>
                      </span>
                    ) : (
                      <span className="text-zinc-500 flex items-center gap-1 text-[10px]">
                        <Lock className="w-3 h-3" />
                        <span>LOCKED</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: EDIT PROFILE & GAMING IDENTIFIERS
         ========================================================================= */}
      {activeTab === 'edit' && isOwnProfile && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 border border-zinc-800 max-w-3xl mx-auto shadow-2xl space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              PLAYER IDENTITY CONFIGURATION
            </span>
            <h3 className="font-display font-black text-2xl text-white tracking-wide mt-0.5">
              Edit In-Game IDs & Profile
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Keep your gaming identifiers accurate. Tournament admins verify your character UID before starting custom rooms and distributing prize money.
            </p>
          </div>

          {saveSuccessMsg && (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
              saveSuccessMsg.includes('success')
                ? 'bg-emerald-950/50 border border-emerald-500/50 text-emerald-300'
                : 'bg-red-950/50 border border-red-500/50 text-red-300'
            }`}>
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Real Name & IGN */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Full Real Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono-num focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-bold mb-1">
                  In-Game Player Name / Gaming Tag (IGN) *
                </label>
                <input
                  type="text"
                  required
                  value={editIgn}
                  onChange={(e) => setEditIgn(e.target.value)}
                  placeholder="e.g. DEV_Sniper99"
                  className="w-full px-3 py-2 bg-zinc-900 border border-emerald-500/50 rounded-xl text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Gaming IDs: FF UID & BGMI ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-amber-400 font-bold">
                    Free Fire MAX UID
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono-num">8-10 digits</span>
                </div>
                <input
                  type="text"
                  value={editFfUid}
                  onChange={(e) => setEditFfUid(e.target.value)}
                  placeholder="e.g. 789234510"
                  className="w-full px-3 py-2 bg-zinc-900 border border-amber-500/40 rounded-xl text-white font-mono-num focus:border-amber-400 focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Found on your in-game Free Fire profile header card.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-cyan-400 font-bold">
                    BGMI Character ID
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono-num">10 digits</span>
                </div>
                <input
                  type="text"
                  value={editBgmiId}
                  onChange={(e) => setEditBgmiId(e.target.value)}
                  placeholder="e.g. 5192837465"
                  className="w-full px-3 py-2 bg-zinc-900 border border-cyan-500/40 rounded-xl text-white font-mono-num focus:border-cyan-400 focus:outline-none"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Found in your BGMI player profile near your character avatar.
                </p>
              </div>
            </div>

            {/* Mobile & Discord */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Contact Mobile Number (for UPI Payouts)
                </label>
                <input
                  type="tel"
                  value={editMobile}
                  onChange={(e) => setEditMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono-num focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Discord Tag (Optional)
                </label>
                <input
                  type="text"
                  value={editDiscord}
                  onChange={(e) => setEditDiscord(e.target.value)}
                  placeholder="e.g. Player#1234"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Primary Platform & Combat Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Primary Tournament Platform
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={() => setEditGame('FREE FIRE MAX')}
                    className={`py-1.5 rounded-lg transition-colors ${
                      editGame === 'FREE FIRE MAX' ? 'bg-amber-500 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Free Fire
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGame('BGMI')}
                    className={`py-1.5 rounded-lg transition-colors ${
                      editGame === 'BGMI' ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    BGMI
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditGame('BOTH')}
                    className={`py-1.5 rounded-lg transition-colors ${
                      editGame === 'BOTH' ? 'bg-emerald-500 text-black' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-bold mb-1">
                  Preferred Combat Role
                </label>
                <div className="grid grid-cols-5 gap-1 text-[10px] font-bold">
                  {(['Rusher', 'Sniper', 'IGL', 'Assault', 'Support'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setEditRole(role)}
                      className={`py-1.5 rounded-lg border transition-colors ${
                        editRole === role
                          ? 'bg-zinc-800 text-emerald-400 border-emerald-500/50'
                          : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio / Player Motto */}
            <div>
              <label className="block text-zinc-300 font-bold mb-1">
                Gamer Bio & Competitive Motto
              </label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Share your tournament experience, favorite drop locations, or clan tag..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'SAVING...' : 'SAVE GAMING PROFILE'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className="px-4 py-2 bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
