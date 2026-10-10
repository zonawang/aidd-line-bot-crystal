import test from 'node:test';
import assert from 'node:assert/strict';
import { experience } from '../../src/bot-experience/experience.js';
import { conversationMemory } from '../../src/conversation-memory/memory.js';
import { localStore } from '../../src/conversation-memory/local-store.js';
import { temporaryDirectory } from './fixtures.js';
import { consultation } from '../../src/consultation/consultation.js';
import { modelAdapter } from '../../src/consultation/model-adapter.js';
import { newDeadline } from '../../src/bot-experience/deadline.js';
import { deferred } from './fixtures.js';
const app = async () =>
  experience({
    memory: conversationMemory(localStore(await temporaryDirectory())),
    consultation: consultation({}),
  });
test('AC8.2.1 AC9.1.1 AC9.1.2 AC4.1.1 BR9.2 birthday then each card has matching introduction', async () => {
  const e = await app();
  const birthday = await e.interact({
    id: 'A',
    action: 'birthday',
    payload: { dateText: '2000-01-01' },
  });
  assert.equal(birthday.result.lifePath, 4);
  assert.equal(birthday.memoryStatus.write, 'saved');
  assert.equal(birthday.result.cards.length, 3);
  for (const card of birthday.result.cards) {
    const selected = await e.interact({
      id: 'A',
      action: 'select-crystal',
      payload: { crystalId: card.crystalId },
    });
    assert.equal(selected.result.crystal.name, card.name);
    assert.equal(selected.result.introduction, card.introduction);
    assert.equal(selected.result.followUps.length, 3);
  }
});
test('NFR2.1 NFR2.7 late model result cannot save and next real request recovers', async () => {
  const gate = deferred();
  let calls = 0,
    writes = 0;
  const model = modelAdapter(
    {},
    {
      geminiClient: {
        models: {
          generateContent: (request) => {
            calls++;
            assert.ok(request.config.abortSignal);
            return calls === 1
              ? gate.promise
              : Promise.resolve({
                  text:
                    calls === 2 ? '[DEITY: ATHENA]恢復' : '["甲","乙","丙"]',
                });
          },
        },
      },
    },
  );
  const e = experience({
    memory: conversationMemory({
      read: async () => ({ status: 'empty' }),
      save: async () => {
        writes++;
      },
    }),
    consultation: consultation({ mode: 'real', model }),
  });
  await assert.rejects(
    e.interact(
      { id: 'A', action: 'text', payload: { text: '問題' } },
      newDeadline(10),
    ),
    { code: 'TIMEOUT' },
  );
  assert.equal(writes, 0);
  gate.resolve({ text: '晚到答案' });
  await new Promise((r) => setImmediate(r));
  assert.equal(writes, 0);
  const normal = await e.interact({
    id: 'A',
    action: 'text',
    payload: { text: '再試' },
  });
  assert.equal(normal.result.text, '恢復');
  assert.equal(normal.memoryStatus.write, 'saved');
  assert.equal(writes, 1);
});
test('AC1.2.1 AC1.2.2 AC1.2.3 BR1.2 Echo raw text, image prompt, all exits and next consultation', async () => {
  const e = await app();
  for (const exit of ['退出 Echo', '離開 Echo', '結束 Echo']) {
    await e.interact({ id: 'A', action: 'text', payload: { text: 'Echo' } });
    assert.equal(
      (
        await e.interact({
          id: 'A',
          action: 'text',
          payload: { text: '  你好水晶  ' },
        })
      ).result.text,
      '  你好水晶  ',
    );
    assert.match(
      (await e.interact({ id: 'A', action: 'image', payload: {} })).result.text,
      /只接受文字/,
    );
    assert.equal(
      (await e.interact({ id: 'A', action: 'text', payload: { text: exit } }))
        .state.mode,
      'consult',
    );
    assert.equal(
      (await e.interact({ id: 'A', action: 'text', payload: { text: '水晶' } }))
        .result.kind,
      'consultation',
    );
  }
});
test('AC4.1.2 AC4.2.2 BR4.2 life-path original full question and every follow-up executes', async () => {
  const e = await app();
  const b = await e.interact({
    id: 'A',
    action: 'birthday',
    payload: { dateText: '2000-01-01' },
  });
  const cardsBefore = b.state.recommendationIds;
  const r = await e.interact({ id: 'A', action: 'life-path' });
  assert.match(r.result.text, /老師，請幫我解析我的生命靈數是 4/);
  assert.deepEqual(r.state.recommendationIds, cardsBefore);
  assert.equal(r.result.quickActions.length, 2);
  for (const text of r.result.followUps)
    assert.match(
      (await e.interact({ id: 'A', action: 'follow-up', payload: { text } }))
        .result.text,
      new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
});
test('AC6.1.1 AC6.2.1 AC6.2.2 AC3.1.1 BR6.1 menus/guides and recall', async () => {
  const e = await app();
  assert.equal(
    (
      await e.interact({
        id: 'A',
        action: 'set-menu',
        payload: { menu: 'five' },
      })
    ).state.menu,
    'five',
  );
  assert.equal(
    (
      await e.interact({
        id: 'A',
        action: 'set-menu',
        payload: { menu: 'main' },
      })
    ).state.menu,
    'main',
  );
  for (const guide of [
    '使用指南',
    '使用說明',
    '閱讀指南',
    '認識水晶',
    '淨化方法',
    '功效與佩戴',
  ])
    assert.equal(
      (await e.interact({ id: 'A', action: 'text', payload: { text: guide } }))
        .result.kind,
      'guide',
    );
  assert.equal(
    (await e.interact({ id: 'B', action: 'recall' })).result.text,
    '沒有先前內容',
  );
  await e.interact({
    id: 'A',
    action: 'text',
    payload: { text: '我收藏紫水晶' },
  });
  assert.match(
    (await e.interact({ id: 'A', action: 'recall' })).result.text,
    /收藏紫水晶/,
  );
  assert.doesNotMatch(
    (await e.interact({ id: 'B', action: 'recall' })).result.text,
    /紫水晶/,
  );
});
test('AC8.1.3 AC9.1.3 invalid date preserves last valid cards and recovery works', async () => {
  const e = await app();
  await assert.rejects(
    e.interact({
      id: 'A',
      action: 'birthday',
      payload: { dateText: '2001-02-29' },
    }),
    { code: 'INVALID_BIRTHDAY' },
  );
  const valid = await e.interact({
    id: 'A',
    action: 'birthday',
    payload: { dateText: '2000-01-01' },
  });
  await assert.rejects(
    e.interact({
      id: 'A',
      action: 'select-crystal',
      payload: { crystalId: 'bad' },
    }),
    { code: 'UNKNOWN_CRYSTAL' },
  );
  assert.deepEqual(
    (await e.state({ id: 'A' })).state.recommendationIds,
    valid.state.recommendationIds,
  );
});
test('AC3.1.3 NFR5.3 BR3.3 save failure keeps readable answer and read failure cannot guess cards', async () => {
  const e = experience({
    memory: conversationMemory({
      read: async () => ({ status: 'empty' }),
      save: async () => {
        throw Error('write');
      },
    }),
  });
  const result = await e.interact({
    id: 'A',
    action: 'birthday',
    payload: { dateText: '2000-01-01' },
  });
  assert.equal(result.memoryStatus.write, 'write-failed');
  assert.equal(result.result.lifePath, 4);
  const bad = experience({
    memory: conversationMemory({
      read: async () => ({ status: 'read-failed' }),
      save: async () => {
        assert.fail('unexpected write');
      },
    }),
  });
  await assert.rejects(
    bad.interact({
      id: 'A',
      action: 'select-crystal',
      payload: { crystalId: '1' },
    }),
    { code: 'MEMORY_READ_FAILED' },
  );
});
