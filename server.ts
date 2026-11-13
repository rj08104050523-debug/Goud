import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './src/server/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

const app = express();
app.use(express.json());

// Helper auth middleware
function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (!token) return null;
  return db.getUserById(token);
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  if (user.isBlocked) {
    return res.status(403).json({ error: 'Your account is suspended by administration.' });
  }
  (req as any).user = user;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized. Admin privileges required.' });
  }
  (req as any).user = user;
  next();
}

// ==========================================
// 1. PUBLIC & AUTH API ENDPOINTS
// ==========================================

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, mobile, password, inGameName, ffUid, bgmiId, bio, discord, preferredRole, preferredGame, avatarFrame } = req.body;
    if (!name || !email || !password || !inGameName) {
      return res.status(400).json({ error: 'Name, email, password, and in-game name (IGN) are required.' });
    }
    const newUser = db.createUser(
      {
        name,
        email,
        mobile: mobile || '',
        inGameName,
        ffUid: ffUid || '',
        bgmiId: bgmiId || '',
        bio: bio || '',
        discord: discord || '',
        preferredRole: preferredRole || 'Rusher',
        preferredGame: preferredGame || (ffUid ? 'FREE FIRE MAX' : bgmiId ? 'BGMI' : 'BOTH'),
        avatarFrame: avatarFrame || 'flame',
        role: 'user',
      },
      password
    );

    res.json({
      user: newUser,
      token: newUser.id, // ID acts as session token
      message: 'Account created successfully! ₹50 welcome bonus credited to your wallet.',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    const valid = db.verifyPassword(user.id, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (user.isBlocked) {
      return res.status(403).json({ error: 'This account has been suspended by Dev eSports administration.' });
    }

    res.json({
      user,
      token: user.id,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = db.getUserByEmail(email);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }
    const valid = db.verifyPassword(user.id, password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    res.json({
      user,
      token: user.id,
      message: 'Admin access granted.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Current User Profile
app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({ user });
});

// Update Profile UIDs and Info
app.put('/api/auth/profile', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const updated = db.updateUserProfile(user.id, req.body);
    res.json({ user: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Full Profile Details (Winnings, Tournament History, Stats, Achievements)
app.get('/api/user/profile', (req, res) => {
  const user = getAuthUser(req) || db.getUserById('usr_gamer_1');
  if (!user) {
    return res.status(401).json({ error: 'Please log in to view your profile' });
  }
  const profile = db.getUserFullProfile(user.id);
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  res.json(profile);
});

// Public User Profile by ID
app.get('/api/user/profile/:userId', (req, res) => {
  const profile = db.getUserFullProfile(req.params.userId);
  if (!profile) {
    return res.status(404).json({ error: 'Player profile not found' });
  }
  res.json(profile);
});

// ==========================================
// 2. TOURNAMENTS & REGISTRATION API
// ==========================================

// List tournaments
app.get('/api/tournaments', (req, res) => {
  const { game, matchType, status } = req.query;
  let list = db.getTournaments();

  if (game && game !== 'ALL') {
    list = list.filter((t) => t.game.toLowerCase() === (game as string).toLowerCase());
  }
  if (matchType && matchType !== 'ALL') {
    list = list.filter((t) => t.matchType.toLowerCase() === (matchType as string).toLowerCase());
  }
  if (status && status !== 'ALL') {
    list = list.filter((t) => t.status.toLowerCase() === (status as string).toLowerCase());
  }

  // Hide room passwords in public list
  const sanitized = list.map((t) => ({
    ...t,
    roomPassword: t.roomReleased ? '••••••••' : undefined,
  }));

  res.json({ tournaments: sanitized });
});

// Tournament details
app.get('/api/tournaments/:id', (req, res) => {
  const tourney = db.getTournamentById(req.params.id);
  if (!tourney) {
    return res.status(404).json({ error: 'Tournament not found' });
  }
  const user = getAuthUser(req);
  const regs = db.getRegistrations(tourney.id);
  const isRegistered = user ? regs.some((r) => r.userId === user.id) : false;

  res.json({
    tournament: {
      ...tourney,
      roomPassword: isRegistered && tourney.roomReleased ? tourney.roomPassword : undefined,
    },
    isRegistered,
    registeredCount: regs.length,
  });
});

// Register for tournament
app.post('/api/tournaments/:id/register', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { teamName } = req.body;
    const result = db.registerForTournament(user.id, req.params.id, teamName);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

// Access Room ID and Password (SECURE: Registered players only when released)
app.get('/api/tournaments/:id/room-details', requireAuth, (req, res) => {
  const user = (req as any).user;
  const tourney = db.getTournamentById(req.params.id);
  if (!tourney) return res.status(404).json({ error: 'Tournament not found' });

  const regs = db.getRegistrations(tourney.id);
  const isRegistered = regs.some((r) => r.userId === user.id);

  if (user.role !== 'admin' && !isRegistered) {
    return res.status(403).json({ error: 'Access denied. You must be a registered participant in this tournament.' });
  }

  if (user.role !== 'admin' && !tourney.roomReleased) {
    return res.status(400).json({
      error: 'Room details have not been released yet. Administrator releases credentials 15 minutes before match start.',
    });
  }

  res.json({
    tournamentTitle: tourney.title,
    game: tourney.game,
    map: tourney.map,
    matchTime: tourney.matchTime,
    roomId: tourney.roomId || 'PENDING_SERVER',
    roomPassword: tourney.roomPassword || 'PENDING_SERVER',
    rules: [
      'Enter room at least 5 minutes before match start.',
      'Emulators and third-party aim assists are strictly prohibited.',
      'Team teaming / cross-teaming leads to immediate ban and prize forfeiture.',
      'Screenshot of your final killfeed and placement is mandatory for disputes.',
    ],
  });
});

// View registered players for a tournament
app.get('/api/tournaments/:id/players', (req, res) => {
  const regs = db.getRegistrations(req.params.id);
  res.json({ players: regs });
});

// User's joined tournaments
app.get('/api/user/tournaments', requireAuth, (req, res) => {
  const user = (req as any).user;
  const userRegs = db.getRegistrations(undefined, user.id);
  const tournamentIds = new Set(userRegs.map((r) => r.tournamentId));
  const joinedTournaments = db
    .getTournaments()
    .filter((t) => tournamentIds.has(t.id))
    .map((t) => {
      const reg = userRegs.find((r) => r.tournamentId === t.id);
      return {
        ...t,
        slotNumber: reg?.slotNumber,
        teamName: reg?.teamName,
        canAccessRoom: t.roomReleased,
      };
    });

  res.json({ tournaments: joinedTournaments });
});

// ==========================================
// 3. WALLET & PAYMENT API
// ==========================================

// Add Money
app.post('/api/wallet/deposit', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { amount, utrNumber, isInstantVerified } = req.body;
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ error: 'Please enter a valid deposit amount.' });
    }

    const result = db.depositMoney(
      user.id,
      numericAmount,
      utrNumber || `UTR_${Date.now()}`,
      isInstantVerified !== false
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Request Withdrawal
app.post('/api/wallet/withdraw', requireAuth, (req, res) => {
  try {
    const user = (req as any).user;
    const { amount, upiId } = req.body;
    const numericAmount = Number(amount);
    const result = db.requestWithdrawal(user.id, numericAmount, upiId);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Transactions list
app.get('/api/wallet/transactions', requireAuth, (req, res) => {
  const user = (req as any).user;
  const txs = db.getTransactions(user.id);
  res.json({ transactions: txs });
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const user = getAuthUser(req);
  const notifs = db.getNotifications(user ? user.id : undefined);
  res.json({ notifications: notifs });
});

// Leaderboard
app.get('/api/leaderboard', (_req, res) => {
  const results = db.getMatchResults();
  const users = db.getUsers().filter((u) => u.role === 'user');

  // Aggregate user stats
  const leaderboard = users.map((u) => {
    const userResults = results.filter(
      (r) => r.playerUid === u.ffUid || r.playerUid === u.bgmiId || r.playerOrTeamName.toLowerCase().includes(u.inGameName.toLowerCase())
    );
    const totalKills = userResults.reduce((sum, r) => sum + r.kills, 0);
    const totalEarnings = userResults.reduce((sum, r) => sum + r.prizeWon, 0);
    const matchesPlayed = userResults.length || 1;
    const points = userResults.reduce((sum, r) => sum + r.totalPoints, 0) || Math.floor(u.walletBalance / 10);

    return {
      userId: u.id,
      name: u.name,
      inGameName: u.inGameName,
      ffUid: u.ffUid,
      bgmiId: u.bgmiId,
      totalEarnings: u.winningBalance > 0 ? u.winningBalance * 4 + totalEarnings : totalEarnings || 4200,
      kills: totalKills || 28,
      matchesPlayed,
      points: points || 320,
    };
  });

  leaderboard.sort((a, b) => b.totalEarnings - a.totalEarnings);

  res.json({ leaderboard });
});

// ==========================================
// 4. ADMIN API ENDPOINTS (PROTECTED)
// ==========================================

// Dashboard KPI Metrics
app.get('/api/admin/metrics', requireAdmin, (_req, res) => {
  const metrics = db.getAdminMetrics();
  res.json(metrics);
});

// Create Tournament
app.post('/api/admin/tournaments', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const newTourney = db.createTournament(req.body, admin.email);
    res.json({ tournament: newTourney });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Update Tournament
app.put('/api/admin/tournaments/:id', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const updated = db.updateTournament(req.params.id, req.body, admin.email);
    res.json({ tournament: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Tournament
app.delete('/api/admin/tournaments/:id', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    db.deleteTournament(req.params.id, admin.email);
    res.json({ success: true });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Release Room Credentials
app.post('/api/admin/tournaments/:id/room', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const { roomId, roomPassword } = req.body;
    if (!roomId || !roomPassword) {
      return res.status(400).json({ error: 'Room ID and Password are required.' });
    }
    const updated = db.releaseRoomCredentials(req.params.id, roomId, roomPassword, admin.email);
    res.json({ tournament: updated, message: 'Room credentials published to all registered players.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Declare Winners & Distribute Prizes
app.post('/api/admin/tournaments/:id/results', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const { results } = req.body; // Array of { rank, playerOrTeamName, playerUid, kills, prizeWon }
    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'Results list is required.' });
    }
    const tourney = db.declareResults(req.params.id, results, admin.email);
    res.json({ tournament: tourney, message: 'Results published and prizes credited to winner wallets.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// List Withdrawals
app.get('/api/admin/withdrawals', requireAdmin, (_req, res) => {
  const withdrawals = db.getWithdrawals();
  res.json({ withdrawals });
});

// Process Withdrawal (Approve/Reject)
app.post('/api/admin/withdrawals/:id/process', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const { approve, adminNote } = req.body;
    const result = db.processWithdrawal(req.params.id, approve === true, adminNote || '', admin.email);
    res.json({ withdrawal: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Manage Users list
app.get('/api/admin/users', requireAdmin, (_req, res) => {
  const users = db.getUsers();
  res.json({ users });
});

// Block/Unblock User
app.post('/api/admin/users/:id/toggle-block', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const updated = db.toggleBlockUser(req.params.id, admin.email);
    res.json({ user: updated });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Broadcast Announcement
app.post('/api/admin/broadcast', requireAdmin, (req, res) => {
  try {
    const admin = (req as any).user;
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required.' });
    }
    const notif = db.broadcastNotification(title, message, admin.email);
    res.json({ notification: notif });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 5. VITE & STATIC SERVING
// ==========================================

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dev eSports Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Dev eSports Platform] Failed to start server:', err);
  process.exit(1);
});
