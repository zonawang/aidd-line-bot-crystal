import test from 'node:test';
import assert from 'node:assert/strict';
import { consultation } from '../../src/consultation/consultation.js';
import { modelAdapter } from '../../src/consultation/model-adapter.js';
import {
  initialState,
  identity,
} from '../../src/conversation-memory/schema.js';
import { newDeadline } from '../../src/bot-experience/deadline.js';
import { validImage } from './fixtures.js';
const context = initialState(identity('demo', 'A').userKey);
const samples = [
  ['ATHENA', '我想提升學習專注力，有什麼水晶建議？', '智慧守護神 雅典娜'],
  ['VENUS', '我想了解愛情與人際關係的水晶搭配', '金星守護神 維納斯'],
  ['FORTUNE', '最近財運起伏，有什麼水晶情境建議？', '命運之輪 莫伊萊'],
  ['COSMOS', '請介紹水晶基礎鑑定', '星曜守護導師 艾蓮'],
];
for (const [role, text, name] of samples)
  test('AC5.1.1 AC2.1.3 BR5.1 original example ' + role, async () => {
    const r = await consultation({})({
      input: { kind: 'text', text },
      context,
      deadline: newDeadline(),
    });
    assert.equal(r.sender.name, name);
    assert.ok(r.sender.iconUrl);
    assert.equal(r.sender.roleKey, role);
    assert.equal(r.followUps.length, 3);
    assert.ok(r.evidenceLabels.includes('教學範例回覆'));
  });
test('AC2.1.1 AC2.2.1 AC5.1.2 C4 Gemini actual text and full bytes/MIME via SDK mock', async () => {
  const seen = [];
  let calls = 0;
  const model = modelAdapter(
    {},
    {
      geminiClient: {
        models: {
          generateContent: async (request) => {
            seen.push(request);
            calls++;
            return {
              text:
                calls % 2
                  ? '[DEITY: VENUS]\n真實路徑替身答案'
                  : '["完整問題1","完整問題2","完整問題3"]',
            };
          },
        },
      },
    },
  );
  const c = consultation({ mode: 'real', model });
  const r = await c({
    input: { kind: 'image', mimeType: 'image/png', imageBytes: validImage },
    context,
    deadline: newDeadline(),
  });
  assert.equal(r.sender.roleKey, 'VENUS');
  assert.equal(r.text, '真實路徑替身答案');
  assert.deepEqual(r.followUps, ['完整問題1', '完整問題2', '完整問題3']);
  assert.deepEqual(
    Buffer.from(seen[0].contents[0].parts[1].inlineData.data, 'base64'),
    validImage,
  );
  assert.equal(seen[0].contents[0].parts[1].inlineData.mimeType, 'image/png');
  await c({
    input: { kind: 'text', text: '星座問題' },
    context,
    deadline: newDeadline(),
  });
  assert.match(seen[2].contents[0].parts[0].text, /星座問題/);
});
test('AC5.1.2 Vertex SDK path carries full image and user context', async () => {
  const seen = [];
  let calls = 0;
  const model = modelAdapter(
    {},
    {
      vertexClient: {
        generateContent: async (r) => {
          seen.push(r);
          return {
            response: {
              candidates: [
                {
                  content: {
                    parts: [
                      {
                        text:
                          ++calls === 1
                            ? '[DEITY: ATHENA]學習答案'
                            : '["甲","乙","丙"]',
                      },
                    ],
                  },
                },
              ],
            },
          };
        },
      },
    },
  );
  const r = await consultation({ mode: 'real', model })({
    input: { kind: 'image', mimeType: 'image/png', imageBytes: validImage },
    context,
    deadline: newDeadline(),
  });
  assert.equal(r.sender.roleKey, 'ATHENA');
  assert.deepEqual(
    Buffer.from(seen[0].contents[0].parts[1].inlineData.data, 'base64'),
    validImage,
  );
});
test('AC2.1.2 AC2.2.3 NFR2.7 real failure never becomes example; next request works', async () => {
  await assert.rejects(
    consultation({ mode: 'real', model: modelAdapter({}) })({
      input: { kind: 'text', text: '問題' },
      context,
      deadline: newDeadline(),
    }),
    { code: 'CONFIG_UNAVAILABLE' },
  );
  await assert.rejects(
    consultation({
      mode: 'real',
      model: {
        generate: async () => {
          throw Error('provider secret');
        },
      },
    })({
      input: { kind: 'text', text: '問題' },
      context,
      deadline: newDeadline(),
    }),
  );
  const r = await consultation({})({
    input: { kind: 'text', text: '水晶' },
    context,
    deadline: newDeadline(),
  });
  assert.equal(r.kind, 'consultation');
});
test('AC4.1.3 AC5.1.3 NFR4.2 unknown role and missing followups use marked related three', async () => {
  let count = 0;
  const c = consultation({
    mode: 'real',
    model: {
      generate: async () =>
        ++count === 1 ? '[DEITY: BAD]水晶答案' : 'not JSON',
    },
  });
  const r = await c({
    input: { kind: 'text', text: '紫水晶' },
    context,
    deadline: newDeadline(),
  });
  assert.equal(r.sender.roleKey, 'COSMOS');
  assert.equal(new Set(r.followUps).size, 3);
  assert.ok(r.followUps.every((q) => q.includes('紫水晶')));
  assert.ok(r.evidenceLabels.includes('教學替代問題'));
  assert.doesNotMatch(r.text, /DEITY/);
});
test('AC2.2.2 NFR4.2 BR2.2 example image always labeled', async () => {
  const r = await consultation({})({
    input: { kind: 'image', imageBytes: validImage, mimeType: 'image/png' },
    context,
    deadline: newDeadline(),
  });
  assert.ok(r.imageDescription);
  assert.deepEqual(r.evidenceLabels, ['圖片辨識範例，非真實辨識']);
});
