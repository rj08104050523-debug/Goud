/**
 * Pure Tournament & Wallet Validation Rules
 * Decoupled from UI and framework for deterministic unit testing.
 */

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  mobile: string;
  inGameName: string;
  ffUid: string;
  bgmiId: string;
  walletBalance: number;
  winningBalance: number;
  isBlocked: boolean;
  role: 'user' | 'admin';
  bio?: string;
  discord?: string;
  preferredRole?: 'Rusher' | 'Sniper' | 'IGL' | 'Assault' | 'Support';
  preferredGame?: 'FREE FIRE MAX' | 'BGMI' | 'BOTH';
  avatarFrame?: string;
  createdAt?: string;
}

export interface Tournament {
  id: string;
  title: string;
  game: 'FREE FIRE MAX' | 'BGMI';
  matchType: 'SOLO' | 'DUO' | 'SQUAD';
  map: string;
  entryFee: number;
  prizePool: number;
  maxSlots: number;
  registeredCount: number;
  matchDate: string;
  matchTime: string;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
  roomId?: string;
  roomPassword?: string;
  roomReleased: boolean;
}

export interface Registration {
  id: string;
  tournamentId: string;
  userId: string;
  playerInGameName: string;
  playerUid: string;
  teamName?: string;
  slotNumber: number;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate whether a user can register for a tournament
 */
export function validateRegistration(
  user: UserAccount | null,
  tournament: Tournament | null,
  userRegistrations: Registration[]
): ValidationResult {
  if (!user) {
    return { valid: false, error: 'Authentication required. Please log in to register.' };
  }

  if (user.isBlocked) {
    return { valid: false, error: 'Your account has been suspended by Dev eSports administration.' };
  }

  if (!tournament) {
    return { valid: false, error: 'Tournament not found.' };
  }

  if (tournament.status !== 'UPCOMING') {
    return { valid: false, error: `Registrations are closed (Tournament is ${tournament.status}).` };
  }

  if (tournament.registeredCount >= tournament.maxSlots) {
    return { valid: false, error: 'Tournament is already full! All slots have been booked.' };
  }

  const alreadyRegistered = userRegistrations.some(
    (reg) => reg.tournamentId === tournament.id && reg.userId === user.id
  );
  if (alreadyRegistered) {
    return { valid: false, error: 'You are already registered for this tournament.' };
  }

  // Validate game UID presence
  if (tournament.game === 'FREE FIRE MAX') {
    if (!user.ffUid || user.ffUid.trim() === '') {
      return { valid: false, error: 'Please update your Free Fire UID in your profile before registering.' };
    }
  } else if (tournament.game === 'BGMI') {
    if (!user.bgmiId || user.bgmiId.trim() === '') {
      return { valid: false, error: 'Please update your BGMI Character ID in your profile before registering.' };
    }
  }

  // Validate entry fee against wallet balance
  if (user.walletBalance < tournament.entryFee) {
    const deficit = tournament.entryFee - user.walletBalance;
    return {
      valid: false,
      error: `Insufficient wallet balance. Entry fee is ₹${tournament.entryFee}, your balance is ₹${user.walletBalance}. Please add ₹${deficit} to proceed.`,
    };
  }

  return { valid: true };
}

/**
 * Check if a user is eligible to view room ID and Password
 */
export function canAccessRoomDetails(
  user: UserAccount | null,
  tournament: Tournament | null,
  isRegistered: boolean
): boolean {
  if (!user || !tournament) return false;
  if (user.role === 'admin') return true;
  return isRegistered && tournament.roomReleased === true;
}

/**
 * Validate withdrawal request
 */
export function validateWithdrawal(
  user: UserAccount | null,
  amount: number,
  upiId: string
): ValidationResult {
  if (!user) {
    return { valid: false, error: 'Authentication required.' };
  }

  if (user.isBlocked) {
    return { valid: false, error: 'Account is suspended.' };
  }

  if (amount < 50) {
    return { valid: false, error: 'Minimum withdrawal amount is ₹50.' };
  }

  if (amount > user.winningBalance) {
    return {
      valid: false,
      error: `Withdrawal amount exceeds your winning balance (₹${user.winningBalance}). Only tournament winnings can be withdrawn directly.`,
    };
  }

  const upiRegex = /^[\w.-]+@[\w.-]+$/;
  if (!upiId || !upiRegex.test(upiId.trim())) {
    return { valid: false, error: 'Please enter a valid UPI ID (e.g. yourname@okaxis or 9876543210@paytm).' };
  }

  return { valid: true };
}

/**
 * Calculate recommended prize pool breakdown
 */
export function calculatePrizeDistribution(totalPrize: number) {
  return {
    firstPlace: Math.round(totalPrize * 0.55),
    secondPlace: Math.round(totalPrize * 0.25),
    thirdPlace: Math.round(totalPrize * 0.12),
    perKillPool: Math.round(totalPrize * 0.08),
  };
}
