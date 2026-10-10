import { createHash } from 'node:crypto';
import { parseBirthday } from '../crystal-knowledge/knowledge.js';
export const APP_NAME = 'CrystalAstrology';
export function identity(source, id) {
  if (
    !['demo', 'line'].includes(source) ||
    typeof id !== 'string' ||
    !id ||
    (source === 'demo' && !['A', 'B'].includes(id))
  )
    throw new Error('INVALID_IDENTITY');
  return { userKey: APP_NAME + ':' + source + ':' + id, source, id };
}
export const digest = (userKey) =>
  createHash('sha256').update(userKey).digest('hex');
export function initialState(userKey) {
  return {
    userKey,
    schemaVersion: 1,
    revision: 0,
    birthday: null,
    mode: 'consult',
    menu: 'main',
    recommendationIds: [],
    selectedCrystalId: null,
    turns: [],
  };
}
export function projectState(input, userKey) {
  if (
    !input ||
    input.userKey !== userKey ||
    input.schemaVersion !== 1 ||
    !Number.isInteger(input.revision) ||
    input.revision < 0 ||
    !['consult', 'echo'].includes(input.mode) ||
    !['main', 'five'].includes(input.menu)
  )
    throw new Error('INVALID_SNAPSHOT');
  if (
    input.birthday !== null &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthday) ||
      parseBirthday(input.birthday) !== input.birthday)
  )
    throw new Error('INVALID_SNAPSHOT');
  const ids = input.recommendationIds;
  if (
    !Array.isArray(ids) ||
    ![0, 3].includes(ids.length) ||
    new Set(ids).size !== ids.length ||
    ids.some((id) => typeof id !== 'string' || !/^[1-7]$/.test(id)) ||
    (input.selectedCrystalId !== null &&
      !ids.includes(input.selectedCrystalId)) ||
    !Array.isArray(input.turns)
  )
    throw new Error('INVALID_SNAPSHOT');
  const turns = input.turns.map((turn) => {
    if (
      [turn.inputText, turn.replyText, turn.imageDescription].some(
        (t) => t !== null && t !== undefined && typeof t !== 'string',
      ) ||
      (turn.createdAt != null &&
        (typeof turn.createdAt !== 'string' ||
          !Number.isFinite(Date.parse(turn.createdAt)))) ||
      (turn.sourceRef != null && typeof turn.sourceRef !== 'string')
    )
      throw new Error('INVALID_TURN');
    if (
      turn.userKey !== userKey ||
      typeof turn.turnId !== 'string' ||
      !['ATHENA', 'VENUS', 'FORTUNE', 'COSMOS'].includes(turn.senderRole) ||
      !Array.isArray(turn.evidenceLabels) ||
      ![turn.inputText, turn.replyText, turn.imageDescription].some(
        (t) => typeof t === 'string' && t,
      )
    )
      throw new Error('INVALID_TURN');
    const result = {
      turnId: turn.turnId,
      userKey,
      inputText: turn.inputText || null,
      replyText: turn.replyText || null,
      imageDescription: turn.imageDescription || null,
      senderRole: turn.senderRole,
      evidenceLabels: turn.evidenceLabels.filter((x) => typeof x === 'string'),
      createdAt: turn.createdAt || null,
    };
    if (turn.sourceRef) result.sourceRef = turn.sourceRef;
    return result;
  });
  return {
    userKey,
    schemaVersion: 1,
    revision: input.revision,
    birthday: input.birthday,
    mode: input.mode,
    menu: input.menu,
    recommendationIds: [...ids],
    selectedCrystalId: input.selectedCrystalId,
    turns,
  };
}
