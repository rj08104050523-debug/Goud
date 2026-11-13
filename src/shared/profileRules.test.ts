import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWinningsBreakdown,
  calculateTournamentHistory,
  calculateUserStats,
  calculateAchievements,
  MatchResultRecord,
  TransactionRecord,
} from './profileRules';
import { UserAccount, Tournament, Registration } from './tournamentRules';

const mockUser: UserAccount = {
  id: 'usr_test_1',
  name: 'Test Gamer',
  email: 'test@devesports.com',
  mobile: '9876543210',
  inGameName: 'DEV_TestAlpha',
  ffUid: '11223344',
  bgmiId: '55667788',
  walletBalance: 1450,
  winningBalance: 1200,
  isBlocked: false,
  role: 'user',
};

const mockTournaments: Tournament[] = [
  {
    id: 'tour_1',
    title: 'Free Fire Bermuda Daily',
    game: 'FREE FIRE MAX',
    matchType: 'SOLO',
    map: 'Bermuda',
    entryFee: 30,
    prizePool: 2000,
    maxSlots: 48,
    registeredCount: 38,
    matchDate: 'Today',
    matchTime: '04:00 PM',
    status: 'COMPLETED',
    roomReleased: true,
  },
  {
    id: 'tour_2',
    title: 'BGMI Erangel Mega Squad',
    game: 'BGMI',
    matchType: 'SQUAD',
    map: 'Erangel',
    entryFee: 100,
    prizePool: 6500,
    maxSlots: 25,
    registeredCount: 18,
    matchDate: 'Today',
    matchTime: '06:30 PM',
    status: 'UPCOMING',
    roomReleased: false,
  },
];

const mockRegistrations: Registration[] = [
  {
    id: 'reg_1',
    tournamentId: 'tour_1',
    userId: 'usr_test_1',
    playerInGameName: 'DEV_TestAlpha',
    playerUid: '11223344',
    slotNumber: 5,
  },
  {
    id: 'reg_2',
    tournamentId: 'tour_2',
    userId: 'usr_test_1',
    playerInGameName: 'DEV_TestAlpha',
    playerUid: '55667788',
    teamName: 'Team Test',
    slotNumber: 2,
  },
];

const mockResults: MatchResultRecord[] = [
  {
    id: 'res_1',
    tournamentId: 'tour_1',
    rank: 1,
    playerOrTeamName: 'DEV_TestAlpha',
    playerUid: '11223344',
    kills: 12,
    placementPoints: 20,
    totalPoints: 44,
    prizeWon: 1200,
  },
];

const mockTransactions: TransactionRecord[] = [
  {
    id: 'tx_1',
    userId: 'usr_test_1',
    type: 'ENTRY_FEE',
    amount: 30,
    status: 'SUCCESS',
    description: 'Entry Fee tour_1',
    refNumber: 'EF_1',
    createdAt: '2026-11-12 10:00',
  },
  {
    id: 'tx_2',
    userId: 'usr_test_1',
    type: 'ENTRY_FEE',
    amount: 100,
    status: 'SUCCESS',
    description: 'Entry Fee tour_2',
    refNumber: 'EF_2',
    createdAt: '2026-11-12 11:00',
  },
  {
    id: 'tx_3',
    userId: 'usr_test_1',
    type: 'PRIZE_WON',
    amount: 1200,
    status: 'SUCCESS',
    description: 'Prize tour_1',
    refNumber: 'PZ_1',
    createdAt: '2026-11-12 18:00',
  },
  {
    id: 'tx_4',
    userId: 'usr_test_1',
    type: 'WITHDRAWAL',
    amount: 500,
    status: 'SUCCESS',
    description: 'UPI Payout',
    refNumber: 'WTH_1',
    createdAt: '2026-11-12 19:00',
  },
];

test('calculateWinningsBreakdown computes prize money, withdrawals, and net profit correctly', () => {
  const breakdown = calculateWinningsBreakdown(mockUser, mockTransactions, mockResults);
  assert.equal(breakdown.totalPrizeMoneyWon, 1200);
  assert.equal(breakdown.availableWinningBalance, 1200);
  assert.equal(breakdown.currentWalletBalance, 1450);
  assert.equal(breakdown.totalWithdrawn, 500);
  assert.equal(breakdown.totalEntryFeesSpent, 130);
  assert.equal(breakdown.netProfit, 1070);
});

test('calculateTournamentHistory enriches registrations with rank, kills, points, and prize', () => {
  const history = calculateTournamentHistory(mockUser, mockRegistrations, mockTournaments, mockResults);
  assert.equal(history.length, 2);

  const completed = history.find((h) => h.tournamentId === 'tour_1');
  assert.ok(completed);
  assert.equal(completed.rank, 1);
  assert.equal(completed.isWinner, true);
  assert.equal(completed.isPodium, true);
  assert.equal(completed.kills, 12);
  assert.equal(completed.prizeWon, 1200);
  assert.equal(completed.slotNumber, 5);

  const upcoming = history.find((h) => h.tournamentId === 'tour_2');
  assert.ok(upcoming);
  assert.equal(upcoming.rank, null);
  assert.equal(upcoming.isWinner, false);
  assert.equal(upcoming.prizeWon, 0);
});

test('calculateUserStats calculates matches, win rate, kills, and tier accurately', () => {
  const history = calculateTournamentHistory(mockUser, mockRegistrations, mockTournaments, mockResults);
  const stats = calculateUserStats(history, mockUser);

  assert.equal(stats.tournamentsJoined, 2);
  assert.equal(stats.matchesPlayed, 1);
  assert.equal(stats.wins, 1);
  assert.equal(stats.podiums, 1);
  assert.equal(stats.totalKills, 12);
  assert.equal(stats.winRate, 100);
  assert.equal(stats.podiumRate, 100);
  assert.equal(stats.tier, 'DIAMOND');
});

test('calculateAchievements unlocks achievements based on player milestones', () => {
  const history = calculateTournamentHistory(mockUser, mockRegistrations, mockTournaments, mockResults);
  const stats = calculateUserStats(history, mockUser);
  const winnings = calculateWinningsBreakdown(mockUser, mockTransactions, mockResults);
  const achievements = calculateAchievements(mockUser, history, stats, winnings);

  assert.ok(achievements.length >= 8);

  const firstDrop = achievements.find((a) => a.id === 'ACH_FIRST_REG');
  assert.equal(firstDrop?.unlocked, true);

  const booyah = achievements.find((a) => a.id === 'ACH_BOOYAH_WIN');
  assert.equal(booyah?.unlocked, true);

  const headhunter = achievements.find((a) => a.id === 'ACH_HEADHUNTER');
  assert.equal(headhunter?.unlocked, true);

  const cash1k = achievements.find((a) => a.id === 'ACH_CASH_HUNTER_1K');
  assert.equal(cash1k?.unlocked, true);

  const dualOperative = achievements.find((a) => a.id === 'ACH_DUAL_OPERATIVE');
  assert.equal(dualOperative?.unlocked, true);

  const highRoller2k5 = achievements.find((a) => a.id === 'ACH_GRAND_HIGH_ROLLER');
  assert.equal(highRoller2k5?.unlocked, false);
});
