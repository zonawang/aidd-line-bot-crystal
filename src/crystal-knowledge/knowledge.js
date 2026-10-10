import { randomInt } from 'node:crypto';
import { crystals, guides } from './content.js';
import { SafeError } from '../bot-experience/deadline.js';
export function parseBirthday(text, required = true) {
  if (typeof text !== 'string') throw new SafeError('INVALID_BIRTHDAY', 400);
  const candidates = [
    ...text.matchAll(
      /(?<!\d)(\d{4})[-/年\s]+(\d{1,2})[-/月\s]+(\d{1,2})(?:日)?(?!\d)/g,
    ),
    ...text.matchAll(/(?<!\d)(\d{4})(\d{2})(\d{2})(?!\d)/g),
  ];
  const dates = candidates.map((m) => {
    const y = Number(m[1]),
      month = Number(m[2]),
      day = Number(m[3]),
      leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
    const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (
      y < 1 ||
      y > 9999 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > days[month - 1]
    )
      throw new SafeError('INVALID_BIRTHDAY', 400);
    return (
      String(y).padStart(4, '0') +
      '-' +
      String(month).padStart(2, '0') +
      '-' +
      String(day).padStart(2, '0')
    );
  });
  const unique = [...new Set(dates)];
  if (unique.length !== 1) {
    if (!required && !unique.length) return null;
    throw new SafeError('INVALID_BIRTHDAY', 400);
  }
  return unique[0];
}
export function lifePath(birthday) {
  const date = parseBirthday(birthday);
  let n = [...date.replaceAll('-', '')].reduce((sum, d) => sum + Number(d), 0);
  while (n > 9) n = [...String(n)].reduce((sum, d) => sum + Number(d), 0);
  return n;
}
export function recommend(pick = randomInt) {
  const pool = [...crystals];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = pick(i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}
export function selectCrystal(id, currentIds) {
  const card = crystals.find((c) => c.crystalId === id);
  if (!card || !currentIds.includes(id))
    throw new SafeError('UNKNOWN_CRYSTAL', 400);
  return card;
}
export function guide(label) {
  if (!Object.hasOwn(guides, label)) throw new SafeError('INVALID_INPUT', 400);
  return guides[label];
}
export const knowledge = {
  parseBirthday,
  lifePath,
  recommend,
  selectCrystal,
  guide,
};
