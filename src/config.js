import path from 'node:path';
export function configFrom(env = process.env) {
  const appMode = env.APP_MODE || 'demo';
  const botMode = env.BOT_MODE || 'example';
  const memoryAdapter = env.MEMORY_ADAPTER || 'local';
  if (
    !['demo', 'line', 'public-demo'].includes(appMode) ||
    !['example', 'real'].includes(botMode) ||
    !['local', 'firestore'].includes(memoryAdapter)
  )
    throw new Error('INVALID_CONFIG');
  let publicDemoOrigin;
  if (appMode === 'public-demo') {
    try {
      const url = new URL(env.PUBLIC_DEMO_ORIGIN);
      if (
        url.protocol !== 'https:' ||
        url.username ||
        url.password ||
        url.pathname !== '/' ||
        url.search ||
        url.hash ||
        botMode !== 'example' ||
        (memoryAdapter === 'firestore' &&
          (!env.FIRESTORE_DATABASE_ID ||
            env.FIRESTORE_DATABASE_ID === '(default)' ||
            env.FIRESTORE_COLLECTION !== 'zona_crystal_public_demo'))
      )
        throw new Error('INVALID_CONFIG');
      publicDemoOrigin = url.origin;
    } catch {
      throw new Error('INVALID_PUBLIC_DEMO_CONFIG');
    }
  }
  const memoryDir = path.resolve(env.MEMORY_DIR || '.zona-data');
  const publicDir = path.resolve('public');
  if (memoryDir === publicDir || memoryDir.startsWith(publicDir + path.sep))
    throw new Error('UNSAFE_MEMORY_DIR');
  const imageOrigins = new Set(['https://images.unsplash.com']);
  for (const key of [
    'DEITY_ATHENA_ICON',
    'DEITY_VENUS_ICON',
    'DEITY_FORTUNE_ICON',
    'DEITY_COSMOS_ICON',
  ])
    if (env[key]) {
      try {
        const url = new URL(env[key]);
        if (url.protocol === 'https:' && !url.username && !url.password)
          imageOrigins.add(url.origin);
      } catch {}
    }
  return {
    appMode,
    botMode,
    memoryAdapter,
    memoryDir,
    publicDir,
    imageOrigins: [...imageOrigins],
    publicDemoOrigin,
    host: env.HOST || '127.0.0.1',
    port: Number(env.PORT || 8080),
    env,
  };
}
export function hasSecret(value) {
  return (
    typeof value === 'string' && !!value.trim() && !/placeholder/i.test(value)
  );
}
