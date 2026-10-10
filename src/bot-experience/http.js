import express from 'express';
import { realpath } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { validateAction } from './validation.js';
import { SafeError, newDeadline } from './deadline.js';
import { safeLog } from './logger.js';
export function httpApp({ config, experience, webhook, log = safeLog }) {
  const app = express();
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy':
        "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' " +
        (config.imageOrigins || ['https://images.unsplash.com']).join(' ') +
        "; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
    });
    next();
  });
  app.get('/health', (_req, res) => res.json({ ok: true }));
  if (webhook)
    app.post(
      '/webhook',
      express.raw({ type: 'application/json', limit: '8mb' }),
      (req, res, next) => Promise.resolve(webhook(req, res)).catch(next),
    );
  app.use(
    '/api/demo',
    (req, res, next) => {
      if (config.appMode === 'line')
        return res.status(404).json({ error: { code: 'NOT_FOUND' } });
      const host = req.hostname;
      if (!['localhost', '127.0.0.1', '[::1]', '::1'].includes(host))
        return next(new SafeError('INVALID_INPUT', 400));
      if (
        req.get('origin') &&
        req.get('origin') !== req.protocol + '://' + req.get('host')
      )
        return next(new SafeError('INVALID_INPUT', 400));
      if (req.method === 'POST' && !req.is('application/json'))
        return next(new SafeError('INVALID_INPUT', 415));
      next();
    },
    express.json({ limit: '8mb' }),
  );
  app.get('/api/demo/state', (req, res, next) => {
    if (
      Object.keys(req.query).some((k) => k !== 'user') ||
      !['A', 'B'].includes(req.query.user)
    )
      return next(new SafeError('INVALID_INPUT', 400));
    experience
      .state({ id: req.query.user }, newDeadline())
      .then((r) => res.json(r), next);
  });
  app.post('/api/demo/interactions', async (req, res, next) => {
    const start = performance.now();
    try {
      const action = validateAction(req.body);
      const r = await experience.interact(action, newDeadline());
      log({
        requestId: r.requestId,
        action: action.action,
        elapsedMs: performance.now() - start,
        memoryRead: r.memoryStatus.read,
        memoryWrite: r.memoryStatus.write,
      });
      res.json(r);
    } catch (e) {
      next(e);
    }
  });
  const allowed = new Set([
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/ui.js',
    ...[
      '雅典娜.png',
      '維納斯.png',
      '莫伊來.png',
      'richmenu_resized.jpg',
      '五宮格_resized.jpg',
    ].map((n) => '/assets/' + n),
  ]);
  app.get('*', async (req, res, next) => {
    try {
      const decoded = decodeURIComponent(req.path);
      if (!allowed.has(decoded)) return res.sendStatus(404);
      const root = await realpath(config.publicDir),
        file = await realpath(
          path.join(root, decoded === '/' ? 'index.html' : decoded.slice(1)),
        );
      if (!file.startsWith(root + path.sep)) return res.sendStatus(404);
      res.sendFile(file);
    } catch (error) {
      if (error.code === 'ENOENT') return res.sendStatus(404);
      next(error);
    }
  });
  app.use((error, _req, res, _next) => {
    const safeCodes = new Set([
      'INVALID_INPUT',
      'INVALID_BIRTHDAY',
      'UNKNOWN_CRYSTAL',
      'UNSUPPORTED_IMAGE',
      'PAYLOAD_TOO_LARGE',
      'INVALID_SIGNATURE',
      'MEMORY_READ_FAILED',
      'CONFIG_UNAVAILABLE',
      'EXTERNAL_FAILED',
      'TIMEOUT',
    ]);
    const code = safeCodes.has(error.code)
      ? error.code
      : error.type === 'entity.too.large'
        ? 'PAYLOAD_TOO_LARGE'
        : error instanceof SyntaxError
          ? 'INVALID_INPUT'
          : 'EXTERNAL_FAILED';
    const status =
      error instanceof SafeError
        ? error.status
        : code === 'PAYLOAD_TOO_LARGE'
          ? 413
          : code === 'INVALID_INPUT'
            ? 400
            : 502;
    const requestId = randomUUID();
    log({ requestId, action: 'failed', errorCode: code });
    res.status(status).json({
      contractVersion: '1.0.0',
      requestId,
      error: {
        code,
        message:
          code === 'INVALID_BIRTHDAY'
            ? '請提供單一有效生日，例如2000-01-01'
            : code === 'CONFIG_UNAVAILABLE'
              ? '真實模式設定不足；可使用本機教學範例'
              : code === 'TIMEOUT'
                ? '等待逾時，請再試一次'
                : code === 'UNSUPPORTED_IMAGE' || code === 'PAYLOAD_TOO_LARGE'
                  ? '請修正大小或格式後重傳，也可以改用文字'
                  : code === 'UNKNOWN_CRYSTAL'
                    ? '請重新取得三卡並選擇其中一張'
                    : '操作未完成，請修正輸入或重試',
        retryable: status >= 500,
      },
    });
  });
  return app;
}
