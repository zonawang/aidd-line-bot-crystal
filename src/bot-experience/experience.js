import { randomUUID } from 'node:crypto';
import { knowledge } from '../crystal-knowledge/knowledge.js';
import { identity } from '../conversation-memory/schema.js';
import { newDeadline, remaining, SafeError } from './deadline.js';
import { profile } from '../consultation/profiles.js';
import { relatedQuestions } from '../consultation/consultation.js';
export function experience({ memory, consultation, line }) {
  const stateProjection = (s, user) => ({
    user,
    mode: s.mode,
    menu: s.menu,
    birthday: s.birthday,
    recommendationIds: s.recommendationIds,
    selectedCrystalId: s.selectedCrystalId,
  });
  async function state({ source = 'demo', id }, deadline = newDeadline()) {
    const who = identity(source, id);
    return memory.transact(
      who.userKey,
      deadline,
      async ({ read, snapshot }) => {
        if (read === 'read-failed') throw new SafeError('MEMORY_READ_FAILED');
        return {
          contractVersion: '1.0.0',
          requestId: randomUUID(),
          state: stateProjection(snapshot, id),
          memoryStatus: { read, write: 'not-attempted' },
        };
      },
    );
  }
  async function interact(
    { source = 'demo', id, action, payload = {} },
    deadline = newDeadline(),
  ) {
    const who = identity(source, id),
      requestId = randomUUID();
    return memory.transact(
      who.userKey,
      deadline,
      async ({ read, snapshot, save }) => {
        remaining(deadline);
        let next = structuredClone(snapshot),
          dirty = false,
          result;
        const base = (kind, text) => ({ kind, text, evidenceLabels: [] });
        const inputText = payload.text;
        if (action === 'text') {
          const trimmed = inputText.trim();
          if (/^Echo$/i.test(trimmed)) {
            action = 'set-mode';
            payload = { mode: 'echo' };
          } else if (/^(退出|離開|結束)\s*Echo$/i.test(trimmed)) {
            action = 'set-mode';
            payload = { mode: 'consult' };
          } else if (next.mode !== 'echo') {
            if (
              [
                '使用指南',
                '使用說明',
                '閱讀指南',
                '認識水晶',
                '淨化方法',
                '功效與佩戴',
              ].includes(trimmed)
            ) {
              action = 'guide';
              payload = { guide: trimmed };
            } else if (
              ['switch-to-main-menu', 'switch-to-five-grids'].includes(trimmed)
            ) {
              action = 'set-menu';
              payload = {
                menu: trimmed === 'switch-to-main-menu' ? 'main' : 'five',
              };
            } else if (['#水晶', '今日水晶推薦'].includes(trimmed))
              action = 'recommend';
            else {
              const date = knowledge.parseBirthday(inputText, false);
              if (date) {
                action = 'birthday';
                payload = { dateText: inputText };
              } else if (/(?:生日是|我的生日)/.test(inputText))
                throw new SafeError('INVALID_BIRTHDAY', 400);
            }
          }
        }
        if (action === 'set-mode') {
          next.mode = payload.mode;
          dirty = true;
          result = base(
            'mode',
            next.mode === 'echo'
              ? '已進入 Echo，輸入文字會原樣回聲；輸入「退出 Echo」返回諮詢'
              : '已返回諮詢',
          );
        } else if (
          ['text', 'image', 'follow-up'].includes(action) &&
          next.mode === 'echo'
        ) {
          result = base(
            'echo',
            action === 'image'
              ? 'Echo 模式只接受文字；請退出 Echo 再使用圖片諮詢'
              : inputText,
          );
        } else if (action === 'birthday') {
          const birthday = knowledge.parseBirthday(payload.dateText),
            cards = knowledge.recommend();
          next = {
            ...next,
            birthday,
            recommendationIds: cards.map((c) => c.crystalId),
            selectedCrystalId: null,
          };
          dirty = true;
          result = {
            ...base('birthday', '生命靈數為 ' + knowledge.lifePath(birthday)),
            birthday,
            lifePath: knowledge.lifePath(birthday),
            cards,
          };
        } else if (action === 'recommend') {
          const cards = knowledge.recommend();
          next.recommendationIds = cards.map((c) => c.crystalId);
          next.selectedCrystalId = null;
          dirty = true;
          result = { ...base('cards', '今日水晶推薦'), cards };
        } else if (action === 'select-crystal') {
          if (read === 'read-failed') throw new SafeError('MEMORY_READ_FAILED');
          const card = knowledge.selectCrystal(
            payload.crystalId,
            next.recommendationIds,
          );
          next.selectedCrystalId = card.crystalId;
          dirty = true;
          result = {
            ...base('crystal', card.name + '\n' + card.introduction),
            crystal: card,
            introduction: card.introduction,
            sender: profile('COSMOS'),
            followUps: relatedQuestions(card.name),
            evidenceLabels: ['教學替代問題'],
          };
        } else if (action === 'guide') {
          result = base('guide', knowledge.guide(payload.guide));
        } else if (action === 'set-menu') {
          const target = payload.menu;
          let status = 'simulated';
          if (source === 'line') {
            status = line
              ? await line.switchMenu(id, target, deadline)
              : 'failed';
            if (status === 'applied') {
              next.menu = target;
              dirty = true;
            }
          } else {
            next.menu = target;
            dirty = true;
          }
          result = {
            ...base(
              'menu',
              status === 'failed' || status === 'outcome-unknown'
                ? '未能確認選單切換；可用文字指南與返回'
                : '目前選單：' + next.menu,
            ),
            menuStatus: status,
            evidenceLabels: source === 'demo' ? ['LINE 操作模擬'] : [],
          };
        } else if (action === 'recall') {
          result = base(
            'memory',
            read === 'read-failed'
              ? '未能讀取先前記憶，請重試'
              : next.turns.length
                ? '先前必要文字：\n' +
                  next.turns
                    .map((t) =>
                      [t.inputText, t.replyText, t.imageDescription]
                        .filter(Boolean)
                        .join('\n'),
                    )
                    .join('\n')
                : next.birthday
                  ? '已記錄生日：' + next.birthday
                  : '沒有先前內容',
          );
        } else {
          if (action === 'life-path') {
            if (read === 'read-failed')
              throw new SafeError('MEMORY_READ_FAILED');
            if (!next.birthday) throw new SafeError('INVALID_BIRTHDAY', 400);
            payload = {
              text:
                '老師，請幫我解析我的生命靈數是 ' +
                knowledge.lifePath(next.birthday),
            };
          }
          if (!consultation) throw new SafeError('CONFIG_UNAVAILABLE', 503);
          if (source === 'line' && line) await line.loading(id, deadline);
          result = await consultation({
            input: { kind: action === 'image' ? 'image' : 'text', ...payload },
            context: next,
            deadline,
          });
          dirty = true;
        }
        result.quickActions = [
          { action: 'birthday', label: '輸入生日' },
          ...(next.birthday
            ? [{ action: 'life-path', label: '了解我的生命靈數' }]
            : []),
        ];
        if (
          dirty &&
          [
            'birthday',
            'select-crystal',
            'text',
            'follow-up',
            'image',
            'life-path',
          ].includes(action)
        )
          next.turns.push({
            turnId: randomUUID(),
            userKey: who.userKey,
            inputText: payload.dateText || payload.text || null,
            replyText: result.text,
            imageDescription: result.imageDescription || null,
            senderRole: result.sender?.roleKey || 'COSMOS',
            evidenceLabels: result.evidenceLabels,
            createdAt: new Date().toISOString(),
          });
        remaining(deadline);
        const write = dirty ? await save(next) : 'not-attempted';
        return {
          contractVersion: '1.0.0',
          requestId,
          state: stateProjection(next, id),
          memoryStatus: {
            read,
            write,
            message:
              read === 'read-failed'
                ? '未能讀取；本次為暫時諮詢預覽，未保存'
                : write === 'saved'
                  ? '已保存'
                  : write === 'not-attempted'
                    ? '未進行保存'
                    : write === 'write-failed'
                      ? '未能保存，請重新讀取後再試'
                      : '未能確認保存，請重新讀取',
          },
          result,
        };
      },
    );
  }
  return { state, interact };
}
