export const names = {
  ATHENA: '智慧守護神 雅典娜',
  VENUS: '金星守護神 維納斯',
  FORTUNE: '命運之輪 莫伊萊',
  COSMOS: '星曜守護導師 艾蓮',
};
const icons = {
  ATHENA: '/assets/雅典娜.png',
  VENUS: '/assets/維納斯.png',
  FORTUNE: '/assets/莫伊來.png',
  COSMOS:
    'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=128&h=128&q=80',
};
export function profile(role, env = {}) {
  const roleKey = Object.hasOwn(names, role) ? role : 'COSMOS';
  const candidate = env['DEITY_' + roleKey + '_ICON'];
  let iconUrl = icons[roleKey];
  try {
    const url = new URL(candidate);
    if (url.protocol === 'https:' && !url.username && !url.password)
      iconUrl = url.href;
  } catch {}
  return { roleKey, name: names[roleKey], iconUrl };
}
export function exampleRole(text) {
  if (/學習|學業|專注|事業|自信|智慧/.test(text)) return 'ATHENA';
  if (/愛情|人際|桃花|婚姻/.test(text)) return 'VENUS';
  if (/財運|財富|運勢|水逆|機遇/.test(text)) return 'FORTUNE';
  return 'COSMOS';
}
