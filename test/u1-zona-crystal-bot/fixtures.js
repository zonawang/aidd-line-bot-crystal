import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
export const temporaryDirectory = () =>
  mkdtemp(path.join(os.tmpdir(), 'zona-crystal-test-'));
export function deferred() {
  let resolve, reject;
  const promise = new Promise((a, b) => {
    resolve = a;
    reject = b;
  });
  return { promise, resolve, reject };
}
export const validImage = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl1sAAAAASUVORK5CYII=',
  'base64',
);
