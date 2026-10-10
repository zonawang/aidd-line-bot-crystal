import { digest } from './schema.js';
function validTime(value) {
  const n =
    typeof value === 'number'
      ? value < 1e12
        ? value * 1000
        : value
      : (value?.toMillis?.() ?? Date.parse(value));
  return Number.isFinite(n) ? new Date(n).toISOString() : null;
}
export function legacyProjection(documents, who) {
  const turns = [],
    seen = new Set();
  for (const doc of [...documents].sort((a, b) => a.id.localeCompare(b.id))) {
    const d = typeof doc.data === 'function' ? doc.data() : doc.data;
    if (d.appName !== 'CrystalAstrology' || d.userId !== who.id)
      throw Error('INVALID_LEGACY_IDENTITY');
    if (d.sessionId?.startsWith('zona_v1_')) continue;
    for (const [index, event] of (Array.isArray(d.events)
      ? d.events
      : []
    ).entries()) {
      const text = (event.content?.parts || [])
        .filter((p) => typeof p.text === 'string')
        .map((p) => p.text)
        .join('\n');
      if (!text) continue;
      const sourceRef = doc.id + ':' + index;
      if (seen.has(sourceRef)) continue;
      seen.add(sourceRef);
      turns.push({
        turnId: 'legacy_' + digest(who.userKey + ':' + sourceRef),
        userKey: who.userKey,
        inputText: event.author === 'user' ? text : null,
        replyText: event.author === 'user' ? null : text,
        imageDescription: null,
        senderRole: 'COSMOS',
        evidenceLabels: [],
        createdAt: validTime(event.timestamp) || validTime(d.lastUpdateTime),
        sourceRef,
      });
    }
  }
  return turns.sort(
    (a, b) =>
      (a.createdAt || '').localeCompare(b.createdAt || '') ||
      a.sourceRef.localeCompare(b.sourceRef, undefined, { numeric: true }),
  );
}
