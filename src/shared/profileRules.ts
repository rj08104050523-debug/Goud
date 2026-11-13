import { UserAccount, Tournament, Registration } from './tournamentRules.js';

export interface MatchResultRecord {
  id: string;
  tournamentId: string;
  rank: number;
  playerOrTeamName: string;
  playerUid: string;
  kills: number;
  placementPoints: number;
  totalPoints: number;
  prizeWon: number;
}

export interface TransactionRecord {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'ENTRY_FEE' | 'PRIZE_WON' | 'WITHDRAWAL';
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'REJECTED';
  description: string;
  refNumber: string;
  createdAt: string;
}

export interface TournamentHistoryItem {
  tournamentId: string;
  title: string;
  game: 'FREE FIRE MAX' | 'BGMI';
  map: string;
  matchType: 'SOLO' | 'DUO' | 'SQUAD';
  entryFee: number;
  prizePool: number;
  matchDate: string;
  matchTime: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  slotNumber: number;
  teamName?: string;
  rank: number | null;
  kills: number;
  placementPoints: number;
  totalPoints: number;
  prizeWon: number;
  isWinner: boolean;
  isPodium: boolean;
  canAccessRoom: boolean;
}

export interface UserStats {
  matchesPlayed: number;
  tournamentsJoined: number;
  wins: number;
  podiums: number;
  totalKills: number;
  avgKillsPerMatch: number;
  winRate: number;
  podiumRate: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER' | 'CONQUEROR';
}

