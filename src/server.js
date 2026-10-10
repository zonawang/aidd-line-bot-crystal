import { pathToFileURL } from 'node:url';
import { configFrom } from './config.js';
import { localStore } from './conversation-memory/local-store.js';
import { conversationMemory } from './conversation-memory/memory.js';
import { experience } from './bot-experience/experience.js';
import { httpApp } from './bot-experience/http.js';
import { safeLog } from './bot-experience/logger.js';
import { consultation } from './consultation/consultation.js';
import { modelAdapter } from './consultation/model-adapter.js';
import { firestoreStore } from './conversation-memory/firestore-store.js';
import { lineAdapter, webhookHandler } from './bot-experience/line-adapter.js';
export function createApplication(config = configFrom()) {
  const consult = consultation({
    mode: config.botMode,
    env: config.env,
    model: modelAdapter(config.env),
  });
  const store =
    config.memoryAdapter === 'firestore'
      ? firestoreStore(config.env)
      : localStore(config.memoryDir);
  const line = lineAdapter(config.env);
  const e = experience({
    memory: conversationMemory(store),
    consultation: consult,
    line,
  });
  return httpApp({
    config,
    experience: e,
    webhook: webhookHandler({ env: config.env, experience: e, line }),
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const config = configFrom();
  createApplication(config).listen(config.port, config.host, () =>
    safeLog({ action: 'start' }),
  );
}
