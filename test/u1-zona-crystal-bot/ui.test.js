import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { renderResult, controller } from '../../public/ui.js';
import { deferred } from './fixtures.js';
import { bindPage, roleExamples } from '../../public/app.js';
import { createApplication } from '../../src/server.js';
import { configFrom } from '../../src/config.js';
import { temporaryDirectory } from './fixtures.js';
import { validImage } from './fixtures.js';
const page = async () => new JSDOM(await readFile('public/index.html', 'utf8'));
test('AC10.1.2 NFR4.1 BR10.1 native labels, focus, alt and width rules (DOM/source evidence only)', async () => {
  const dom = await page(),
    d = dom.window.document;
  for (const input of d.querySelectorAll('input,textarea,select'))
    assert.ok(d.querySelector('label[for="' + input.id + '"]')?.textContent);
  for (const button of d.querySelectorAll('button'))
    assert.ok(button.textContent.trim());
  assert.equal(d.documentElement.lang, 'zh-Hant');
  assert.ok(d.querySelector('#status[aria-live="polite"]'));
  assert.ok(d.querySelector('#menu-image').alt);
  const css = await readFile('public/styles.css', 'utf8');
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 650px\)/);
  assert.match(css, /grid-template-columns: 1fr/);
  d.querySelector('#birthday').focus();
  assert.equal(d.activeElement.id, 'birthday');
  d.querySelector('#identity').focus();
  assert.equal(d.activeElement.id, 'identity');
});
async function testServer() {
  const app = createApplication(
    configFrom({ MEMORY_DIR: await temporaryDirectory() }),
  );
  const server = app.listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  return {
    url: 'http://127.0.0.1:' + server.address().port,
    close: () => new Promise((r) => server.close(r)),
  };
}
test('AC9.1.2 AC9.1.3 AC4.1.2 NFR1.4 safe render and each card/question actual click', async () => {
  const dom = await page(),
    d = dom.window.document,
    calls = [];
  const cards = [1, 2, 3].map((n) => ({
    crystalId: String(n),
    name: '卡' + n,
    summary: '介紹' + n,
    imageUrl: 'https://images.unsplash.com/image',
  }));
  const questions = ['第一個完整問題', '第二個完整問題', '第三個完整問題'];
  renderResult(
    d,
    {
      result: {
        text: '<script>bad()</script>',
        cards,
        followUps: questions,
        evidenceLabels: ['教學範例回覆'],
      },
      memoryStatus: { message: '已保存' },
    },
    (action, payload) => calls.push({ action, payload }),
  );
  assert.equal(d.querySelector('#reply script'), null);
  assert.match(d.querySelector('#reply').textContent, /<script>/);
  for (const button of d.querySelectorAll('#cards button,#questions button'))
    button.click();
  assert.deepEqual(
    calls.slice(0, 3).map((c) => c.payload.crystalId),
    ['1', '2', '3'],
  );
  assert.deepEqual(
    calls.slice(3).map((c) => c.payload.text),
    questions,
  );
  d.querySelector('#cards img').dispatchEvent(new dom.window.Event('error'));
  assert.equal(d.querySelectorAll('#cards button').length, 3);
});
test('AC1.2.1 AC1.2.2 AC1.2.3 AC2.1.3 AC2.2.2 AC4.2.2 AC5.1.1 AC6.1.1 AC6.2.1 AC6.2.2 AC6.2.3 AC10.1.1 all actual DOM controls through HTTP', async () => {
  const server = await testServer();
  try {
    const dom = await page(),
      d = dom.window.document;
    let pending;
    const ui = controller({
      document: d,
      fetcher: (url, options) => fetch(server.url + url, options),
    });
    bindPage(d, {
      ...ui,
      request: (a, p) => {
        pending = ui.request(a, p);
        return pending;
      },
    });
    await ui.selectUser('A');
    for (const [role] of roleExamples) {
      d.querySelector('[data-testid="role-' + role + '"]').click();
      await pending;
      assert.equal(d.querySelectorAll('#questions button').length, 3);
      assert.match(d.querySelector('#reply').textContent, /教學範例回覆/);
      assert.match(
        d.querySelector('#reply').textContent,
        role === 'ATHENA'
          ? /智慧守護神 雅典娜/
          : role === 'VENUS'
            ? /金星守護神 維納斯/
            : role === 'FORTUNE'
              ? /命運之輪 莫伊萊/
              : /星曜守護導師 艾蓮/,
      );
    }
    d.querySelector('[data-testid="echo-enter"]').click();
    await pending;
    assert.match(d.querySelector('#mode').textContent, /回聲模式/);
    d.querySelector('#message').value = ' 你好水晶 ';
    d.querySelector('#text-form').dispatchEvent(
      new dom.window.Event('submit', { cancelable: true }),
    );
    await pending;
    assert.equal(d.querySelector('.reply-text').textContent, ' 你好水晶 ');
    await ui.request('image', {
      mimeType: 'image/png',
      base64: validImage.toString('base64'),
    });
    assert.match(d.querySelector('#reply').textContent, /只接受文字/);
    d.querySelector('[data-testid="echo-exit"]').click();
    await pending;
    assert.match(d.querySelector('#mode').textContent, /諮詢模式/);
    for (const guide of [
      '使用指南',
      '使用說明',
      '閱讀指南',
      '認識水晶',
      '淨化方法',
      '功效與佩戴',
    ]) {
      d.querySelector('[data-testid="guide-' + guide + '"]').click();
      await pending;
      assert.ok(d.querySelector('.reply-text').textContent.length > 100);
    }
    d.querySelector('#menu-image').dispatchEvent(new dom.window.Event('error'));
    assert.equal(d.querySelector('#menu-image').hidden, true);
    for (const target of ['five', 'main']) {
      d.querySelector('[data-testid="menu-' + target + '"]').click();
      await pending;
      assert.match(
        d.querySelector('#menu-label').textContent,
        target === 'five' ? /五宮格/ : /主選單/,
      );
      assert.match(d.querySelector('#reply').textContent, /LINE 操作模擬/);
    }
    assert.equal(
      d.querySelector('[data-testid="menu-share"]').href,
      'https://github.com/zonawang/zona-ai-learning-lab',
    );
    await ui.request('birthday', { dateText: '2000-01-01' });
    assert.ok(d.querySelector('[data-testid="shortcut-life-path"]'));
    await ui.request('life-path', {});
    assert.match(d.querySelector('#reply').textContent, /生命靈數是 4/);
    assert.equal(d.querySelectorAll('#questions button').length, 3);
    const file = new dom.window.File([validImage], 'test.png', {
      type: 'image/png',
    });
    Object.defineProperty(d.querySelector('#image'), 'files', {
      value: [file],
      configurable: true,
    });
    d.querySelector('#image-form').dispatchEvent(
      new dom.window.Event('submit', { cancelable: true }),
    );
    await new Promise((r) => setTimeout(r, 20));
    await pending;
    assert.match(
      d.querySelector('#reply').textContent,
      /圖片辨識範例，非真實辨識/,
    );
    d.querySelector('[data-testid="memory-recall"]').click();
    await pending;
    assert.match(d.querySelector('#reply').textContent, /先前必要文字/);
  } finally {
    await server.close();
  }
});
test('AC7.1.1 AC7.1.2 NFR2.2 finite waiting even when fetch ignores abort, then recover without retry', async () => {
  const dom = await page(),
    d = dom.window.document;
  let calls = 0;
  const ui = controller({
    document: d,
    timeoutMs: 15,
    fetcher: () => {
      calls++;
      return calls === 1
        ? new Promise(() => {})
        : Promise.resolve({
            ok: true,
            json: async () => ({
              state: { mode: 'consult', menu: 'main' },
              memoryStatus: { message: '已保存' },
              result: { text: '恢復', evidenceLabels: [] },
            }),
          });
    },
  });
  const pending = ui.request('text', { text: 'test' });
  assert.match(d.querySelector('#status').textContent, /正在整理回覆/);
  assert.equal(d.querySelector('#identity').disabled, false);
  await pending;
  assert.match(d.querySelector('#status').textContent, /逾時/);
  assert.equal(d.querySelector('button').disabled, false);
  assert.equal(calls, 1);
  await ui.request('text', { text: 'again' });
  assert.match(d.querySelector('#reply').textContent, /恢復/);
  assert.equal(calls, 2);
});
test('AC3.2.1 NFR2.9 switching B ignores late A result', async () => {
  const dom = await page(),
    pending = deferred();
  const ui = controller({
    document: dom.window.document,
    fetcher: async (url) =>
      url.includes('state')
        ? {
            ok: true,
            json: async () => ({
              state: { mode: 'consult' },
              memoryStatus: { read: 'empty' },
            }),
          }
        : pending.promise,
  });
  const a = ui.request('birthday', { dateText: '2000-01-01' });
  await ui.selectUser('B');
  pending.resolve({
    ok: true,
    json: async () => ({
      state: { mode: 'consult' },
      memoryStatus: { message: 'A' },
      result: { text: 'A secret', evidenceLabels: [] },
    }),
  });
  await a;
  assert.doesNotMatch(dom.window.document.body.textContent, /A secret/);
  assert.match(dom.window.document.querySelector('#mode').textContent, /B/);
});
