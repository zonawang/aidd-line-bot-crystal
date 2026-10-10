import { initialState, projectState } from './schema.js';
import { bounded, remaining } from '../bot-experience/deadline.js';
export function conversationMemory(store) {
  const queues = new Map(),
    pendingWrites = new Map();
  async function read(userKey, deadline) {
    if (pendingWrites.has(userKey))
      return { status: 'read-failed', snapshot: null };
    try {
      remaining(deadline);
      return await bounded(store.read(userKey, deadline), deadline);
    } catch {
      return { status: 'read-failed', snapshot: null };
    }
  }
  async function save(userKey, snapshot, priorRead, deadline) {
    if (priorRead === 'read-failed' || pendingWrites.has(userKey))
      return 'not-attempted';
    try {
      remaining(deadline);
    } catch {
      return 'not-attempted';
    }
    const write = Promise.resolve().then(() =>
      store.save(
        userKey,
        projectState({ ...snapshot, revision: snapshot.revision + 1 }, userKey),
      ),
    );
    pendingWrites.set(userKey, write);
    const clear = () => {
      if (pendingWrites.get(userKey) === write) pendingWrites.delete(userKey);
    };
    write.then(clear, clear);
    try {
      await bounded(write, deadline);
      return 'saved';
    } catch (error) {
      return error.code === 'TIMEOUT' ? 'outcome-unknown' : 'write-failed';
    }
  }
  async function transact(userKey, deadline, operation) {
    const predecessor = queues.get(userKey) || Promise.resolve();
    const current = predecessor
      .catch(() => {})
      .then(async () => {
        remaining(deadline);
        const loaded = await read(userKey, deadline);
        return operation({
          read: loaded.status,
          snapshot: loaded.snapshot || initialState(userKey),
          save: (snapshot) => save(userKey, snapshot, loaded.status, deadline),
        });
      });
    const tail = current.catch(() => {});
    queues.set(userKey, tail);
    tail.finally(() => {
      if (queues.get(userKey) === tail) queues.delete(userKey);
    });
    return bounded(current, deadline);
  }
  return { transact, read, save, pendingWrites };
}
