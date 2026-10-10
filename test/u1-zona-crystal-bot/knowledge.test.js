import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBirthday,
  lifePath,
  recommend,
  selectCrystal,
  guide,
} from '../../src/crystal-knowledge/knowledge.js';
import { crystals } from '../../src/crystal-knowledge/content.js';
for (const date of [
  '2000-01-01',
  '2000/01/01',
  '2000年1月1日',
  '2000 01 01',
  '20000101',
  '老師，我的生日是2000年1月1日',
])
  test('AC8.1.1 BR8.1 ' + date, () =>
    assert.equal(parseBirthday(date), '2000-01-01'),
  );
test('AC8.1.2 AC8.1.3 AC4.2.3 BR8.1 valid leap, invalid date, ambiguous and recovery', () => {
  assert.equal(parseBirthday('2000-02-29'), '2000-02-29');
  assert.equal(parseBirthday('0001-01-01'), '0001-01-01');
  for (const date of [
    '2001-02-29',
    '2000-02-30',
    '',
    '0000-01-01',
    '2000-13-01',
    '2000-01-01 2000-01-02',
    '1200001010',
  ])
    assert.throws(() => parseBirthday(date), { code: 'INVALID_BIRTHDAY' });
  assert.equal(parseBirthday('2000-01-01'), '2000-01-01');
  assert.equal(parseBirthday('水晶的星座主題', false), null);
});
for (const [date, n] of [
  ['2000-01-01', 4],
  ['2000-01-08', 2],
  ['2000-09-29', 4],
  ['1999-11-12', 6],
])
  test('AC8.2.1 AC8.2.2 BR8.2 ' + date, () => assert.equal(lifePath(date), n));
test('AC8.2.3 invalid birthday never calculates', () =>
  assert.throws(() => lifePath('2001-02-29')));
test('AC9.1.1 AC9.1.2 AC9.1.3 BR9.1 BR9.2 all cards distinct and every selection matches', () => {
  const selected = recommend((n) => n - 1);
  assert.equal(selected.length, 3);
  assert.equal(new Set(selected.map((c) => c.crystalId)).size, 3);
  for (const card of crystals) {
    const result = selectCrystal(card.crystalId, [card.crystalId]);
    assert.equal(result.name, card.name);
    assert.equal(result.introduction, card.summary);
    assert.match(result.imageUrl, /^https:/);
  }
  assert.throws(() => selectCrystal('bad', []), { code: 'UNKNOWN_CRYSTAL' });
  assert.throws(() => selectCrystal('1', ['2', '3', '4']));
});
test('AC6.2.1 AC6.2.2 BR6.2 six original guide aliases retain usable text', () => {
  for (const key of [
    '使用指南',
    '使用說明',
    '閱讀指南',
    '認識水晶',
    '淨化方法',
    '功效與佩戴',
  ])
    assert.ok(guide(key).length > 100);
  assert.match(guide('使用指南'), /Echo/);
  assert.match(guide('使用指南'), /日期/);
  assert.throws(() => guide('unknown'));
});
