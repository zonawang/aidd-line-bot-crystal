import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { Readable } from 'node:stream';
import {
  lineAdapter,
  webhookHandler,
  eventAction,
  menuAliases,
} from '../../src/bot-experience/line-adapter.js';
import { lineMessages } from '../../src/bot-experience/line-messages.js';
import { newDeadline } from '../../src/bot-experience/deadline.js';
import { deferred, validImage as png } from './fixtures.js';
import { temporaryDirectory } from './fixtures.js';
import { experience } from '../../src/bot-experience/experience.js';
import { conversationMemory } from '../../src/conversation-memory/memory.js';
import { localStore } from '../../src/conversation-memory/local-store.js';
import { identity } from '../../src/conversation-memory/schema.js';
const env = {
  LINE_CHANNEL_SECRET: 'fake-secret',
  LINE_CHANNEL_ACCESS_TOKEN: 'fake-token',
  LINE_MAIN_MENU_ID: 'main-id',
  LINE_FIVE_MENU_ID: 'five-id',
};
const event = (key = 'one', text = 'Echo') => ({
  webhookEventId: key,
  replyToken: 'fake-reply',
  source: { type: 'user', userId: 'fake-person' },
  type: 'message',
  message: { type: 'text', text },
});
const run = async (handler, events, signature) => {
  const raw = Buffer.from(JSON.stringify({ events }));
  const sig =
    signature ??
    createHmac('sha256', env.LINE_CHANNEL_SECRET).update(raw).digest('base64');
  let status = 200,
    data;
  await handler(
    { body: raw, get: () => sig },
    {
      status: (n) => {
        status = n;
        return {
          json: (v) => {
            data = v;
          },
        };
      },
    },
  );
  return { status, data };
};
test('AC1.1.1 AC1.1.2 AC1.1.3 NFR1.1 BR1.1 signature before all side effects, missing config and empty events', async () => {
  let calls = 0;
  const h = webhookHandler({
    env,
    experience: {
      interact: () => {
        calls++;
      },
    },
    line: {},
  });
  for (const sig of [
    '',
    'bad',
    createHmac('sha256', 'other').update('body').digest('base64'),
  ])
    await assert.rejects(run(h, [event()], sig), {
      code: 'INVALID_SIGNATURE',
      status: 401,
    });
  assert.equal(calls, 0);
  assert.equal((await run(h, [])).status, 200);
  await assert.rejects(
    run(webhookHandler({ env: {}, experience: {}, line: {} }), []),
    { code: 'CONFIG_UNAVAILABLE' },
  );
  const raw = Buffer.from('{');
  await assert.rejects(
    h(
      {
        body: raw,
        get: () =>
          createHmac('sha256', env.LINE_CHANNEL_SECRET)
            .update(raw)
            .digest('base64'),
      },
      {},
    ),
    { code: 'INVALID_INPUT' },
  );
});
test('AC3.2.2 NFR1.2 trusted source, date/card/switch and unsupported events', () => {
  const e = event();
  e.user = 'B';
  assert.equal(eventAction(e).id, 'fake-person');
  assert.equal(
    eventAction({ ...e, source: { type: 'group', groupId: 'other' } }),
    null,
  );
  assert.equal(eventAction({ ...e, type: 'follow' }), null);
  const post = (data) => ({
    ...e,
    type: 'postback',
    postback: { data, params: { date: '2000-01-01' } },
  });
  assert.equal(
    eventAction(post('action=select_birthday')).payload.dateText,
    '2000-01-01',
  );
  assert.equal(
    eventAction(post('action=select_crystal&crystalId=7')).payload.crystalId,
    '7',
  );
  assert.equal(eventAction(post('action=select_crystal&crystalId=8')), null);
  assert.equal(eventAction(post('switch-to-five-grids')).payload.menu, 'five');
  assert.equal(eventAction(post('switch-to-main-menu')).payload.menu, 'main');
});
test('AC2.2.1 AC2.2.2 AC2.2.3 NFR1.5 bounded streamed image actual bytes and malformed/oversize', async () => {
  const l = lineAdapter(env, {
    api: {},
    blob: { getMessageContent: async () => Readable.from([png]) },
  });
  assert.deepEqual((await l.image('image', newDeadline())).imageBytes, png);
  await assert.rejects(
    lineAdapter(env, {
      api: {},
      blob: {
        getMessageContent: async () => Readable.from([Buffer.from('bad')]),
      },
    }).image('i', newDeadline()),
    { code: 'UNSUPPORTED_IMAGE' },
  );
  await assert.rejects(
    lineAdapter(env, {
      api: {},
      blob: {
        getMessageContent: async () =>
          Readable.from([Buffer.alloc(5 * 1024 * 1024 + 1)]),
      },
    }).image('i', newDeadline()),
    { code: 'PAYLOAD_TOO_LARGE' },
  );
});
test('AC4.1.1 AC4.1.3 AC4.2.1 AC4.2.2 AC4.2.3 AC5.1.1 AC5.1.2 AC5.1.3 Flex current IDs, full questions, original role and date/life path actions', () => {
  const qs = ['第一個完整問題', '第二個完整問題', '第三個完整問題'];
  const messages = lineMessages(
    {
      state: { birthday: '2000-01-01' },
      memoryStatus: { message: '已保存' },
      result: {
        text: '答案',
        sender: { name: '智慧守護神 雅典娜', iconUrl: '/assets/雅典娜.png' },
        followUps: qs,
        cards: [
          {
            crystalId: '2',
            name: '粉晶',
            summary: '介紹',
            imageUrl: 'https://images.unsplash.com/a',
          },
        ],
      },
    },
    { PUBLIC_BASE_URL: 'https://example.invalid' },
  );
  assert.equal(messages[0].sender.name, '智慧守護神 雅典娜');
  assert.match(messages[0].sender.iconUrl, /^https:/);
  assert.deepEqual(
    messages[0].quickReply.items.slice(0, 3).map((i) => i.action.text),
    qs,
  );
  assert.equal(
    messages[0].quickReply.items[3].action.data,
    'action=select_birthday',
  );
  assert.equal(
    messages[0].quickReply.items[4].action.text,
    '老師，請幫我解析我的生命靈數是 4',
  );
  assert.equal(
    messages[1].contents.contents[0].footer.contents[0].action.data,
    'action=select_crystal&crystalId=2',
  );
});
test('AC6.1.1 AC6.1.2 AC6.1.3 AC7.1.1 AC7.1.2 AC7.1.3 NFR1.7 NFR2.7 NFR5.3 BR6.1 menu original alias/IDs and failed loading nonblocking', async () => {
  const calls = [];
  const l = lineAdapter(env, {
    api: {
      linkRichMenuIdToUser: async (...args) => calls.push(args),
      showLoadingAnimation: async () => {
        throw Error('down');
      },
    },
  });
  assert.deepEqual(menuAliases, {
    main: 'alias_main_menu',
    five: 'alias_five_grids',
  });
  assert.equal(await l.switchMenu('u', 'main', newDeadline()), 'applied');
  assert.equal(await l.switchMenu('u', 'five', newDeadline()), 'applied');
  assert.deepEqual(calls, [
    ['u', 'main-id'],
    ['u', 'five-id'],
  ]);
  assert.equal(
    await lineAdapter({}, { api: {} }).switchMenu('u', 'main', newDeadline()),
    'failed',
  );
  await l.loading('u', newDeadline());
  await new Promise((r) => setImmediate(r));
});
test('NFR2.8 duplicate delivered/in-flight/outcome-unknown has no replay; late rejection observed', async () => {
  let interactions = 0,
    replies = 0;
  const gate = deferred();
  const h = webhookHandler({
    env,
    deadlineMs: 20,
    experience: {
      interact: async () => {
        interactions++;
        return {};
      },
    },
    line: {
      reply: () => {
        replies++;
        return gate.promise;
      },
    },
  });
  const first = run(h, [event()]);
  await new Promise((r) => setImmediate(r));
  assert.equal((await run(h, [event()])).status, 500);
  assert.equal((await first).status, 500);
  assert.equal((await run(h, [event()])).status, 500);
  assert.equal(interactions, 1);
  assert.equal(replies, 1);
  gate.resolve();
  await new Promise((r) => setImmediate(r));
  assert.equal((await run(h, [event()])).status, 200);
  assert.equal(replies, 1);
  const failure = deferred(),
    h2 = webhookHandler({
      env,
      deadlineMs: 10,
      experience: { interact: async () => ({}) },
      line: { reply: () => failure.promise },
    });
  assert.equal((await run(h2, [event('fail')])).status, 500);
  failure.reject(Error('late'));
  await new Promise((r) => setImmediate(r));
  assert.equal((await run(h2, [event('fail')])).status, 500);
});
test('R-01 NFR2.8 known rejected reply redelivery reuses result without repeating actual save/menu', async () => {
  const store = localStore(await temporaryDirectory());
  let saves = 0,
    menus = 0,
    interactions = 0;
  const saved = store.save;
  store.save = async (...args) => {
    saves++;
    return saved(...args);
  };
  const calls = [];
  const line = {
    switchMenu: async () => {
      menus++;
      return 'applied';
    },
    reply: async (token, response) => {
      calls.push({ token, response });
      if (calls.length === 1) throw Error('known rejection');
    },
  };
  const e = experience({ memory: conversationMemory(store), line });
  const handler = webhookHandler({
    env,
    line,
    experience: {
      interact: (...args) => {
        interactions++;
        return e.interact(...args);
      },
    },
  });
  const incoming = {
    ...event('retry-menu'),
    type: 'postback',
    postback: { data: 'switch-to-five-grids' },
  };
  assert.equal((await run(handler, [incoming])).status, 500);
  const before = await store.read(identity('line', 'fake-person').userKey);
  assert.equal(before.snapshot.menu, 'five');
  assert.equal(before.snapshot.revision, 1);
  assert.equal(
    (await run(handler, [{ ...incoming, replyToken: 'new-redelivery-token' }]))
      .status,
    200,
  );
  assert.equal(interactions, 1);
  assert.equal(saves, 1);
  assert.equal(menus, 1);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].token, 'new-redelivery-token');
  assert.strictEqual(calls[1].response, calls[0].response);
  assert.equal(
    (await store.read(identity('line', 'fake-person').userKey)).snapshot
      .revision,
    1,
  );
  assert.equal((await run(handler, [incoming])).status, 200);
  assert.equal(calls.length, 2);
});
test('R-02 AC1.1.2 valid missing event IDs process separately without a fabricated dedup key', async () => {
  const seen = [],
    replies = [];
  const handler = webhookHandler({
    env,
    experience: {
      interact: async (input) => {
        seen.push(input);
        return { person: input.id };
      },
    },
    line: {
      reply: async (token, response) => replies.push({ token, response }),
    },
  });
  const first = event();
  delete first.webhookEventId;
  const second = {
    ...first,
    source: { type: 'user', userId: 'other-person' },
    replyToken: 'other-token',
  };
  assert.equal((await run(handler, [first, second])).status, 200);
  assert.deepEqual(
    seen.map((input) => input.id),
    ['fake-person', 'other-person'],
  );
  assert.deepEqual(
    replies.map((call) => call.response.person),
    ['fake-person', 'other-person'],
  );
  assert.equal((await run(handler, [first])).status, 200);
  assert.equal(seen.length, 3);
  assert.equal(replies.length, 3);
});
test('R-03 NFR5.3 NFR4.2 long LINE body reserves all evidence/storage/external notices within platform limits', () => {
  const labels = [
    '教學範例回覆',
    '圖片辨識範例，非真實辨識',
    '教學替代問題',
    'LINE 操作模擬',
  ];
  for (const withCards of [false, true]) {
    const response = {
      state: { birthday: null },
      memoryStatus: { message: '未能確認保存' },
      result: {
        text: '長'.repeat(30000),
        evidenceLabels: labels,
        menuStatus: 'outcome-unknown',
        externalStatus: 'failed',
        followUps: ['甲', '乙', '丙'],
        ...(withCards
          ? {
              cards: [
                {
                  crystalId: '1',
                  name: '紫水晶',
                  summary: '介紹',
                  imageUrl: 'https://images.unsplash.com/a',
                },
              ],
            }
          : {}),
      },
    };
    const messages = lineMessages(response),
      texts = messages.filter((message) => message.type === 'text'),
      visible = texts.map((message) => message.text).join('\n');
    assert.ok(messages.length <= 5);
    assert.ok(
      texts.every(
        (message) => message.text.length > 0 && message.text.length <= 5000,
      ),
    );
    for (const label of labels) assert.ok(visible.includes(label));
    assert.ok(visible.includes('未能確認保存'));
    assert.ok(visible.includes('選單套用狀態：outcome-unknown'));
    assert.ok(visible.includes('外部操作狀態：failed'));
    assert.ok(visible.includes('回覆正文過長，已截短'));
    assert.ok(visible.length < 30000);
    assert.equal(
      messages.some((message) => message.type === 'flex'),
      withCards,
    );
    assert.deepEqual(
      messages[0].quickReply.items.slice(0, 3).map((item) => item.action.text),
      ['甲', '乙', '丙'],
    );
  }
});
test('NFR2.1 NFR2.8 BR7.1 one batch budget, no new event after deadline and unsupported skipped', async () => {
  let calls = 0;
  const h = webhookHandler({
    env,
    deadlineMs: 10,
    experience: {
      interact: async () => {
        calls++;
        await new Promise((r) => setTimeout(r, 15));
        return {};
      },
    },
    line: {
      reply: async () => {
        throw Error('must not reply');
      },
    },
  });
  assert.equal((await run(h, [event('first'), event('second')])).status, 500);
  assert.equal(calls, 1);
  assert.equal(
    (await run(h, [{ type: 'follow', source: { type: 'user', userId: 'u' } }]))
      .status,
    200,
  );
});
