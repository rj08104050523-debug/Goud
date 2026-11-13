import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SCENES,
  TOTAL_DURATION,
  getActiveScene,
  formatTime,
  generateVideoDescription,
  calculateProgress,
} from './promoLogic';

test('SCENES cover full 45s duration without gaps including 5s winner testimonial', () => {
  assert.equal(TOTAL_DURATION, 45);
  assert.equal(SCENES.length, 6);
  assert.equal(SCENES[0].startTime, 0);
  assert.equal(SCENES[0].endTime, 5);
  assert.equal(SCENES[1].startTime, 5);
  assert.equal(SCENES[1].endTime, 14);
  assert.equal(SCENES[2].startTime, 14);
  assert.equal(SCENES[2].endTime, 24);
  // 5-second winner testimonial segment
  assert.equal(SCENES[3].startTime, 24);
  assert.equal(SCENES[3].endTime, 29);
  assert.equal(SCENES[3].endTime - SCENES[3].startTime, 5);
  assert.equal(SCENES[4].startTime, 29);
  assert.equal(SCENES[4].endTime, 39);
  assert.equal(SCENES[5].startTime, 39);
  assert.equal(SCENES[5].endTime, 45);
});

test('Winner Testimonial scene uses energetic Hinglish dost tone and mentions cash prize win', () => {
  const testimonial = SCENES[3];
  assert.match(testimonial.title, /testimonial/i);
  assert.match(testimonial.voiceover.toLowerCase(), /\bdost\b/);
  assert.match(testimonial.voiceover.toLowerCase(), /cash|₹/);
  assert.ok(testimonial.headline.includes('₹'));
});

test('getActiveScene returns correct scene at boundaries and midpoints', () => {
  assert.equal(getActiveScene(0).id, 1);
  assert.equal(getActiveScene(2.5).id, 1);
  assert.equal(getActiveScene(5.0).id, 2);
  assert.equal(getActiveScene(10).id, 2);
  assert.equal(getActiveScene(14.0).id, 3);
  assert.equal(getActiveScene(20.0).id, 3);
  assert.equal(getActiveScene(24.0).id, 4);
  assert.equal(getActiveScene(26.5).id, 4);
  assert.equal(getActiveScene(28.9).id, 4);
  assert.equal(getActiveScene(29.0).id, 5);
  assert.equal(getActiveScene(35.0).id, 5);
  assert.equal(getActiveScene(39.0).id, 6);
  assert.equal(getActiveScene(44.9).id, 6);
  assert.equal(getActiveScene(45).id, 6);
});

test('formatTime outputs MM:SS.d correctly', () => {
  assert.equal(formatTime(0), '00:00.0');
  assert.equal(formatTime(5.5), '00:05.5');
  assert.equal(formatTime(24.2), '00:24.2');
  assert.equal(formatTime(45), '00:45.0');
});

test('calculateProgress returns accurate percentage', () => {
  assert.equal(calculateProgress(0), 0);
  assert.equal(calculateProgress(22.5), 50);
  assert.equal(calculateProgress(45), 100);
});

test('generateVideoDescription matches required user template and substitutes links', () => {
  const desc = generateVideoDescription('https://mydev.gg', 'https://chat.whatsapp.com/test1234');
  assert.ok(desc.includes('🔥 Dev eSports: Free Fire & PUBG Tournaments 🔥'));
  assert.ok(desc.includes('💰 Khelo aur jeeto real cash prizes!'));
  assert.ok(desc.includes('🌐 Website: https://mydev.gg'));
  assert.ok(desc.includes('📲 WhatsApp: https://chat.whatsapp.com/test1234'));
  assert.ok(desc.includes('#DevEsports #FreeFire #PUBG #EsportsIndia #Tournament'));
});
