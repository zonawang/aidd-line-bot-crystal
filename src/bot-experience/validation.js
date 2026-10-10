import { SafeError } from './deadline.js';
export const IMAGE_LIMIT = 5 * 1024 * 1024;
export function imageInput(mimeType, bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length > IMAGE_LIMIT)
    throw new SafeError('PAYLOAD_TOO_LARGE', 413);
  const valid =
    mimeType === 'image/png'
      ? bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      : mimeType === 'image/jpeg'
        ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
        : mimeType === 'image/webp'
          ? bytes.toString('ascii', 0, 4) === 'RIFF' &&
            bytes.toString('ascii', 8, 12) === 'WEBP'
          : false;
  if (!valid) throw new SafeError('UNSUPPORTED_IMAGE', 415);
  return { mimeType, imageBytes: bytes };
}
export function validateAction(body) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    Object.keys(body).some((k) => !['user', 'action', 'payload'].includes(k)) ||
    !['A', 'B'].includes(body.user)
  )
    throw new SafeError('INVALID_INPUT', 400);
  const fields = {
    text: ['text'],
    'follow-up': ['text'],
    image: ['mimeType', 'base64'],
    birthday: ['dateText'],
    'select-crystal': ['crystalId'],
    guide: ['guide'],
    'set-mode': ['mode'],
    'set-menu': ['menu'],
    recall: [],
    recommend: [],
    'life-path': [],
  };
  if (!Object.hasOwn(fields, body.action))
    throw new SafeError('INVALID_INPUT', 400);
  const required = fields[body.action],
    p = body.payload || {};
  if (
    typeof p !== 'object' ||
    Array.isArray(p) ||
    Object.keys(p).some((k) => !required.includes(k)) ||
    required.some((k) => typeof p[k] !== 'string' || !p[k].trim())
  )
    throw new SafeError(
      body.action === 'birthday' ? 'INVALID_BIRTHDAY' : 'INVALID_INPUT',
      400,
    );
  if (
    (p.text && p.text.length > 4000) ||
    (p.dateText && p.dateText.length > 4000)
  )
    throw new SafeError('PAYLOAD_TOO_LARGE', 413);
  if (
    (p.mode && !['echo', 'consult'].includes(p.mode)) ||
    (p.menu && !['main', 'five'].includes(p.menu))
  )
    throw new SafeError('INVALID_INPUT', 400);
  if (body.action === 'image') {
    if (
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        p.base64,
      )
    )
      throw new SafeError('UNSUPPORTED_IMAGE', 415);
    Object.assign(p, imageInput(p.mimeType, Buffer.from(p.base64, 'base64')));
    delete p.base64;
  }
  return { source: 'demo', id: body.user, action: body.action, payload: p };
}
