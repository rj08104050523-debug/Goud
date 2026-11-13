import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateRegistration,
  canAccessRoomDetails,
  validateWithdrawal,
  calculatePrizeDistribution,
  UserAccount,
  Tournament,
  Registration,
} from './tournamentRules';

const mockUser: UserAccount = {
  id: 'usr_1',
  name: 'Dev Gamer',
  email: 'gamer@devesports.com',
  mobile: '9876543210',
  inGameName: 'DEV_GamerX',
  ffUid: '1092837465',
  bgmiId: '5192837465',
  walletBalance: 150,
  winningBalance: 100,
  isBlocked: false,
  role: 'user',
};

const mockTournament: Tournament = {
  id: 'tour_1',
  title: 'Free Fire Bermuda Cash Clash',
  game: 'FREE FIRE MAX',
  matchType: 'SOLO',
  map: 'Bermuda',
  entryFee: 50,
  prizePool: 2000,
  maxSlots: 48,
  registeredCount: 20,
  matchDate: '2026-11-15',
  matchTime: '18:00',
  status: 'UPCOMING',
  roomId: 'ROOM_9918',
  roomPassword: 'PASS_FREEFIRE',
  roomReleased: false,
};

test('validateRegistration allows eligible user with sufficient balance', () => {
  const result = validateRegistration(mockUser, mockTournament, []);
  assert.equal(result.valid, true);
  assert.equal(result.error, undefined);
});

test('validateRegistration prevents duplicate registration', () => {
  const existingReg: Registration = {
    id: 'reg_1',
    tournamentId: 'tour_1',
    userId: 'usr_1',
    playerInGameName: 'DEV_GamerX',
    playerUid: '1092837465',
    slotNumber: 1,
  };
  const result = validateRegistration(mockUser, mockTournament, [existingReg]);
  assert.equal(result.valid, false);
  assert.match(result.error || '', /already registered/i);
});

test('validateRegistration blocks user with insufficient balance', () => {
  const poorUser = { ...mockUser, walletBalance: 20 };
  const result = validateRegistration(poorUser, mockTournament, []);
  assert.equal(result.valid, false);
  assert.match(result.error || '', /Insufficient wallet balance/i);
});

test('validateRegistration requires Free Fire UID for Free Fire tournaments', () => {
  const noFfUser = { ...mockUser, ffUid: '' };
  const result = validateRegistration(noFfUser, mockTournament, []);
  assert.equal(result.valid, false);
  assert.match(result.error || '', /Free Fire UID/i);
});

test('validateRegistration blocks registration when tournament is full', () => {
  const fullTournament = { ...mockTournament, registeredCount: 48, maxSlots: 48 };
  const result = validateRegistration(mockUser, fullTournament, []);
  assert.equal(result.valid, false);
  assert.match(result.error || '', /All slots have been booked/i);
});

test('canAccessRoomDetails enforces security for room ID and Password', () => {
  // Not released yet
  assert.equal(canAccessRoomDetails(mockUser, mockTournament, true), false);

  // Released and registered
  const releasedTourney = { ...mockTournament, roomReleased: true };
  assert.equal(canAccessRoomDetails(mockUser, releasedTourney, true), true);

  // Released but NOT registered user
  assert.equal(canAccessRoomDetails(mockUser, releasedTourney, false), false);

  // Admin can always access room details
  const adminUser = { ...mockUser, role: 'admin' as const };
  assert.equal(canAccessRoomDetails(adminUser, mockTournament, false), true);
});

test('validateWithdrawal verifies minimum amount and winning balance limits', () => {
  // Valid withdrawal
  const validResult = validateWithdrawal(mockUser, 80, 'gamer@okaxis');
  assert.equal(validResult.valid, true);

  // Below minimum
  const belowMin = validateWithdrawal(mockUser, 30, 'gamer@okaxis');
  assert.equal(belowMin.valid, false);
  assert.match(belowMin.error || '', /Minimum withdrawal/i);

  // Exceeds winning balance
  const exceeds = validateWithdrawal(mockUser, 150, 'gamer@okaxis');
  assert.equal(exceeds.valid, false);
  assert.match(exceeds.error || '', /exceeds your winning balance/i);

  // Invalid UPI ID
  const invalidUpi = validateWithdrawal(mockUser, 70, 'invalid_upi_string');
  assert.equal(invalidUpi.valid, false);
  assert.match(invalidUpi.error || '', /valid UPI ID/i);
});

test('calculatePrizeDistribution distributes percentages properly', () => {
  const dist = calculatePrizeDistribution(1000);
  assert.equal(dist.firstPlace, 550);
  assert.equal(dist.secondPlace, 250);
  assert.equal(dist.thirdPlace, 120);
  assert.equal(dist.perKillPool, 80);
});