export interface WinningsBreakdown {
  totalPrizeMoneyWon: number;
  availableWinningBalance: number;
  currentWalletBalance: number;
  totalWithdrawn: number;
  totalEntryFeesSpent: number;
  netProfit: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'COMBAT' | 'VICTORY' | 'FINANCIAL' | 'CAREER' | 'PROFILE';
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

/**
 * Calculates total winnings and financial breakdown for a player
 */
export function calculateWinningsBreakdown(
  user: UserAccount | null,
  transactions: TransactionRecord[],
  matchResults: MatchResultRecord[]
): WinningsBreakdown {
  if (!user) {
    return {
      totalPrizeMoneyWon: 0,
      availableWinningBalance: 0,
      currentWalletBalance: 0,
      totalWithdrawn: 0,
      totalEntryFeesSpent: 0,
      netProfit: 0,
    };
  }

  // Winnings from match results
  const resultsPrizeWon = matchResults
    .filter(
      (r) =>
        r.playerUid === user.ffUid ||
        r.playerUid === user.bgmiId ||
        r.playerOrTeamName.toLowerCase().includes(user.inGameName.toLowerCase())
    )
    .reduce((sum, r) => sum + (r.prizeWon || 0), 0);

  // Winnings from transaction ledger
  const txPrizeWon = transactions
    .filter((t) => t.userId === user.id && t.type === 'PRIZE_WON' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  // Max of results prize or transaction prize (ensuring consistency)
  const totalPrizeMoneyWon = Math.max(resultsPrizeWon, txPrizeWon);

  const totalWithdrawn = transactions
    .filter((t) => t.userId === user.id && t.type === 'WITHDRAWAL' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEntryFeesSpent = transactions
    .filter((t) => t.userId === user.id && t.type === 'ENTRY_FEE' && t.status === 'SUCCESS')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalPrizeMoneyWon - totalEntryFeesSpent;

  return {
    totalPrizeMoneyWon,
    availableWinningBalance: user.winningBalance || 0,
    currentWalletBalance: user.walletBalance || 0,
    totalWithdrawn,
    totalEntryFeesSpent,
    netProfit,
  };
}

/**
 * Computes consolidated tournament history for a player
 */
export function calculateTournamentHistory(
  user: UserAccount | null,
  userRegistrations: Registration[],
  tournaments: Tournament[],
  matchResults: MatchResultRecord[]
): TournamentHistoryItem[] {
  if (!user) return [];

  const history: TournamentHistoryItem[] = [];

  for (const reg of userRegistrations) {
    if (reg.userId !== user.id) continue;

    const tourney = tournaments.find((t) => t.id === reg.tournamentId);
    if (!tourney) continue;

    // Find if there is a match result for this user in this tournament
    const result = matchResults.find(
      (r) =>
        r.tournamentId === tourney.id &&
        (r.playerUid === user.ffUid ||
          r.playerUid === user.bgmiId ||
          r.playerUid === reg.playerUid ||
          r.playerOrTeamName.toLowerCase().includes(user.inGameName.toLowerCase()))
    );

    const rank = result ? result.rank : null;
    const kills = result ? result.kills : 0;
    const placementPoints = result ? result.placementPoints : 0;
    const totalPoints = result ? result.totalPoints : 0;
    const prizeWon = result ? result.prizeWon : 0;
    const isWinner = rank === 1;
    const isPodium = rank !== null && rank >= 1 && rank <= 3;

    history.push({
      tournamentId: tourney.id,
      title: tourney.title,
      game: tourney.game,
      map: tourney.map,
      matchType: tourney.matchType,
      entryFee: tourney.entryFee,
      prizePool: tourney.prizePool,
      matchDate: tourney.matchDate,
      matchTime: tourney.matchTime,
      status: tourney.status,
      slotNumber: reg.slotNumber,
      teamName: reg.teamName,
      rank,
      kills,
      placementPoints,
      totalPoints,
      prizeWon,
      isWinner,
      isPodium,
      canAccessRoom: tourney.roomReleased,
    });
  }

  // Sort by completed first, or upcoming nearest
  return history.sort((a, b) => {
    if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
    if (b.status === 'LIVE' && a.status !== 'LIVE') return 1;
    if (a.status === 'UPCOMING' && b.status === 'COMPLETED') return -1;
    if (b.status === 'UPCOMING' && a.status === 'COMPLETED') return 1;
    return 0;
  });
}

/**
 * Computes performance stats (matches, kills, win rate, tier)
 */
export function calculateUserStats(history: TournamentHistoryItem[], user?: UserAccount | null): UserStats {
  const tournamentsJoined = history.length;
  const completedMatches = history.filter((h) => h.status === 'COMPLETED' || h.rank !== null);
  const matchesPlayed = completedMatches.length;

  const wins = completedMatches.filter((h) => h.isWinner).length;
  const podiums = completedMatches.filter((h) => h.isPodium).length;
  const totalKills = completedMatches.reduce((sum, h) => sum + h.kills, 0);

  const avgKillsPerMatch = matchesPlayed > 0 ? Number((totalKills / matchesPlayed).toFixed(1)) : 0;
  const winRate = matchesPlayed > 0 ? Math.round((wins / matchesPlayed) * 100) : 0;
  const podiumRate = matchesPlayed > 0 ? Math.round((podiums / matchesPlayed) * 100) : 0;

  // Tier calculation based on wins, kills and matches
  let tier: UserStats['tier'] = 'BRONZE';
  if (wins >= 5 || (wins >= 3 && totalKills >= 30)) {
    tier = 'CONQUEROR';
  } else if (wins >= 3 || (wins >= 2 && totalKills >= 20)) {
    tier = 'MASTER';
  } else if (wins >= 1 && totalKills >= 10) {
    tier = 'DIAMOND';
  } else if (podiums >= 1 || totalKills >= 8) {
    tier = 'PLATINUM';
  } else if (tournamentsJoined >= 2 || totalKills >= 3) {
    tier = 'GOLD';
  } else if (tournamentsJoined >= 1) {
    tier = 'SILVER';
  }

  return {
    matchesPlayed,
    tournamentsJoined,
    wins,
    podiums,
    totalKills,
    avgKillsPerMatch,
    winRate,
    podiumRate,
    tier,
  };
}

/**
 * Computes user achievements dynamically based on profile, history, stats, and winnings
 */
export function calculateAchievements(
  user: UserAccount | null,
  history: TournamentHistoryItem[],
  stats: UserStats,
  winnings: WinningsBreakdown
): Achievement[] {
  if (!user) return [];

  const hasFfUid = Boolean(user.ffUid && user.ffUid.trim() !== '');
  const hasBgmiId = Boolean(user.bgmiId && user.bgmiId.trim() !== '');
  const hasBothUids = hasFfUid && hasBgmiId;

  const totalPrize = winnings.totalPrizeMoneyWon;

  const achievements: Achievement[] = [
    {
      id: 'ACH_FIRST_REG',
      title: 'First Blood Drop',
      description: 'Book your first slot in a Dev eSports competitive tournament.',
      category: 'CAREER',
      tier: 'BRONZE',
      icon: 'Flame',
      unlocked: stats.tournamentsJoined >= 1,
      progress: Math.min(stats.tournamentsJoined, 1),
      maxProgress: 1,
      xpReward: 100,
    },
    {
      id: 'ACH_BOOYAH_WIN',
      title: 'Booyah Champion',
      description: 'Claim Rank #1 Victory in a Free Fire MAX or BGMI match.',
      category: 'VICTORY',
      tier: 'GOLD',
      icon: 'Trophy',
      unlocked: stats.wins >= 1,
      progress: Math.min(stats.wins, 1),
      maxProgress: 1,
      xpReward: 500,
    },
    {
      id: 'ACH_PODIUM_ELITE',
      title: 'Podium Dominator',
      description: 'Finish in the Top 3 podium spots in any tournament.',
      category: 'VICTORY',
      tier: 'SILVER',
      icon: 'Medal',
      unlocked: stats.podiums >= 1,
      progress: Math.min(stats.podiums, 1),
      maxProgress: 1,
      xpReward: 250,
    },
    {
      id: 'ACH_HEADHUNTER',
      title: 'Headhunter',
      description: 'Accumulate 10 or more confirmed tournament kills.',
      category: 'COMBAT',
      tier: 'SILVER',
      icon: 'Crosshair',
      unlocked: stats.totalKills >= 10,
      progress: Math.min(stats.totalKills, 10),
      maxProgress: 10,
      xpReward: 300,
    },
    {
      id: 'ACH_APEX_PREDATOR',
      title: 'Apex Predator',
      description: 'Eliminate 25 or more opponents across competitive matches.',
      category: 'COMBAT',
      tier: 'DIAMOND',
      icon: 'Zap',
      unlocked: stats.totalKills >= 25,
      progress: Math.min(stats.totalKills, 25),
      maxProgress: 25,
      xpReward: 750,
    },
    {
      id: 'ACH_CASH_HUNTER_1K',
      title: 'Prize Hunter (₹1,000+)',
      description: 'Accumulate over ₹1,000 in lifetime tournament earnings.',
      category: 'FINANCIAL',
      tier: 'GOLD',
      icon: 'Coins',
      unlocked: totalPrize >= 1000,
      progress: Math.min(totalPrize, 1000),
      maxProgress: 1000,
      xpReward: 500,
    },
    {
      id: 'ACH_GRAND_HIGH_ROLLER',
      title: 'High Roller (₹2,500+)',
      description: 'Reach ₹2,500+ in verified cash winnings credited to your wallet.',
      category: 'FINANCIAL',
      tier: 'DIAMOND',
      icon: 'Award',
      unlocked: totalPrize >= 2500,
      progress: Math.min(totalPrize, 2500),
      maxProgress: 2500,
      xpReward: 1000,
    },
    {
      id: 'ACH_DUAL_OPERATIVE',
      title: 'Dual Realm Operator',
      description: 'Link both Free Fire UID and BGMI Character ID to your player profile.',
      category: 'PROFILE',
      tier: 'BRONZE',
      icon: 'Shield',
      unlocked: hasBothUids,
      progress: (hasFfUid ? 1 : 0) + (hasBgmiId ? 1 : 0),
      maxProgress: 2,
      xpReward: 150,
    },
    {
      id: 'ACH_VETERAN',
      title: 'Tournament Veteran',
      description: 'Participate in 3 or more tournaments on Dev eSports.',
      category: 'CAREER',
      tier: 'SILVER',
      icon: 'Award',
      unlocked: stats.tournamentsJoined >= 3,
      progress: Math.min(stats.tournamentsJoined, 3),
      maxProgress: 3,
      xpReward: 350,
    },
    {
      id: 'ACH_CERTIFIED_PRO',
      title: 'Certified Pro Gamer',
      description: 'Complete full gamer identity with In-Game Name, verified Mobile, and UID.',
      category: 'PROFILE',
      tier: 'BRONZE',
      icon: 'CheckCircle',
      unlocked: Boolean(user.inGameName && user.mobile && (hasFfUid || hasBgmiId)),
      progress: (user.inGameName ? 1 : 0) + (user.mobile ? 1 : 0) + (hasFfUid || hasBgmiId ? 1 : 0),
      maxProgress: 3,
      xpReward: 100,
    },
  ];

  return achievements;
}
