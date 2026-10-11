import assert from 'node:assert/strict';

const base = process.argv[2];
assert.ok(base && new URL(base).protocol === 'https:', 'Provide the HTTPS URL');
let checks = 0;
const verify = (value, label) => {
  assert.ok(value, label);
  checks++;
  console.log('PASS ' + label);
};
const first = await fetch(base + '/api/demo/state?user=A');
verify(first.status === 200, 'public API state');
const cookie = first.headers.get('set-cookie')?.split(';')[0];
verify(!!cookie, 'private browser session issued');
verify(
  /HttpOnly/.test(first.headers.get('set-cookie')) &&
    /Secure/.test(first.headers.get('set-cookie')),
  'secure session cookie',
);
const interact = async (action, payload = {}, user = 'A') => {
  const response = await fetch(base + '/api/demo/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: base,
      Cookie: cookie,
    },
    body: JSON.stringify({ user, action, payload }),
  });
  assert.equal(response.status, 200, action + ' HTTP status');
  return response.json();
};

const page = await fetch(base + '/');
verify(
  page.status === 200 && (await page.text()).includes('Zona Crystal'),
  'website HTML',
);
verify((await fetch(base + '/health')).status === 200, 'health');
for (const asset of [
  '/app.js',
  '/ui.js',
  '/styles.css',
  '/assets/richmenu_resized.jpg',
  '/assets/五宮格_resized.jpg',
  '/assets/雅典娜.png',
])
  verify((await fetch(base + asset)).status === 200, 'asset ' + asset);

const birthday = await interact('birthday', { dateText: '2000-01-01' });
verify(birthday.result.lifePath === 4, 'birthday → life path 4');
verify(
  new Set(birthday.result.cards.map((card) => card.crystalId)).size === 3,
  'three distinct cards',
);
verify(birthday.memoryStatus.write === 'saved', 'Firestore write confirmed');
const selected = await interact('select-crystal', {
  crystalId: birthday.result.cards[0].crystalId,
});
verify(
  selected.result.followUps.length === 3,
  'card introduction and followups',
);
const consulted = await interact('text', {
  text: '我想提升學習專注力，有什麼水晶建議？',
});
verify(consulted.result.sender.roleKey === 'ATHENA', 'role example');
verify(
  consulted.result.evidenceLabels.includes('教學範例回覆'),
  'example reply label',
);
await interact('follow-up', { text: '請介紹紫水晶的教學情境' });
verify(true, 'followup interaction');
const image = await interact('image', {
  mimeType: 'image/png',
  base64: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]).toString('base64'),
});
verify(
  image.result.evidenceLabels.some((label) => label.includes('圖片辨識範例')),
  'image example label',
);
await interact('set-mode', { mode: 'echo' });
const echo = await interact('text', { text: 'PUBLIC_DEMO_SMOKE' });
verify(echo.result.text === 'PUBLIC_DEMO_SMOKE', 'Echo');
await interact('set-mode', { mode: 'consult' });
verify(
  (await interact('set-menu', { menu: 'five' })).state.menu === 'five',
  'five-grid menu',
);
verify(
  (await interact('set-menu', { menu: 'main' })).state.menu === 'main',
  'main menu',
);
verify(!!(await interact('guide', { guide: '使用指南' })).result.text, 'guide');
verify(
  (await interact('recall')).result.text.includes('2000-01-01'),
  'recall persisted content',
);
const restored = await fetch(base + '/api/demo/state?user=A', {
  headers: { Cookie: cookie },
});
verify(
  (await restored.json()).state.birthday === '2000-01-01',
  'new request restores saved state',
);
const other = await fetch(base + '/api/demo/state?user=A');
verify(
  (await other.json()).state.birthday === null,
  'second browser isolation',
);
const b = await fetch(base + '/api/demo/state?user=B', {
  headers: { Cookie: cookie },
});
verify((await b.json()).state.birthday === null, 'A/B isolation');
const hostile = await fetch(base + '/api/demo/state?user=A', {
  headers: { Origin: 'https://evil.invalid', Cookie: cookie },
});
verify(hostile.status === 400, 'foreign origin rejected');
for (const privatePath of [
  '/.env',
  '/src/config.js',
  '/.zona-data/a.json',
  '/package.json',
])
  verify(
    (await fetch(base + privatePath)).status === 404,
    'private path blocked: ' + privatePath,
  );
verify(
  (await fetch(base + '/webhook', { method: 'POST' })).status === 404,
  'LINE webhook disabled',
);
console.log(`Public demo smoke: ${checks} checks passed`);
