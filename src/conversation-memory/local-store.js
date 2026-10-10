import {
  mkdir,
  readFile,
  writeFile,
  rename,
  chmod,
  unlink,
} from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { digest, projectState } from './schema.js';
export function localStore(directory) {
  const filename = (userKey) => path.join(directory, digest(userKey) + '.json');
  return {
    async read(userKey) {
      try {
        return {
          status: 'loaded',
          snapshot: projectState(
            JSON.parse(await readFile(filename(userKey), 'utf8')),
            userKey,
          ),
        };
      } catch (error) {
        return {
          status: error.code === 'ENOENT' ? 'empty' : 'read-failed',
          snapshot: null,
        };
      }
    },
    async save(userKey, snapshot) {
      const clean = projectState(snapshot, userKey);
      await mkdir(directory, { recursive: true, mode: 0o700 });
      await chmod(directory, 0o700);
      const target = filename(userKey),
        temporary = target + '.' + randomUUID() + '.tmp';
      try {
        await writeFile(temporary, JSON.stringify(clean), {
          mode: 0o600,
          flag: 'wx',
        });
        await rename(temporary, target);
        await chmod(target, 0o600);
      } catch (error) {
        await unlink(temporary).catch(() => {});
        throw error;
      }
    },
    filename,
  };
}
