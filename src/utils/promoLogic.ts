/**
 * Pure logic and definitions for Dev eSports 45s Promo Video
 */

export interface SceneDefinition {
  id: number;
  title: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  headline: string;
  subheadline: string;
  voiceover: string;
  sfxTriggers: { time: number; type: 'whoosh' | 'bass_drop' | 'coin' | 'headshot' | 'booyah' }[];
}

export const TOTAL_DURATION = 45; // 45 seconds (including 5s winner testimonial)

export const SCENES: SceneDefinition[] = [
  {
    id: 1,
    title: 'Headshot & Cash Hook',
    startTime: 0,
    endTime: 5,
    headline: 'GAME KHELO, KAMAO 💰',
    subheadline: 'TURN YOUR SKILLS INTO CASH',
    voiceover: 'Bhai, game toh roz khelte ho... ab usi game se kamao bhi!',
    sfxTriggers: [
      { time: 0.1, type: 'whoosh' },
      { time: 1.2, type: 'headshot' },
      { time: 3.5, type: 'coin' },
    ],
  },
  {
    id: 2,
    title: 'Brand Reveal & Daily Tournaments',
    startTime: 5,
    endTime: 14,
    headline: 'DAILY TOURNAMENTS',
    subheadline: 'FREE FIRE & PUBG BATTLEGROUNDS',
    voiceover: 'Dev eSports pe Free Fire aur PUBG ke daily tournaments, fair matches aur seedha cash prize!',
    sfxTriggers: [
      { time: 5.0, type: 'whoosh' },
      { time: 5.2, type: 'bass_drop' },
      { time: 10.5, type: 'coin' },
      { time: 13.0, type: 'whoosh' },
    ],
  },
  {
    id: 3,
    title: 'Booyah / Winner Moments',
    startTime: 14,
    endTime: 24,
    headline: 'FAIR MATCHES ✅ REAL PRIZES ✅ EASY REGISTRATION ✅',
    subheadline: 'INSTANT UPI PAYOUTS • NO DELAYS',
    voiceover: 'Easy registration, fair matches, aur jeetoge toh paisa seedha tumhare paas. Koi jhanjhat nahi!',
    sfxTriggers: [
      { time: 14.0, type: 'whoosh' },
      { time: 14.5, type: 'booyah' },
      { time: 16.5, type: 'coin' },
      { time: 19.0, type: 'coin' },
      { time: 22.0, type: 'bass_drop' },
    ],
  },
  {
    id: 4,
    title: 'Winner Testimonial (5s)',
    startTime: 24,
    endTime: 29,
    headline: 'DOST! ₹2,750 INSTANT JEETA! 🔥',
    subheadline: 'PAST WINNER • ARYAN (DEV_SNIPER99)',
    voiceover: 'Arre dost! Main pichhle Sunday ₹2,750 cash jeeta, 10 minute mein seedha UPI aa gaya! Tu bhi try kar!',
    sfxTriggers: [
      { time: 24.0, type: 'whoosh' },
      { time: 25.2, type: 'coin' },
      { time: 26.5, type: 'booyah' },
      { time: 27.8, type: 'bass_drop' },
    ],
  },
  {
    id: 5,
    title: 'Leaderboard & Match Time',
    startTime: 29,
    endTime: 39,
    headline: 'AAJ KA LEADERBOARD & TIME',
    subheadline: 'WHATSAPP & WEBSITE UPDATES',
    voiceover: 'Aaj ka leaderboard, time aur slot ki details WhatsApp aur website, dono jagah mil jayengi.',
    sfxTriggers: [
      { time: 29.0, type: 'whoosh' },
      { time: 31.5, type: 'coin' },
      { time: 35.0, type: 'whoosh' },
    ],
  },
  {
    id: 6,
    title: 'Call to Action & Description',
    startTime: 39,
    endTime: 45,
    headline: 'WEBSITE + WHATSAPP LINK → DESCRIPTION MEIN 👇',
    subheadline: 'REGISTER NOW • LIMITED SLOTS',
    voiceover: 'Dono ki link description mein di hui hai. Abhi click karo, register karo, aur apni skill se jeeto!',
    sfxTriggers: [
      { time: 39.0, type: 'whoosh' },
      { time: 40.0, type: 'bass_drop' },
      { time: 43.5, type: 'coin' },
    ],
  },
];

/**
 * Determine active scene based on currentTime in seconds
 */
export function getActiveScene(currentTime: number): SceneDefinition {
  const clampedTime = Math.max(0, Math.min(currentTime, TOTAL_DURATION));
  const found = SCENES.find(
    (scene) => clampedTime >= scene.startTime && clampedTime < scene.endTime
  );
  return found || SCENES[SCENES.length - 1];
}

/**
 * Format seconds to MM:SS or SS.ms
 */
export function formatTime(seconds: number): string {
  const clamped = Math.max(0, Math.min(seconds, TOTAL_DURATION));
  const mins = Math.floor(clamped / 60);
  const secs = Math.floor(clamped % 60);
  const ms = Math.floor(Math.round((clamped * 10)) % 10);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
}

/**
 * Generate formatted video description with customized website and whatsapp links
 */
export function generateVideoDescription(websiteUrl: string, whatsappUrl: string): string {
  return `🔥 Dev eSports: Free Fire & PUBG Tournaments 🔥
💰 Khelo aur jeeto real cash prizes!
🌐 Website: ${websiteUrl.trim() || 'https://devesports.in'}
📲 WhatsApp: ${whatsappUrl.trim() || 'https://chat.whatsapp.com/DevEsportsOfficial'}
📊 Aaj ka leaderboard, time aur slot dono jagah milega 👆
#DevEsports #FreeFire #PUBG #EsportsIndia #Tournament`;
}

/**
 * Calculate progress percentage (0 - 100)
 */
export function calculateProgress(currentTime: number): number {
  return Math.min(100, Math.max(0, (currentTime / TOTAL_DURATION) * 100));
}
