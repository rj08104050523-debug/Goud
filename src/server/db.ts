import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  UserAccount,
  Tournament,
  Registration,
  validateRegistration,
  validateWithdrawal,
} from '../shared/tournamentRules.js';
import {
  calculateWinningsBreakdown,
  calculateTournamentHistory,
  calculateUserStats,
  calculateAchievements,
} from '../shared/profileRules.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'devesports.json');

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'ENTRY_FEE' | 'PRIZE_WON' | 'WITHDRAWAL';
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'REJECTED';
  description: string;
  refNumber: string;
  utrNumber?: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  upiId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  createdAt: string;
  processedAt?: string;
}

export interface MatchResult {
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

export interface NotificationItem {
  id: string;
  userId: string; // 'ALL' or specific userId
  title: string;
  message: string;
  type: 'INFO' | 'ROOM' | 'PAYMENT' | 'PRIZE';
  read: boolean;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  adminEmail: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface DatabaseState {
  users: UserAccount[];
  passwords: Record<string, string>; // userId -> password (plain for demo/dev)
  tournaments: Tournament[];
  registrations: Registration[];
  transactions: Transaction[];
  withdrawals: WithdrawalRequest[];
  matchResults: MatchResult[];
  notifications: NotificationItem[];
  adminLogs: AdminLog[];
}

function getInitialState(): DatabaseState {
  const adminId = 'usr_admin_1';
  const gamerId = 'usr_gamer_1';

  return {
    users: [
      {
        id: adminId,
        name: 'Dev eSports Admin',
        email: 'admin@devesports.com',
        mobile: '9876543210',
        inGameName: 'DEV_CHIEF_ADMIN',
        ffUid: '100000001',
        bgmiId: '500000001',
        walletBalance: 25000,
        winningBalance: 15000,
        isBlocked: false,
        role: 'admin',
      },
      {
        id: gamerId,
        name: 'Aryan Sharma',
        email: 'gamer@devesports.com',
        mobile: '9812345678',
        inGameName: 'DEV_Sniper99',
        ffUid: '789234510',
        bgmiId: '5192837465',
        walletBalance: 450,
        winningBalance: 320,
        isBlocked: false,
        role: 'user',
        bio: 'Competitive Sniper & Rusher for Dev eSports. Daily scrim grinder and tournament conqueror.',
        discord: 'Sniper99#4421',
        preferredRole: 'Sniper',
        preferredGame: 'BOTH',
        avatarFrame: 'conqueror',
        createdAt: '2026-10-15 12:00',
      },
      {
        id: 'usr_gamer_2',
        name: 'Rohan Verma',
        email: 'rohan@example.com',
        mobile: '9823456789',
        inGameName: 'ShadowKiller_OP',
        ffUid: '891029384',
        bgmiId: '5201928374',
        walletBalance: 210,
        winningBalance: 150,
        isBlocked: false,
        role: 'user',
        bio: 'Free Fire Bermuda specialist with 1400+ hours in custom rooms.',
        preferredRole: 'Rusher',
        preferredGame: 'FREE FIRE MAX',
        avatarFrame: 'flame',
        createdAt: '2026-10-20 15:30',
      },
      {
        id: 'usr_gamer_3',
        name: 'Kabir Patel',
        email: 'kabir@example.com',
        mobile: '9834567890',
        inGameName: 'GodOP_Clutch',
        ffUid: '901928374',
        bgmiId: '5301928374',
        walletBalance: 380,
        winningBalance: 280,
        isBlocked: false,
        role: 'user',
        bio: 'BGMI IGL and Clutch Specialist. Squad leader for Team Clutch.',
        preferredRole: 'IGL',
        preferredGame: 'BGMI',
        avatarFrame: 'ace',
        createdAt: '2026-10-25 18:00',
      },
    ],
    passwords: {
      [adminId]: 'Admin@123',
      [gamerId]: 'Gamer@123',
      usr_gamer_2: 'Player@123',
      usr_gamer_3: 'Player@123',
    },
    tournaments: [
      {
        id: 'tour_ff_1',
        title: 'Free Fire Bermuda Daily Cash Solo',
        game: 'FREE FIRE MAX',
        matchType: 'SOLO',
        map: 'Bermuda',
        entryFee: 30,
        prizePool: 2000,
        maxSlots: 48,
        registeredCount: 38,
        matchDate: 'Today',
        matchTime: '04:00 PM IST',
        status: 'UPCOMING',
        roomId: 'ROOM_FF_7721',
        roomPassword: 'DEV_BERMUDA_77',
        roomReleased: true, // Released so user can test viewing Room ID!
      },
      {
        id: 'tour_bgmi_1',
        title: 'BGMI Erangel Mega Squad War',
        game: 'BGMI',
        matchType: 'SQUAD',
        map: 'Erangel',
        entryFee: 100,
        prizePool: 6500,
        maxSlots: 25,
        registeredCount: 18,
        matchDate: 'Today',
        matchTime: '06:30 PM IST',
        status: 'UPCOMING',
        roomId: 'ROOM_BGMI_8892',
        roomPassword: 'DEV_ERANGEL_99',
        roomReleased: false,
      },
      {
        id: 'tour_ff_2',
        title: 'Free Fire Kalahari Duo Night Clash',
        game: 'FREE FIRE MAX',
        matchType: 'DUO',
        map: 'Kalahari',
        entryFee: 50,
        prizePool: 3500,
        maxSlots: 24,
        registeredCount: 19,
        matchDate: 'Today',
        matchTime: '09:00 PM IST',
        status: 'UPCOMING',
        roomId: 'ROOM_FF_9912',
        roomPassword: 'DEV_KALAHARI_55',
        roomReleased: false,
      },
      {
        id: 'tour_bgmi_2',
        title: 'BGMI Miramar Solo Sniper Cup',
        game: 'BGMI',
        matchType: 'SOLO',
        map: 'Miramar',
        entryFee: 40,
        prizePool: 2800,
        maxSlots: 60,
        registeredCount: 42,
        matchDate: 'Tomorrow',
        matchTime: '05:00 PM IST',
        status: 'UPCOMING',
        roomId: 'ROOM_MIRAMAR_12',
        roomPassword: 'SNIPER_DEV_22',
        roomReleased: false,
      },
      {
        id: 'tour_ff_3',
        title: 'Free Fire Purgatory Squad Carnage',
        game: 'FREE FIRE MAX',
        matchType: 'SQUAD',
        map: 'Purgatory',
        entryFee: 80,
        prizePool: 5000,
        maxSlots: 12,
        registeredCount: 12,
        matchDate: 'Yesterday',
        matchTime: '08:00 PM IST',
        status: 'COMPLETED',
        roomId: 'ROOM_PURG_44',
        roomPassword: 'DONE',
        roomReleased: true,
      },
      {
        id: 'tour_bgmi_3',
        title: 'BGMI Sanhok Bootcamp Rush (Live)',
        game: 'BGMI',
        matchType: 'SQUAD',
        map: 'Sanhok',
        entryFee: 60,
        prizePool: 4000,
        maxSlots: 16,
        registeredCount: 16,
        matchDate: 'Now',
        matchTime: 'LIVE NOW',
        status: 'LIVE',
        roomId: 'ROOM_SANHOK_LIVE',
        roomPassword: 'LIVE_BOOTCAMP',
        roomReleased: true,
      },
    ],
    registrations: [
      {
        id: 'reg_1',
        tournamentId: 'tour_ff_1',
        userId: gamerId,
        playerInGameName: 'DEV_Sniper99',
        playerUid: '789234510',
        slotNumber: 7,
      },
      {
        id: 'reg_2',
        tournamentId: 'tour_bgmi_1',
        userId: gamerId,
        playerInGameName: 'DEV_Sniper99',
        playerUid: '5192837465',
        teamName: 'Team Dev Assassins',
        slotNumber: 3,
      },
      {
        id: 'reg_3',
        tournamentId: 'tour_ff_1',
        userId: 'usr_gamer_2',
        playerInGameName: 'ShadowKiller_OP',
        playerUid: '891029384',
        slotNumber: 12,
      },
    ],
    transactions: [
      {
        id: 'tx_101',
        userId: gamerId,
        type: 'DEPOSIT',
        amount: 500,
        status: 'SUCCESS',
        description: 'UPI Wallet Topup (GooglePay)',
        refNumber: 'UPI_TOPUP_8849201',
        utrNumber: '319284756201',
        createdAt: '2026-11-10 14:22',
      },
      {
        id: 'tx_102',
        userId: gamerId,
        type: 'ENTRY_FEE',
        amount: 30,
        status: 'SUCCESS',
        description: 'Slot Booking: Free Fire Bermuda Daily Cash Solo',
        refNumber: 'TX_SLOT_FF_1',
        createdAt: '2026-11-11 10:15',
      },
      {
        id: 'tx_103',
        userId: gamerId,
        type: 'ENTRY_FEE',
        amount: 100,
        status: 'SUCCESS',
        description: 'Slot Booking: BGMI Erangel Mega Squad War',
        refNumber: 'TX_SLOT_BGMI_1',
        createdAt: '2026-11-11 11:30',
      },
      {
        id: 'tx_104',
        userId: gamerId,
        type: 'PRIZE_WON',
        amount: 1200,
        status: 'SUCCESS',
        description: '1st Place Winner - Free Fire Solo Bermuda Season 1',
        refNumber: 'PRIZE_CR_9921',
        createdAt: '2026-11-09 20:45',
      },
      {
        id: 'tx_105',
        userId: gamerId,
        type: 'WITHDRAWAL',
        amount: 880,
        status: 'SUCCESS',
        description: 'Winning Payout via UPI (gamer@okaxis)',
        refNumber: 'WTH_99182',
        utrNumber: '319200481726',
        createdAt: '2026-11-10 16:30',
      },
    ],
    withdrawals: [
      {
        id: 'wth_demo_1',
        userId: 'usr_gamer_2',
        userName: 'Rohan Verma',
        userEmail: 'rohan@example.com',
        amount: 150,
        upiId: 'rohan@paytm',
        status: 'PENDING',
        createdAt: '2026-11-12 02:15',
      },
    ],
    matchResults: [
      {
        id: 'res_1',
        tournamentId: 'tour_ff_3',
        rank: 1,
        playerOrTeamName: 'DEV_Sniper99 (Team Alpha)',
        playerUid: '789234510',
        kills: 14,
        placementPoints: 20,
        totalPoints: 34,
        prizeWon: 2750,
      },
      {
        id: 'res_2',
        tournamentId: 'tour_ff_3',
        rank: 2,
        playerOrTeamName: 'ShadowKiller Squad',
        playerUid: '891029384',
        kills: 9,
        placementPoints: 14,
        totalPoints: 23,
        prizeWon: 1250,
      },
      {
        id: 'res_3',
        tournamentId: 'tour_ff_3',
        rank: 3,
        playerOrTeamName: 'GodOP_Clutch',
        playerUid: '901928374',
        kills: 6,
        placementPoints: 10,
        totalPoints: 16,
        prizeWon: 600,
      },
    ],
    notifications: [
      {
        id: 'notif_1',
        userId: 'ALL',
        title: '🔥 Welcome to Dev eSports!',
        message: 'Daily tournaments for Free Fire MAX and BGMI are live. Instant UPI payouts guaranteed!',
        type: 'INFO',
        read: false,
        createdAt: '2026-11-11 12:00',
      },
      {
        id: 'notif_2',
        userId: gamerId,
        title: '🔑 Room Credentials Released!',
        message: 'Room details for "Free Fire Bermuda Daily Cash Solo" are now unlocked in your dashboard.',
        type: 'ROOM',
        read: false,
        createdAt: '2026-11-11 15:45',
      },
    ],
    adminLogs: [
      {
        id: 'log_1',
        adminEmail: 'admin@devesports.com',
        action: 'RELEASE_ROOM_DETAILS',
        target: 'Free Fire Bermuda Daily Cash Solo (tour_ff_1)',
        timestamp: '2026-11-11 15:45',
        details: 'Uploaded Room ID: ROOM_FF_7721 and Password to 38 registered players',
      },
      {
        id: 'log_2',
        adminEmail: 'admin@devesports.com',
        action: 'CREATE_TOURNAMENT',
        target: 'BGMI Erangel Mega Squad War',
        timestamp: '2026-11-11 10:00',
        details: 'Created tournament with Entry ₹100, Prize Pool ₹6,500',
      },
    ],
  };
}

class Store {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('[DB] Failed to read disk file, falling back to seed data:', err);
    }
    const seed = getInitialState();
    this.save(seed);
    return seed;
  }

