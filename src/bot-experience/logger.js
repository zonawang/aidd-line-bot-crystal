const values = {
  action: new Set([
    'start',
    'failed',
    'text',
    'follow-up',
    'image',
    'birthday',
    'select-crystal',
    'guide',
    'set-mode',
    'set-menu',
    'recall',
    'recommend',
    'life-path',
  ]),
  errorCode: new Set([
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
  ]),
  memoryRead: new Set(['loaded', 'empty', 'read-failed']),
  memoryWrite: new Set([
    'saved',
    'not-attempted',
    'write-failed',
    'outcome-unknown',
  ]),
  externalStatus: new Set(['applied', 'failed', 'outcome-unknown']),
};
export function safeLog(
  entry,
  write = (line) => process.stdout.write(line + '\n'),
) {
  const result = {};
  if (
    typeof entry.requestId === 'string' &&
    /^[a-f0-9-]{36}$/.test(entry.requestId)
  )
    result.requestId = entry.requestId;
  if (typeof entry.elapsedMs === 'number' && Number.isFinite(entry.elapsedMs))
    result.elapsedMs = Math.round(entry.elapsedMs);
  for (const [key, allowed] of Object.entries(values))
    if (allowed.has(entry[key])) result[key] = entry[key];
  write(JSON.stringify(result));
}
