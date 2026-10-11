import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import net from 'node:net';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { temporaryDirectory } from './fixtures.js';
import { safeLog } from '../../src/bot-experience/logger.js';
const sentinel = 'FAKE_ENV_SECRET_NEVER_PUBLIC';
async function port() {
  const server = net.createServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  const n = server.address().port;
  await new Promise((r) => server.close(r));
  return n;
}
async function launch(memoryDir) {
  const number = await port(),
    url = 'http://127.0.0.1:' + number;
  let log = '';
  const child = spawn(process.execPath, ['src/server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT: String(number),
      HOST: '127.0.0.1',
      APP_MODE: 'demo',
      BOT_MODE: 'example',
      MEMORY_ADAPTER: 'local',
      MEMORY_DIR: memoryDir,
      LINE_CHANNEL_SECRET: sentinel,
      GEMINI_API_KEY: sentinel,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', (b) => {
    log += b;
  });
  child.stderr.on('data', (b) => {
    log += b;
  });
  const stop = async () => {
    if (child.exitCode !== null) return;
    const closed = once(child, 'exit');
    child.kill('SIGTERM');
    await closed;
  };
  try {
    let ready = false;
    for (let attempt = 0; attempt < 200; attempt++) {
      if (child.exitCode !== null) throw Error('SERVER_EXIT');
      try {
        const r = await fetch(url + '/health');
        if (r.ok) {
          assert.deepEqual(await r.json(), { ok: true });
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 10));
    }
    assert.equal(ready, true);
  } catch (error) {
    await stop();
    throw error;
  }
  return { url, stop, log: () => log };
}
const request = (server, user, action, payload = {}) =>
  fetch(server.url + '/api/demo/interactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, action, payload }),
  });
test('AC3.1.2 AC3.2.1 AC3.2.2 AC10.2.1 NFR2.3 NFR2.5 NFR5.1 actual spawn restart and ten warm actions <=2s', async () => {
  const dir = await temporaryDirectory();
  let server = await launch(dir);
  try {
    assert.equal(
      (await request(server, 'A', 'birthday', { dateText: '2000-01-01' }))
        .status,
      200,
    );
    await request(server, 'A', 'text', { text: '我收藏紫水晶' });
    assert.doesNotMatch(
      (await (await request(server, 'B', 'recall')).json()).result.text,
      /紫水晶/,
    );
    assert.match(
      (await (await request(server, 'A', 'recall')).json()).result.text,
      /紫水晶/,
    );
    const timings = [];
    for (let i = 0; i < 10; i++) {
      const start = performance.now();
      const response = await request(server, 'A', 'guide', {
        guide: '閱讀指南',
      });
      assert.equal(response.status, 200);
      await response.json();
      const elapsed = performance.now() - start;
      timings.push(Math.round(elapsed));
      assert.ok(elapsed <= 2000, 'warm ' + i + ' ' + elapsed);
    }
    console.log('warm10ms=' + JSON.stringify(timings));
    await server.stop();
    assert.doesNotMatch(server.log(), new RegExp(sentinel + '|我收藏紫水晶'));
    server = await launch(dir);
    assert.match(
      (await (await request(server, 'A', 'recall')).json()).result.text,
      /紫水晶/,
    );
    assert.doesNotMatch(
      (await (await request(server, 'B', 'recall')).json()).result.text,
      /紫水晶/,
    );
    const invalid = await request(server, 'A', 'birthday', {
      dateText: '2001-02-29',
    });
    assert.equal(invalid.status, 400);
    assert.equal(
      (await request(server, 'A', 'text', { text: '恢復' })).status,
      200,
    );
    assert.match(server.log(), /"action":"start"/);
    assert.match(server.log(), /"action":"failed"/);
    assert.match(server.log(), /"action":"text"/);
    assert.doesNotMatch(
      server.log(),
      new RegExp(sentinel + '|我收藏紫水晶|恢復'),
    );
  } finally {
    await server.stop();
  }
});
test('AC10.2.4 NFR1.4 NFR5.4 BR10.4 safe logging protects free-form allowed field values as well as unknown keys', () => {
  const lines = [];
  for (const action of ['start', 'text', 'failed'])
    safeLog(
      {
        action,
        errorCode: action === 'failed' ? 'TIMEOUT' : sentinel,
        requestId: sentinel,
        memoryRead: 'loaded',
        memoryWrite: 'saved',
        token: sentinel,
        text: 'private full conversation',
      },
      (line) => lines.push(line),
    );
  safeLog(
    {
      action: sentinel,
      errorCode: sentinel,
      memoryRead: sentinel,
      externalStatus: sentinel,
    },
    (line) => lines.push(line),
  );
  assert.doesNotMatch(
    lines.join(''),
    new RegExp(sentinel + '|private full conversation'),
  );
  assert.match(lines.join(''), /start/);
  assert.match(lines.join(''), /TIMEOUT/);
  assert.equal(lines[3], '{}');
});
test('AC10.2.2 AC10.2.3 NFR3.1 NFR5.6 same exact CI command and evidence separates external untested', async () => {
  const ci = await readFile('.github/workflows/zona-crystal-check.yml', 'utf8'),
    readme = await readFile('README.md', 'utf8'),
    evidence = await readFile('docs/zona-crystal-evidence.md', 'utf8'),
    demo = await readFile('docs/zona-crystal-demo.md', 'utf8');
  assert.match(ci, /npm run check:u1/);
  assert.match(readme, /npm run check:u1/);
  assert.match(ci, /npm audit --audit-level=moderate/);
  assert.match(evidence, /未實測/);
  assert.match(evidence, /隔離替身/);
  assert.match(readme, /单程序单 writer|單程序單 writer/);
  assert.match(readme, /不自動刪資料/);
  for (const input of [
    '我想提升學習專注力，有什麼水晶建議？',
    '我想了解愛情與人際關係的水晶搭配',
    '最近財運起伏，有什麼水晶情境建議？',
    '請介紹水晶基礎鑑定',
  ])
    assert.ok(demo.includes(input));
  const { testFiles } =
    await import('../../scripts/u1-zona-crystal-bot/test-files.mjs');
  assert.ok(testFiles.includes('test/u1-zona-crystal-bot/public-demo.test.js'));
  for (const file of testFiles)
    assert.ok((await readFile(file, 'utf8')).includes('test('));
});
test('patched transitive uuid v4 compatibility and all real SDK packages load', async () => {
  const require = createRequire(import.meta.url),
    gaxiosRequire = createRequire(require.resolve('gaxios'));
  assert.match(gaxiosRequire('uuid').v4(), /^[0-9a-f-]{36}$/);
  for (const name of [
    '@google/genai',
    '@google-cloud/vertexai',
    '@google-cloud/firestore',
    '@line/bot-sdk',
  ])
    assert.ok(await import(name));
});
