import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, stat } from 'node:fs/promises';
import {
  identity,
  initialState,
} from '../../src/conversation-memory/schema.js';
import { localStore } from '../../src/conversation-memory/local-store.js';
import { conversationMemory } from '../../src/conversation-memory/memory.js';
import { newDeadline } from '../../src/bot-experience/deadline.js';
import { temporaryDirectory, deferred } from './fixtures.js';
import { firestoreStore } from '../../src/conversation-memory/firestore-store.js';
import { legacyProjection } from '../../src/conversation-memory/legacy-projection.js';
const A = identity('demo', 'A').userKey,
  B = identity('demo', 'B').userKey;
test('AC3.1.1 AC3.1.2 AC3.2.1 NFR1.6 NFR2.5 BR3.1 real private file reread and isolation', async () => {
  const dir = await temporaryDirectory(),
    store = localStore(dir),
    m = conversationMemory(store);
  assert.equal((await m.read(A, newDeadline())).status, 'empty');
  const state = { ...initialState(A), birthday: '2000-01-01' };
  assert.equal(await m.save(A, state, 'empty', newDeadline()), 'saved');
  const fresh = conversationMemory(localStore(dir));
  assert.equal(
    (await fresh.read(A, newDeadline())).snapshot.birthday,
    '2000-01-01',
  );
  assert.equal((await fresh.read(B, newDeadline())).status, 'empty');
  assert.equal((await stat(store.filename(A))).mode & 0o777, 0o600);
  assert.equal((await stat(dir)).mode & 0o777, 0o700);
});
test('AC3.1.1 AC3.2.3 NFR1.7 BR3.4 Firestore legacy read only, new session and stable text projection', async () => {
  const person = identity('line', 'fake-line-A');
  const queries = [],
    writes = [];
  const legacy = {
    id: 'original',
    data: () => ({
      appName: 'CrystalAstrology',
      userId: person.id,
      sessionId: 'session_' + person.id,
      events: [
        {
          author: 'user',
          timestamp: 123,
          content: {
            parts: [
              { text: '收藏紫水晶' },
              { inlineData: { data: 'not persisted' } },
            ],
          },
        },
        { author: 'model', content: { parts: [{ text: '舊答案' }] } },
      ],
    }),
  };
  const c = {
    doc: (id) => ({
      get: async () => ({ exists: false }),
      set: async (payload) => writes.push({ id, payload }),
    }),
    where: (field, op, value) => {
      queries.push({ field, op, value });
      return {
        where: (f, o, v) => {
          queries.push({ field: f, op: o, value: v });
          return { get: async () => ({ docs: [legacy] }) };
        },
      };
    },
  };
  const store = firestoreStore(
    {},
    {
      collection: (name) => {
        assert.equal(name, 'crystal_memories');
        return c;
      },
    },
  );
  const first = await store.read(person.userKey);
  assert.equal(first.status, 'loaded');
  assert.equal(first.snapshot.turns.length, 2);
  assert.equal(
    first.snapshot.turns.find((t) => t.inputText).inputText,
    '收藏紫水晶',
  );
  assert.equal(first.snapshot.birthday, null);
  assert.deepEqual(
    (await store.read(person.userKey)).snapshot.turns,
    first.snapshot.turns,
  );
  await store.save(person.userKey, first.snapshot);
  assert.match(writes[0].id, /^zona_v1_/);
  assert.notEqual(writes[0].id, 'session_' + person.id);
  assert.equal(writes[0].payload.events.length, 0);
  assert.equal(writes[0].payload.snapshot.turns.length, 0);
  assert.deepEqual(
    queries.slice(0, 2).map((q) => q.value),
    ['CrystalAstrology', person.id],
  );
  assert.throws(() =>
    legacyProjection(
      [{ id: 'bad', data: { appName: 'CrystalAstrology', userId: 'other' } }],
      person,
    ),
  );
});
test('AC3.1.3 NFR2.5 BR3.3 malformed original remains intact and failed reads do not save', async () => {
  const dir = await temporaryDirectory(),
    store = localStore(dir),
    m = conversationMemory(store);
  await writeFile(store.filename(A), 'broken', { mode: 0o600 });
  assert.equal((await m.read(A, newDeadline())).status, 'read-failed');
  assert.equal(
    await m.save(A, initialState(A), 'read-failed', newDeadline()),
    'not-attempted',
  );
  assert.equal(await readFile(store.filename(A), 'utf8'), 'broken');
  const bad = conversationMemory({
    read: async () => {
      throw Error('read');
    },
    save: async () => {
      throw Error('write');
    },
  });
  assert.equal((await bad.read(A, newDeadline())).status, 'read-failed');
  assert.equal(
    await bad.save(A, initialState(A), 'empty', newDeadline()),
    'write-failed',
  );
});
for (const settle of ['resolve', 'reject', 'never'])
  test('NFR2.6 BR3.4 unknown write latch ' + settle, async () => {
    const d = deferred();
    let writes = 0,
      reads = 0;
    const m = conversationMemory({
      read: async () => {
        reads++;
        return { status: 'empty', snapshot: null };
      },
      save: () => {
        writes++;
        return d.promise;
      },
    });
    assert.equal(
      await m.save(A, initialState(A), 'empty', newDeadline(15)),
      'outcome-unknown',
    );
    assert.equal((await m.read(A, newDeadline())).status, 'read-failed');
    assert.equal(reads, 0);
    assert.equal(
      await m.save(A, initialState(A), 'empty', newDeadline()),
      'not-attempted',
    );
    assert.equal(writes, 1);
    assert.equal((await m.read(B, newDeadline())).status, 'empty');
    if (settle !== 'never') {
      d[settle](settle === 'reject' ? Error('late') : undefined);
      await new Promise((r) => setImmediate(r));
      assert.equal((await m.read(A, newDeadline())).status, 'empty');
    }
  });
test('NFR5.2 NFR2.4 BR3.2 five requests serialize same identity and B is independent', async () => {
  const dir = await temporaryDirectory(),
    m = conversationMemory(localStore(dir)),
    gate = deferred();
  let bDone = false;
  const first = m.transact(A, newDeadline(), async ({ snapshot, save }) => {
    await gate.promise;
    return save({ ...snapshot, birthday: '2000-01-01' });
  });
  const later = [1, 2, 3].map(() =>
    m.transact(A, newDeadline(), async ({ snapshot, save }) => save(snapshot)),
  );
  const b = m.transact(B, newDeadline(), async ({ snapshot, save }) => {
    const result = await save(snapshot);
    bDone = true;
    return result;
  });
  await b;
  assert.equal(bDone, true);
  gate.resolve();
  assert.deepEqual(await Promise.all([first, ...later]), [
    'saved',
    'saved',
    'saved',
    'saved',
  ]);
  assert.equal((await m.read(A, newDeadline())).snapshot.revision, 4);
});
test('NFR2.4 NFR2.1 expired queued operation has zero side effects', async () => {
  const gate = deferred();
  let calls = 0;
  const m = conversationMemory({
    read: async () => ({ status: 'empty' }),
    save: async () => {},
  });
  const first = m.transact(A, newDeadline(), async () => gate.promise);
  const expired = m.transact(A, newDeadline(10), async () => {
    calls++;
  });
  await assert.rejects(expired, { code: 'TIMEOUT' });
  gate.resolve();
  await first;
  await new Promise((r) => setImmediate(r));
  assert.equal(calls, 0);
});
