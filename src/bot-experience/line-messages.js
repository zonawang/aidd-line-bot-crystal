import { knowledge } from '../crystal-knowledge/knowledge.js';
import { SafeError } from './deadline.js';
export function lineMessages(response, env = {}) {
  const r = response.result,
    items = [];
  const sender = r.sender
    ? {
        name: r.sender.name,
        iconUrl: r.sender.iconUrl.startsWith('/')
          ? (env.PUBLIC_BASE_URL || '') + r.sender.iconUrl
          : r.sender.iconUrl,
      }
    : undefined;
  if (sender && !/^https:\/\//.test(sender.iconUrl)) delete sender.iconUrl;
  const quick = [
    ...(r.followUps || []).map((text) => ({
      type: 'action',
      action: { type: 'message', label: text.slice(0, 20), text },
    })),
    {
      type: 'action',
      action: {
        type: 'datetimepicker',
        label: '輸入生日',
        data: 'action=select_birthday',
        mode: 'date',
      },
    },
  ];
  if (response.state.birthday)
    quick.push({
      type: 'action',
      action: {
        type: 'message',
        label: '了解我的生命靈數',
        text:
          '老師，請幫我解析我的生命靈數是 ' +
          knowledge.lifePath(response.state.birthday),
      },
    });
  const notices = [
    ...(r.evidenceLabels || []),
    response.memoryStatus.message,
    ...(r.menuStatus ? ['選單套用狀態：' + r.menuStatus] : []),
    ...(r.externalStatus ? ['外部操作狀態：' + r.externalStatus] : []),
  ]
    .filter(Boolean)
    .join('\n');
  // Reserve mandatory labels and storage/external outcomes before budgeting
  // body text. A long answer must not erase its uncertainty or provenance.
  const limit = 4900,
    textSlots = r.cards ? 4 : 5;
  // Product notice fields are bounded enums/messages. Reject an impossible
  // projection explicitly rather than dropping mandatory status text.
  if (notices.length > limit) throw new SafeError('PAYLOAD_TOO_LARGE', 413);
  const noticeChunks = [];
  for (let offset = 0; offset < notices.length; offset += limit)
    noticeChunks.push(notices.slice(offset, offset + limit));
  const reserved = noticeChunks.length;
  const body = String(r.text || ''),
    truncatedNotice = '（回覆正文過長，已截短；必要來源與狀態標示完整保留。）';
  const capacity = Math.max(0, textSlots - reserved) * limit;
  const truncated = body.length > capacity;
  const text = truncated
    ? body.slice(0, Math.max(0, capacity - truncatedNotice.length - 1)) +
      '\n' +
      truncatedNotice
    : body;
  for (let offset = 0; offset < text.length; offset += limit)
    items.push({
      type: 'text',
      text: text.slice(offset, offset + 4900),
      ...(sender ? { sender } : {}),
    });
  // Short replies retain one text message; long replies use reserved messages.
  if (
    noticeChunks.length === 1 &&
    items.length === 1 &&
    items[0].text.length + 1 + notices.length <= limit
  )
    items[0].text += '\n' + notices;
  else
    for (const notice of noticeChunks)
      items.push({ type: 'text', text: notice, ...(sender ? { sender } : {}) });
  if (!items.length) items.push({ type: 'text', text: '操作完成' });
  if (r.cards)
    items.push({
      type: 'flex',
      altText: '今日三張水晶推薦',
      contents: {
        type: 'carousel',
        contents: r.cards.map((c) => ({
          type: 'bubble',
          hero: {
            type: 'image',
            url: c.imageUrl,
            size: 'full',
            aspectRatio: '20:13',
            aspectMode: 'cover',
          },
          body: {
            type: 'box',
            layout: 'vertical',
            contents: [
              { type: 'text', text: c.name, weight: 'bold', wrap: true },
              { type: 'text', text: c.summary, wrap: true, size: 'sm' },
            ],
          },
          footer: {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'button',
                action: {
                  type: 'postback',
                  label: '選擇水晶',
                  data: 'action=select_crystal&crystalId=' + c.crystalId,
                  displayText: '選擇' + c.name,
                },
              },
            ],
          },
        })),
      },
    });
  items[0].quickReply = { items: quick.slice(0, 13) };
  return items;
}
