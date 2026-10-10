import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import http from 'node:http';
import { createHmac } from 'node:crypto';
import { writeFile, mkdir, symlink } from 'node:fs/promises';
import { httpApp } from '../../src/bot-experience/http.js';
import { webhookHandler } from '../../src/bot-experience/line-adapter.js';
import { createApplication } from '../../src/server.js';
import { configFrom } from '../../src/config.js';
import { temporaryDirectory } from './fixtures.js';
export async function testServer(mode = 'demo') {
  const config = configFrom({
    APP_MODE: mode,
    MEMORY_DIR: await temporaryDirectory(),
    PORT: '0',
  });
  config.publicDir = path.resolve('public');
  const server = createApplication(config).listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  return {
    url: 'http://127.0.0.1:' + server.address().port,
    close: () => new Promise((r) => server.close(r)),
  };
}
test('AC1.1.1 AC10.1.3 NFR5.5 real HTTP birthday journey, health and private paths', async () => {
  const s = await testServer();
  try {
    assert.deepEqual(await (await fetch(s.url + '/health')).json(), {
      ok: true,
    });
    const response = await fetch(s.url + '/api/demo/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: 'A',
        action: 'birthday',
        payload: { dateText: '2000-01-01' },
      }),
    });
    assert.equal(response.status, 200);
    const r = await response.json();
    assert.equal(r.result.lifePath, 4);
    assert.equal(r.result.cards.length, 3);
    for (const p of [
      '/.env',
      '/.zona-data/a.json',
      '/src/config.js',
      '/assets/../../.env',
    ])
      assert.equal((await fetch(s.url + p)).status, 404);
  } finally {
    await s.close();
  }
});
test('NFR1.1 NFR1.3 NFR1.4 NFR1.5 real HTTP raw signature/8MiB limit, symlink and safe error', async () => {
  const root = await temporaryDirectory(),
    publicDir = path.join(root, 'public');
  await mkdir(publicDir);
  await writeFile(path.join(root, 'secret'), 'FAKE_PRIVATE_SENTINEL');
  await symlink(path.join(root, 'secret'), path.join(publicDir, 'index.html'));
  const env = {
    LINE_CHANNEL_SECRET: 'fake-secret',
    LINE_CHANNEL_ACCESS_TOKEN: 'fake-token',
  };
  let calls = 0;
  const experience = {
    interact: async () => {
      calls++;
      return {};
    },
    state: async () => {
      const error = Error('FAKE_PRIVATE_SENTINEL');
      error.code = 'FAKE_PRIVATE_SENTINEL';
      throw error;
    },
  };
  const app = httpApp({
      config: { appMode: 'demo', publicDir },
      experience,
      webhook: webhookHandler({
        env,
        experience,
        line: { reply: async () => {} },
      }),
      log: () => {},
    }),
    server = app.listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  const url = 'http://127.0.0.1:' + server.address().port;
  try {
    assert.equal((await fetch(url + '/')).status, 404);
    const raw = JSON.stringify({
      events: [
        {
          webhookEventId: 'http-event',
          replyToken: 'token',
          source: { type: 'user', userId: 'fake-person' },
          type: 'message',
          message: { type: 'text', text: 'hello' },
        },
      ],
    });
    const headers = {
      'Content-Type': 'application/json',
      'x-line-signature': createHmac('sha256', env.LINE_CHANNEL_SECRET)
        .update(raw)
        .digest('base64'),
    };
    assert.equal(
      (
        await fetch(url + '/webhook', {
          method: 'POST',
          headers: { ...headers, 'x-line-signature': 'bad' },
          body: raw,
        })
      ).status,
      401,
    );
    assert.equal(calls, 0);
    assert.equal(
      (
        await fetch(url + '/webhook', {
          method: 'POST',
          headers,
          body: raw + ' ',
        })
      ).status,
      401,
    );
    assert.equal(calls, 0);
    assert.equal(
      (await fetch(url + '/webhook', { method: 'POST', headers, body: raw }))
        .status,
      200,
    );
    assert.equal(calls, 1);
    for (const endpoint of ['/webhook', '/api/demo/interactions'])
      assert.equal(
        (
          await fetch(url + endpoint, {
            method: 'POST',
            headers,
            body: 'x'.repeat(8 * 1024 * 1024 + 1),
          })
        ).status,
        413,
      );
    const failed = await fetch(url + '/api/demo/state?user=A');
    assert.equal(failed.status, 502);
    assert.doesNotMatch(await failed.text(), /FAKE_PRIVATE_SENTINEL/);
  } finally {
    await new Promise((r) => server.close(r));
  }
});
test('AC2.2.3 local image malformed base64/MIME and real configuration shortage recover', async () => {
  const s = await testServer();
  try {
    for (const payload of [
      { mimeType: 'image/png', base64: 'not-base64' },
      { mimeType: 'image/jpeg', base64: 'aGVsbG8=' },
      { mimeType: 'image/gif', base64: 'aGVsbG8=' },
    ])
      assert.equal(
        (
          await fetch(s.url + '/api/demo/interactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: 'A', action: 'image', payload }),
          })
        ).status,
        415,
      );
    assert.equal(
      (
        await fetch(s.url + '/api/demo/interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: 'A',
            action: 'text',
            payload: { text: '恢復' },
          }),
        })
      ).status,
      200,
    );
  } finally {
    await s.close();
  }
});
test('NFR1.2 NFR1.3 NFR1.5 HTTP injection, host/origin and format rejected', async () => {
  const s = await testServer();
  try {
    for (const body of [
      { user: 'A', action: 'recall', userKey: 'B' },
      { user: 'A', action: 'text', payload: { text: 'x', mode: 'real' } },
      { user: 'C', action: 'recall' },
      { user: 'A', action: 'birthday', payload: {} },
      { user: 'A', action: 'text', payload: { text: 'x'.repeat(4001) } },
    ]) {
      const r = await fetch(s.url + '/api/demo/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      assert.ok([400, 413].includes(r.status));
    }
    assert.equal(
      (
        await fetch(s.url + '/api/demo/state?user=A', {
          headers: { Origin: 'https://evil.invalid' },
        })
      ).status,
      400,
    );
    const hostile = await new Promise((resolve, reject) => {
      http
        .get(
          s.url + '/api/demo/state?user=A',
          { headers: { Host: 'evil.invalid' } },
          (response) => {
            response.resume();
            resolve(response.statusCode);
          },
        )
        .on('error', reject);
    });
    assert.equal(hostile, 400);
  } finally {
    await s.close();
  }
  const publicServer = await testServer('line');
  try {
    assert.equal(
      (await fetch(publicServer.url + '/api/demo/state?user=A')).status,
      404,
    );
  } finally {
    await publicServer.close();
  }
});
