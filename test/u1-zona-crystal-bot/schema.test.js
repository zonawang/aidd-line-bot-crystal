import test from 'node:test';
import assert from 'node:assert/strict';
import {
  identity,
  initialState,
  projectState,
  digest,
} from '../../src/conversation-memory/schema.js';
test('AC3.1.1 NFR1.6 BR3.1 necessary aggregate excludes image and secrets', () => {
  const a = identity('demo', 'A');
  const state = initialState(a.userKey);
  state.secret = 'fake-secret';
  state.imageBytes = Buffer.from('image');
  const clean = projectState(state, a.userKey);
  assert.equal(clean.mode, 'consult');
  assert.equal(clean.secret, undefined);
  assert.equal(clean.imageBytes, undefined);
  assert.equal(digest(a.userKey).length, 64);
});
test('AC3.2.3 NFR1.2 BR3.2 identity namespaces and invalid client identities', () => {
  const a = identity('demo', 'A'),
    b = identity('demo', 'B'),
    line = identity('line', 'A');
  assert.notEqual(a.userKey, b.userKey);
  assert.notEqual(a.userKey, line.userKey);
  assert.throws(() => identity('demo', '../A'));
  assert.throws(() => projectState(initialState(a.userKey), b.userKey));
});
test('NFR2.5 BR3.3 reject malformed state and foreign turns', () => {
  const { userKey } = identity('demo', 'A');
  const state = initialState(userKey);
  assert.throws(() => projectState({ ...state, mode: 'unknown' }, userKey));
  assert.throws(() =>
    projectState({ ...state, turns: [{ userKey: 'B' }] }, userKey),
  );
  assert.throws(() =>
    projectState({ ...state, recommendationIds: ['one'] }, userKey),
  );
  assert.throws(() =>
    projectState({ ...state, birthday: '2001-02-29' }, userKey),
  );
  assert.throws(() =>
    projectState({ ...state, recommendationIds: ['1', '2', '8'] }, userKey),
  );
  assert.throws(() =>
    projectState(
      {
        ...state,
        turns: [
          {
            turnId: 't',
            userKey,
            senderRole: 'COSMOS',
            evidenceLabels: [],
            inputText: { secret: 'value' },
            replyText: 'x',
          },
        ],
      },
      userKey,
    ),
  );
});
