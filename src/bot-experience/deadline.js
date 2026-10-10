export class SafeError extends Error {
  constructor(code, status = 502) {
    super(code);
    this.code = code;
    this.status = status;
  }
}
export function remaining(deadline) {
  const ms = deadline - performance.now();
  if (ms <= 0) throw new SafeError('TIMEOUT', 504);
  return ms;
}
export const newDeadline = (ms = 30000) => performance.now() + ms;
export function bounded(promise, deadline) {
  const ms = remaining(deadline);
  let timer;
  return Promise.race([
    Promise.resolve(promise),
    new Promise((_, reject) => {
      const expire = () => {
        const delta = deadline - performance.now();
        if (delta > 0) {
          timer = setTimeout(expire, Math.ceil(delta));
          return;
        }
        reject(new SafeError('TIMEOUT', 504));
      };
      timer = setTimeout(expire, Math.ceil(ms));
    }),
  ]).finally(() => clearTimeout(timer));
}
