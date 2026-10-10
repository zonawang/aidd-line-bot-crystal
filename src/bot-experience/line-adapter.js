import { createHmac, timingSafeEqual } from 'node:crypto';
import { hasSecret } from '../config.js';
import { SafeError, newDeadline, remaining, bounded } from './deadline.js';
import { IMAGE_LIMIT, imageInput } from './validation.js';
import { lineMessages } from './line-messages.js';
export const menuAliases = {
  main: 'alias_main_menu',
  five: 'alias_five_grids',
};
export function validSignature(body, signature, secret) {
  if (
    !Buffer.isBuffer(body) ||
    typeof signature !== 'string' ||
    !/^[A-Za-z0-9+/]{43}=$/.test(signature)
  )
    return false;
  const actual = Buffer.from(signature, 'base64'),
    expected = createHmac('sha256', secret).update(body).digest();
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
export function lineAdapter(env = {}, injected = {}) {
  let clients;
  async function getClients() {
    if (injected.api) return injected;
    if (!hasSecret(env.LINE_CHANNEL_ACCESS_TOKEN))
      throw new SafeError('CONFIG_UNAVAILABLE', 503);
    clients ??= import('@line/bot-sdk').then(({ messagingApi }) => ({
      api: new messagingApi.MessagingApiClient({
        channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
      }),
      blob: new messagingApi.MessagingApiBlobClient({
        channelAccessToken: env.LINE_CHANNEL_ACCESS_TOKEN,
      }),
    }));
    return clients;
  }
  async function switchMenu(id, target, deadline) {
    const menuId =
      env[target === 'main' ? 'LINE_MAIN_MENU_ID' : 'LINE_FIVE_MENU_ID'];
    if (!hasSecret(menuId)) return 'failed';
    try {
      remaining(deadline);
      const { api } = await bounded(getClients(), deadline);
      remaining(deadline);
      await bounded(api.linkRichMenuIdToUser(id, menuId), deadline);
      return 'applied';
    } catch (error) {
      return error.code === 'TIMEOUT' ? 'outcome-unknown' : 'failed';
    }
  }
  async function loading(id, deadline) {
    // Animation is best effort and must not delay model dispatch.
    try {
      remaining(deadline);
      void getClients()
        .then(({ api }) => {
          if (deadline > performance.now())
            return api.showLoadingAnimation({ chatId: id, loadingSeconds: 20 });
        })
        .catch(() => {});
    } catch {}
  }
  async function image(messageId, deadline) {
    const { blob } = await bounded(getClients(), deadline);
    remaining(deadline);
    const stream = await bounded(blob.getMessageContent(messageId), deadline);
    const timer = setTimeout(
      () => stream.destroy(new SafeError('TIMEOUT', 504)),
      remaining(deadline),
    );
    try {
      const chunks = [];
      let count = 0;
      for await (const chunk of stream) {
        remaining(deadline);
        const bytes = Buffer.from(chunk);
        count += bytes.length;
        if (count > IMAGE_LIMIT) {
          stream.destroy();
          throw new SafeError('PAYLOAD_TOO_LARGE', 413);
        }
        chunks.push(bytes);
      }
      const bytes = Buffer.concat(chunks);
      const mimeType =
        bytes[0] === 137
          ? 'image/png'
          : bytes[0] === 255
            ? 'image/jpeg'
            : 'image/webp';
      return imageInput(mimeType, bytes);
    } finally {
      clearTimeout(timer);
    }
  }
  async function reply(replyToken, response, deadline) {
    remaining(deadline);
    const { api } = await bounded(getClients(), deadline);
    remaining(deadline);
    return api.replyMessage({
      replyToken,
      messages: lineMessages(response, env),
    });
  }
  return { switchMenu, loading, image, reply };
}
export function eventAction(event) {
  const id = event.source?.userId;
  if (
    typeof id !== 'string' ||
    !id ||
    (event.source?.type !== 'user' &&
      !['group', 'room'].includes(event.source?.type))
  )
    return null;
  let action, payload;
  if (event.type === 'message' && event.message?.type === 'text') {
    if (typeof event.message.text !== 'string' || !event.message.text.trim())
      return null;
    if (event.message.text.length > 4000)
      throw new SafeError('PAYLOAD_TOO_LARGE', 413);
    action = 'text';
    payload = { text: event.message.text };
  } else if (event.type === 'message' && event.message?.type === 'image') {
    if (typeof event.message.id !== 'string') return null;
    action = 'image';
    payload = { messageId: event.message.id };
  } else if (event.type === 'postback') {
    const data = event.postback?.data;
    if (data === 'action=select_birthday') {
      action = 'birthday';
      payload = { dateText: event.postback.params?.date };
      if (typeof payload.dateText !== 'string')
        throw new SafeError('INVALID_BIRTHDAY', 400);
    } else if (['switch-to-main-menu', 'switch-to-five-grids'].includes(data)) {
      action = 'set-menu';
      payload = { menu: data === 'switch-to-main-menu' ? 'main' : 'five' };
    } else if (/^action=select_crystal&crystalId=[1-7]$/.test(data || '')) {
      action = 'select-crystal';
      payload = { crystalId: data.slice(-1) };
    } else return null;
  } else return null;
  if (typeof event.replyToken !== 'string' || !event.replyToken)
    throw new SafeError('INVALID_INPUT', 400);
  return { source: 'line', id, action, payload };
}
export function webhookHandler({ env, experience, line, deadlineMs = 30000 }) {
  const deliveries = new Map();
  return async (req, res) => {
    if (
      !hasSecret(env.LINE_CHANNEL_SECRET) ||
      !hasSecret(env.LINE_CHANNEL_ACCESS_TOKEN)
    )
      throw new SafeError('CONFIG_UNAVAILABLE', 503);
    if (
      !validSignature(
        req.body,
        req.get('x-line-signature'),
        env.LINE_CHANNEL_SECRET,
      )
    )
      throw new SafeError('INVALID_SIGNATURE', 401);
    let body;
    try {
      body = JSON.parse(req.body.toString('utf8'));
    } catch {
      throw new SafeError('INVALID_INPUT', 400);
    }
    if (!body || !Array.isArray(body.events))
      throw new SafeError('INVALID_INPUT', 400);
    const deadline = newDeadline(deadlineMs);
    let failure = false;
    for (const event of body.events) {
      let input;
      try {
        input = eventAction(event);
      } catch {
        failure = true;
        continue;
      }
      if (!input) continue;
      // Older supported events may lack an event ID. Process them without
      // inventing a shared key or claiming stable deduplication.
      const key =
        typeof event.webhookEventId === 'string' && event.webhookEventId
          ? event.webhookEventId
          : null;
      const known = key ? deliveries.get(key) : undefined;
      if (known) {
        if (known.status === 'delivered') continue;
        if (
          known.status !== 'failed' ||
          !known.response ||
          known.id !== input.id
        ) {
          failure = true;
          continue;
        }
      }
      // A known rejected reply can be attempted on platform redelivery using
      // the computed result. Never repeat model, save, image or menu effects.
      const record = known || { id: input.id };
      record.status = 'in-flight';
      if (key) deliveries.set(key, record);
      try {
        remaining(deadline);
        if (!record.response) {
          if (input.action === 'image')
            input.payload = await line.image(input.payload.messageId, deadline);
          record.response = await experience.interact(input, deadline);
        }
        remaining(deadline);
        const pending = Promise.resolve(
          line.reply(event.replyToken, record.response, deadline),
        );
        pending.then(
          () => {
            record.status = 'delivered';
          },
          () => {
            record.status = 'failed';
          },
        );
        try {
          await bounded(pending, deadline);
          record.status = 'delivered';
        } catch (error) {
          if (error.code === 'TIMEOUT' && record.status === 'in-flight')
            record.status = 'outcome-unknown';
          throw error;
        }
      } catch {
        if (record.status === 'in-flight') record.status = 'failed';
        failure = true;
      }
    }
    res.status(failure ? 500 : 200).json({ ok: !failure });
  };
}
