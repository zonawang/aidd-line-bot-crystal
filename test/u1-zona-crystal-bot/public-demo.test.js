import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createApplication } from '../../src/server.js';
import { configFrom } from '../../src/config.js';
import { temporaryDirectory } from './fixtures.js';
import { firestoreStore } from '../../src/conversation-memory/firestore-store.js';
import {
  identity,
  initialState,
} from '../../src/conversation-memory/schema.js';

const origin = 'https://zona-crystal-demo.example';
const host = new URL(origin).host;

test('public demo preserves journey and isolates each browser plus A/B across server restart', async () => {
  const config = configFrom({
    APP_MODE: 'public-demo',
    PUBLIC_DEMO_ORIGIN: origin,
    MEMORY_DIR: await temporaryDirectory(),
  });
  async function serve() {
    const server = createApplication(config).listen(0, '127.0.0.1');
    await new Promise((resolve) => server.once('listening', resolve));
    return {
      url: 'http://127.0.0.1:' + server.address().port,
      close: () => new Promise((resolve) => server.close(resolve)),
    };
  }
  let server = await serve();
  const call = (route, options = {}) =>
    new Promise((resolve, reject) => {
      const request = http.request(
        server.url + route,
        {
          method: options.method || 'GET',
          headers: { Host: host, Origin: origin, ...options.headers },
        },
        (response) => {
          const chunks = [];
          response.on('data', (chunk) => chunks.push(chunk));
          response.on('end', () =>
            resolve(
              new Response(Buffer.concat(chunks), {
                status: response.statusCode,
                headers: response.headers,
              }),
            ),
          );
          response.on('error', reject);
        },
      );
      request.on('error', reject);
      request.end(options.body);
    });
  try {
    const first = await call('/api/demo/state?user=A');
    assert.equal(first.status, 200);
    const cookieHeader = first.headers.get('set-cookie');
    assert.match(cookieHeader, /HttpOnly/);
    assert.match(cookieHeader, /Secure/);
    assert.match(cookieHeader, /SameSite=Lax/);
    assert.equal(first.headers.get('cache-control'), 'private, no-store');
    const cookie = cookieHeader.split(';')[0];
    const post = (action, payload = {}) =>
      call('/api/demo/interactions', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: 'A', action, payload }),
      });
    const birthday = await post('birthday', { dateText: '2000-01-01' });
    assert.equal(birthday.status, 200);
    const body = await birthday.json();
    assert.equal(body.state.user, 'A');
    assert.equal(body.result.lifePath, 4);
    assert.equal(
      new Set(body.result.cards.map((card) => card.crystalId)).size,
      3,
    );
    assert.equal(body.memoryStatus.write, 'saved');
    const card = await post('select-crystal', {
      crystalId: body.result.cards[0].crystalId,
    });
    assert.equal(card.status, 200);
    assert.equal((await card.json()).result.followUps.length, 3);
    const menu = await post('set-menu', { menu: 'five' });
    assert.deepEqual((await menu.json()).result.evidenceLabels, [
      'LINE 操作模擬',
    ]);
    const otherBrowser = await call('/api/demo/state?user=A');
    assert.notEqual(
      otherBrowser.headers.get('set-cookie').split(';')[0],
      cookie,
    );
    assert.equal((await otherBrowser.json()).state.birthday, null);
    const b = await call('/api/demo/state?user=B', {
      headers: { Cookie: cookie },
    });
    assert.equal((await b.json()).state.birthday, null);
    await server.close();
    server = await serve();
    const restored = await call('/api/demo/state?user=A', {
      headers: { Cookie: cookie },
    });
    const restoredBody = await restored.json();
    assert.equal(restoredBody.state.birthday, '2000-01-01');
    assert.equal(restoredBody.state.menu, 'five');
    for (const headers of [
      { Host: 'evil.example' },
      { Origin: 'https://evil.example' },
      { 'Sec-Fetch-Site': 'cross-site' },
    ])
      assert.equal(
        (await call('/api/demo/state?user=A', { headers })).status,
        400,
      );
    assert.equal((await call('/webhook', { method: 'POST' })).status, 404);
    for (const privatePath of ['/.env', '/src/server.js', '/.zona-data/a.json'])
      assert.equal((await call(privatePath)).status, 404);
  } finally {
    await server.close();
  }
});

test('public demo configuration prevents live AI and default Firestore database use', () => {
  const env = { APP_MODE: 'public-demo', PUBLIC_DEMO_ORIGIN: origin };
  for (const override of [
    { BOT_MODE: 'real' },
    { PUBLIC_DEMO_ORIGIN: 'http://unsafe.example' },
    { MEMORY_ADAPTER: 'firestore', FIRESTORE_DATABASE_ID: '(default)' },
    { MEMORY_ADAPTER: 'firestore', FIRESTORE_DATABASE_ID: 'zona-crystal-demo' },
  ])
    assert.throws(() => configFrom({ ...env, ...override }));
  assert.equal(
    configFrom({
      ...env,
      MEMORY_ADAPTER: 'firestore',
      FIRESTORE_DATABASE_ID: 'zona-crystal-demo',
      FIRESTORE_COLLECTION: 'zona_crystal_public_demo',
    }).appMode,
    'public-demo',
  );
});

test('public Firestore uses separate collection and never reads legacy LINE records', async () => {
  const collections = [];
  const documents = new Map();
  const store = firestoreStore(
    { FIRESTORE_COLLECTION: 'zona_crystal_public_demo' },
    {
      collection: (name) => {
        collections.push(name);
        return {
          doc: (id) => ({
            get: async () => ({
              exists: documents.has(id),
              data: () => documents.get(id),
            }),
            set: async (value) => documents.set(id, value),
          }),
          where: () => assert.fail('public demo must not query legacy data'),
        };
      },
    },
  );
  const a = identity('public-demo', 'a'.repeat(64) + ':A').userKey;
  const other = identity('public-demo', 'b'.repeat(64) + ':A').userKey;
  await store.save(a, { ...initialState(a), birthday: '2000-01-01' });
  assert.equal((await store.read(a)).snapshot.birthday, '2000-01-01');
  assert.equal((await store.read(other)).status, 'empty');
  assert.ok(collections.every((name) => name === 'zona_crystal_public_demo'));
});