  private save(state?: DatabaseState) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(state || this.state, null, 2), 'utf-8');
    } catch (err) {
      console.error('[DB] Failed to save state to disk:', err);
    }
  }

  // --- Users & Auth ---
  public getUsers() {
    return this.state.users;
  }

  public getUserById(id: string) {
    return this.state.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public verifyPassword(userId: string, pass: string): boolean {
    return this.state.passwords[userId] === pass;
  }

  public createUser(userData: Omit<UserAccount, 'id' | 'walletBalance' | 'winningBalance' | 'isBlocked'>, password: string) {
    const existing = this.getUserByEmail(userData.email);
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const id = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const newUser: UserAccount = {
      ...userData,
      id,
      walletBalance: 50, // Welcome signup bonus ₹50!
      winningBalance: 0,
      isBlocked: false,
      bio: userData.bio || 'Competitive gamer in Dev eSports arena.',
      discord: userData.discord || '',
      preferredRole: userData.preferredRole || 'Rusher',
      preferredGame: userData.preferredGame || (userData.ffUid ? 'FREE FIRE MAX' : userData.bgmiId ? 'BGMI' : 'BOTH'),
      avatarFrame: userData.avatarFrame || 'flame',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.state.users.push(newUser);
    this.state.passwords[id] = password;

    // Record welcome bonus transaction
    this.state.transactions.push({
      id: `tx_${Date.now()}`,
      userId: id,
      type: 'DEPOSIT',
      amount: 50,
      status: 'SUCCESS',
      description: 'Welcome Signup Bonus (Free Entry Voucher)',
      refNumber: `BONUS_${id}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    this.save();
    return newUser;
  }

  public updateUserProfile(userId: string, updates: Partial<UserAccount>) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found.');

    if (updates.name) user.name = updates.name;
    if (updates.inGameName) user.inGameName = updates.inGameName;
    if (updates.ffUid !== undefined) user.ffUid = updates.ffUid;
    if (updates.bgmiId !== undefined) user.bgmiId = updates.bgmiId;
    if (updates.mobile) user.mobile = updates.mobile;
    if (updates.bio !== undefined) user.bio = updates.bio;
    if (updates.discord !== undefined) user.discord = updates.discord;
    if (updates.preferredRole !== undefined) user.preferredRole = updates.preferredRole;
    if (updates.preferredGame !== undefined) user.preferredGame = updates.preferredGame;
    if (updates.avatarFrame !== undefined) user.avatarFrame = updates.avatarFrame;

    this.save();
    return user;
  }

  public getUserFullProfile(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return null;

    const registrations = this.state.registrations.filter((r) => r.userId === userId);
    const transactions = this.state.transactions.filter((t) => t.userId === userId);
    const results = this.state.matchResults;

    const winnings = calculateWinningsBreakdown(user, transactions, results);
    const tournamentHistory = calculateTournamentHistory(user, registrations, this.state.tournaments, results);
    const stats = calculateUserStats(tournamentHistory, user);
    const achievements = calculateAchievements(user, tournamentHistory, stats, winnings);

    return {
      user,
      winnings,
      tournamentHistory,
      stats,
      achievements,
    };
  }

  public toggleBlockUser(userId: string, adminEmail: string) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found.');
    user.isBlocked = !user.isBlocked;

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: user.isBlocked ? 'BLOCK_USER' : 'UNBLOCK_USER',
      target: `${user.name} (${user.email})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: user.isBlocked ? 'User blocked from match participation' : 'User unblocked',
    });

    this.save();
    return user;
  }

  // --- Tournaments ---
  public getTournaments() {
    return this.state.tournaments;
  }

  public getTournamentById(id: string) {
    return this.state.tournaments.find((t) => t.id === id);
  }

  public createTournament(tData: Omit<Tournament, 'id' | 'registeredCount'>, adminEmail: string) {
    const id = `tour_${Date.now()}`;
    const newTourney: Tournament = {
      ...tData,
      id,
      registeredCount: 0,
      roomReleased: tData.roomReleased || false,
    };
    this.state.tournaments.unshift(newTourney);

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: 'CREATE_TOURNAMENT',
      target: newTourney.title,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Created ${newTourney.game} ${newTourney.matchType} on ${newTourney.map}, Entry ₹${newTourney.entryFee}, Pool ₹${newTourney.prizePool}`,
    });

    this.save();
    return newTourney;
  }

  public updateTournament(id: string, updates: Partial<Tournament>, adminEmail: string) {
    const tourney = this.getTournamentById(id);
    if (!tourney) throw new Error('Tournament not found.');

    Object.assign(tourney, updates);

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: 'UPDATE_TOURNAMENT',
      target: tourney.title,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: 'Updated tournament metadata and rules',
    });

    this.save();
    return tourney;
  }

  public deleteTournament(id: string, adminEmail: string) {
    const idx = this.state.tournaments.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Tournament not found.');
    const title = this.state.tournaments[idx].title;
    this.state.tournaments.splice(idx, 1);

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: 'DELETE_TOURNAMENT',
      target: title,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: 'Deleted tournament from database',
    });

    this.save();
    return true;
  }

  public releaseRoomCredentials(
    tournamentId: string,
    roomId: string,
    roomPassword: string,
    adminEmail: string
  ) {
    const tourney = this.getTournamentById(tournamentId);
    if (!tourney) throw new Error('Tournament not found.');

    tourney.roomId = roomId;
    tourney.roomPassword = roomPassword;
    tourney.roomReleased = true;

    // Send notifications to all registered players
    const regs = this.state.registrations.filter((r) => r.tournamentId === tournamentId);
    regs.forEach((r) => {
      this.state.notifications.unshift({
        id: `notif_${Date.now()}_${r.userId}`,
        userId: r.userId,
        title: `🔑 Room ID & Password Released!`,
        message: `Credentials for "${tourney.title}" are now available in your dashboard. Room ID: ${roomId}`,
        type: 'ROOM',
        read: false,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
    });

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: 'RELEASE_ROOM_DETAILS',
      target: tourney.title,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Released Room ID: ${roomId} to ${regs.length} registered players`,
    });

    this.save();
    return tourney;
  }

  public registerForTournament(userId: string, tournamentId: string, teamName?: string) {
    const user = this.getUserById(userId);
    const tourney = this.getTournamentById(tournamentId);
    const validation = validateRegistration(user || null, tourney || null, this.state.registrations);

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (!user || !tourney) throw new Error('Invalid registration data');

    // Deduct entry fee from user wallet on server
    user.walletBalance -= tourney.entryFee;
    tourney.registeredCount += 1;

    const slotNumber = tourney.registeredCount;
    const playerUid = tourney.game === 'FREE FIRE MAX' ? user.ffUid : user.bgmiId;

    const newReg: Registration = {
      id: `reg_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      tournamentId,
      userId,
      playerInGameName: user.inGameName,
      playerUid,
      teamName: teamName || (tourney.matchType !== 'SOLO' ? `${user.inGameName}'s Squad` : undefined),
      slotNumber,
    };

    this.state.registrations.push(newReg);

    // Record ledger entry fee transaction
    this.state.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId,
      type: 'ENTRY_FEE',
      amount: tourney.entryFee,
      status: 'SUCCESS',
      description: `Slot #${slotNumber} Booking: ${tourney.title}`,
      refNumber: `SLOT_${tourney.id}_${slotNumber}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    // Notify user
    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId,
      title: '🎟️ Registration Confirmed!',
      message: `You are booked in Slot #${slotNumber} for ${tourney.title}. Room credentials will be released 15 mins before match.`,
      type: 'INFO',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    this.save();
    return { registration: newReg, user, tournament: tourney };
  }

  public getRegistrations(tournamentId?: string, userId?: string) {
    return this.state.registrations.filter((r) => {
      if (tournamentId && r.tournamentId !== tournamentId) return false;
      if (userId && r.userId !== userId) return false;
      return true;
    });
  }

  // --- Match Results & Winner Declaration ---
  public declareResults(
    tournamentId: string,
    results: Array<{ rank: number; playerOrTeamName: string; playerUid: string; kills: number; prizeWon: number }>,
    adminEmail: string
  ) {
    const tourney = this.getTournamentById(tournamentId);
    if (!tourney) throw new Error('Tournament not found.');

    tourney.status = 'COMPLETED';

    results.forEach((res) => {
      const placementPoints = res.rank === 1 ? 20 : res.rank === 2 ? 14 : res.rank === 3 ? 10 : Math.max(1, 10 - res.rank);
      const totalPoints = placementPoints + res.kills * 2;

      this.state.matchResults.unshift({
        id: `res_${Date.now()}_${Math.random()}`,
        tournamentId,
        rank: res.rank,
        playerOrTeamName: res.playerOrTeamName,
        playerUid: res.playerUid,
        kills: res.kills,
        placementPoints,
        totalPoints,
        prizeWon: res.prizeWon,
      });

      // Credit winner wallet if playerUid matches a registered user
      if (res.prizeWon > 0) {
        const matchingUser = this.state.users.find(
          (u) => u.ffUid === res.playerUid || u.bgmiId === res.playerUid || u.inGameName.toLowerCase() === res.playerOrTeamName.toLowerCase()
        );

        if (matchingUser) {
          matchingUser.walletBalance += res.prizeWon;
          matchingUser.winningBalance += res.prizeWon;

          this.state.transactions.unshift({
            id: `tx_${Date.now()}_${matchingUser.id}`,
            userId: matchingUser.id,
            type: 'PRIZE_WON',
            amount: res.prizeWon,
            status: 'SUCCESS',
            description: `Prize Award: Rank #${res.rank} in ${tourney.title}`,
            refNumber: `PRIZE_${tourney.id}_R${res.rank}`,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          });

          this.state.notifications.unshift({
            id: `notif_${Date.now()}_${matchingUser.id}`,
            userId: matchingUser.id,
            title: `🏆 CONGRATULATIONS! Rank #${res.rank} Achieved`,
            message: `You won ₹${res.prizeWon} in ${tourney.title}! Amount credited to your winning balance.`,
            type: 'PRIZE',
            read: false,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          });
        }
      }
    });

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: 'DECLARE_WINNERS',
      target: tourney.title,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Declared ${results.length} winners, distributed prizes`,
    });

    this.save();
    return tourney;
  }

  public getMatchResults(tournamentId?: string) {
    if (tournamentId) {
      return this.state.matchResults.filter((m) => m.tournamentId === tournamentId);
    }
    return this.state.matchResults;
  }

  // --- Wallet & Payments ---
  public depositMoney(userId: string, amount: number, utrNumber: string, isInstantVerified: boolean = true) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found.');
    if (amount <= 0) throw new Error('Deposit amount must be greater than 0.');

    const status = isInstantVerified ? 'SUCCESS' : 'PENDING';
    const txId = `tx_${Date.now()}`;

    if (isInstantVerified) {
      user.walletBalance += amount;
    }

    const tx: Transaction = {
      id: txId,
      userId,
      type: 'DEPOSIT',
      amount,
      status,
      description: `UPI QR Wallet Topup (UTR: ${utrNumber || 'SIMULATED'})`,
      refNumber: `DEP_${Date.now()}`,
      utrNumber,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.state.transactions.unshift(tx);

    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId,
      title: isInstantVerified ? '💰 Deposit Successful!' : '⏳ Deposit Verification Pending',
      message: isInstantVerified
        ? `₹${amount} has been added to your wallet.`
        : `Your deposit of ₹${amount} with UTR ${utrNumber} is being verified by admin.`,
      type: 'PAYMENT',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    this.save();
    return { user, transaction: tx };
  }

  public requestWithdrawal(userId: string, amount: number, upiId: string) {
    const user = this.getUserById(userId);
    const validation = validateWithdrawal(user || null, amount, upiId);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    if (!user) throw new Error('User not found');

    // Lock the requested amount from winning balance and wallet balance
    user.walletBalance -= amount;
    user.winningBalance -= amount;

    const wthId = `wth_${Date.now()}`;
    const req: WithdrawalRequest = {
      id: wthId,
      userId,
      userName: user.name,
      userEmail: user.email,
      amount,
      upiId,
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.state.withdrawals.unshift(req);

    this.state.transactions.unshift({
      id: `tx_${Date.now()}`,
      userId,
      type: 'WITHDRAWAL',
      amount,
      status: 'PENDING',
      description: `Withdrawal Request to UPI (${upiId})`,
      refNumber: `WTH_${wthId}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId,
      title: '📤 Withdrawal Submitted',
      message: `Your withdrawal request of ₹${amount} to ${upiId} is submitted. Payouts processed within 1-2 hours.`,
      type: 'PAYMENT',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    this.save();
    return { user, withdrawal: req };
  }

  public processWithdrawal(withdrawalId: string, approve: boolean, adminNote: string, adminEmail: string) {
    const wth = this.state.withdrawals.find((w) => w.id === withdrawalId);
    if (!wth) throw new Error('Withdrawal request not found.');
    if (wth.status !== 'PENDING') throw new Error('This request has already been processed.');

    wth.status = approve ? 'APPROVED' : 'REJECTED';
    wth.adminNote = adminNote;
    wth.processedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const user = this.getUserById(wth.userId);

    // If rejected, refund the locked amount back to winning balance and wallet balance
    if (!approve && user) {
      user.walletBalance += wth.amount;
      user.winningBalance += wth.amount;
    }

    // Update corresponding transaction in ledger
    const relatedTx = this.state.transactions.find((t) => t.refNumber === `WTH_${wth.id}`);
    if (relatedTx) {
      relatedTx.status = approve ? 'SUCCESS' : 'REJECTED';
    }

    this.state.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: wth.userId,
      title: approve ? '✅ Withdrawal Approved & Sent!' : '❌ Withdrawal Rejected',
      message: approve
        ? `₹${wth.amount} has been successfully sent to your UPI (${wth.upiId}). Check your bank account.`
        : `Your withdrawal of ₹${wth.amount} was rejected. Note: ${adminNote || 'Contact support'}. Amount refunded to your balance.`,
      type: 'PAYMENT',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: approve ? 'APPROVE_WITHDRAWAL' : 'REJECT_WITHDRAWAL',
      target: `${wth.userName} (₹${wth.amount})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: `Processed withdrawal for ${wth.upiId}. Note: ${adminNote || 'None'}`,
    });

    this.save();
    return wth;
  }

  public getTransactions(userId?: string) {
    if (userId) {
      return this.state.transactions.filter((t) => t.userId === userId);
    }
    return this.state.transactions;
  }

  public getWithdrawals(userId?: string) {
    if (userId) {
      return this.state.withdrawals.filter((w) => w.userId === userId);
    }
    return this.state.withdrawals;
  }

  // --- Notifications ---
  public getNotifications(userId?: string) {
    return this.state.notifications.filter((n) => !userId || n.userId === 'ALL' || n.userId === userId);
  }

  public broadcastNotification(title: string, message: string, adminEmail: string) {
    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      userId: 'ALL',
      title,
      message,
      type: 'INFO',
      read: false,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.state.notifications.unshift(notif);

    this.state.adminLogs.unshift({
      id: `log_${Date.now()}`,
      adminEmail,
      action: 'BROADCAST_NOTIFICATION',
      target: 'All Players',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      details: title,
    });

    this.save();
    return notif;
  }

  // --- Admin Metrics ---
  public getAdminMetrics() {
    const totalUsers = this.state.users.filter((u) => u.role === 'user').length;
    const totalTournaments = this.state.tournaments.length;
    const activeTournaments = this.state.tournaments.filter((t) => t.status === 'UPCOMING' || t.status === 'LIVE').length;
    const totalRegistrations = this.state.registrations.length;
    const totalRevenue = this.state.transactions
      .filter((t) => t.type === 'ENTRY_FEE' && t.status === 'SUCCESS')
      .reduce((sum, t) => sum + t.amount, 0);
    const pendingWithdrawalsCount = this.state.withdrawals.filter((w) => w.status === 'PENDING').length;
    const pendingWithdrawalsAmount = this.state.withdrawals
      .filter((w) => w.status === 'PENDING')
      .reduce((sum, w) => sum + w.amount, 0);

    return {
      totalUsers,
      totalTournaments,
      activeTournaments,
      totalRegistrations,
      totalRevenue,
      pendingWithdrawalsCount,
      pendingWithdrawalsAmount,
      recentLogs: this.state.adminLogs.slice(0, 10),
    };
  }
}

export const db = new Store();
