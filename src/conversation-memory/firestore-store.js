import { digest, initialState, projectState, identity } from './schema.js';
import { legacyProjection } from './legacy-projection.js';
import { newDeadline, remaining } from '../bot-experience/deadline.js';
export function firestoreStore(env = {}, injected) {
  let client = injected;
  async function collection() {
    if (!client) {
      const { Firestore } = await import('@google-cloud/firestore');
      client = new Firestore({
        projectId: env.GCP_PROJECT,
        ...(env.FIRESTORE_DATABASE_ID
          ? { databaseId: env.FIRESTORE_DATABASE_ID }
          : {}),
      });
    }
    return client.collection(env.FIRESTORE_COLLECTION || 'crystal_memories');
  }
  function who(userKey) {
    const prefix = 'CrystalAstrology:';
    if (!userKey.startsWith(prefix)) throw Error('INVALID_IDENTITY');
    const [source, ...rest] = userKey.slice(prefix.length).split(':');
    return identity(source, rest.join(':'));
  }
  const newId = (userKey) => 'zona_v1_' + digest(userKey);
  return {
    newId,
    async read(userKey, deadline = newDeadline()) {
      try {
        const person = who(userKey);
        const c = await collection();
        remaining(deadline);
        const fresh = await c.doc(newId(userKey)).get();
        let snapshot = initialState(userKey);
        if (fresh.exists) {
          const d = fresh.data();
          if (
            d.appName !== 'CrystalAstrology' ||
            d.userId !== person.id ||
            d.namespace !== person.source ||
            d.sessionId !== newId(userKey)
          )
            throw Error('INVALID_NEW_IDENTITY');
          snapshot = projectState(d.snapshot, userKey);
        }
        // Demo namespace never queries a real LINE user's legacy documents.
        remaining(deadline);
        const legacy =
          person.source === 'line'
            ? await c
                .where('appName', '==', 'CrystalAstrology')
                .where('userId', '==', person.id)
                .get()
            : { docs: [] };
        snapshot.turns = [
          ...legacyProjection(legacy.docs, person),
          ...snapshot.turns,
        ];
        return {
          status: fresh.exists || snapshot.turns.length ? 'loaded' : 'empty',
          snapshot,
        };
      } catch {
        return { status: 'read-failed', snapshot: null };
      }
    },
    async save(userKey, input) {
      const person = who(userKey),
        snapshot = projectState(input, userKey);
      snapshot.turns = snapshot.turns.filter((t) => !t.sourceRef);
      const events = snapshot.turns.flatMap((t) => [
        ...(t.inputText
          ? [
              {
                id: t.turnId + ':user',
                author: 'user',
                timestamp: t.createdAt,
                content: { parts: [{ text: t.inputText }] },
              },
            ]
          : []),
        ...(t.replyText || t.imageDescription
          ? [
              {
                id: t.turnId + ':reply',
                author: t.senderRole,
                timestamp: t.createdAt,
                content: {
                  parts: [{ text: t.replyText || t.imageDescription }],
                },
              },
            ]
          : []),
      ]);
      const c = await collection();
      await c.doc(newId(userKey)).set({
        appName: 'CrystalAstrology',
        userId: person.id,
        namespace: person.source,
        sessionId: newId(userKey),
        lastUpdateTime: new Date().toISOString(),
        schemaVersion: 1,
        snapshot,
        events,
      });
    },
  };
}
