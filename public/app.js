import { controller } from './ui.js';
export const roleExamples = [
  ['ATHENA', '我想提升學習專注力，有什麼水晶建議？', '學習與專注'],
  ['VENUS', '我想了解愛情與人際關係的水晶搭配', '愛情與人際'],
  ['FORTUNE', '最近財運起伏，有什麼水晶情境建議？', '財運情境'],
  ['COSMOS', '請介紹水晶基礎鑑定', '基礎鑑定'],
];
export function bindPage(document, ui) {
  document
    .querySelector('#birthday-form')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      ui.request('birthday', {
        dateText:
          document.querySelector('#birthday-text').value ||
          document.querySelector('#birthday').value,
      });
    });
  document
    .querySelector('#identity')
    .addEventListener('change', (event) => ui.selectUser(event.target.value));
  document.querySelector('#text-form').addEventListener('submit', (event) => {
    event.preventDefault();
    ui.request('text', { text: document.querySelector('#message').value });
  });
  document
    .querySelector('#image-form')
    .addEventListener('submit', async (event) => {
      event.preventDefault();
      const file = document.querySelector('#image').files[0];
      if (!file) return;
      if (
        file.size > 5 * 1024 * 1024 ||
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      ) {
        document.querySelector('#status').textContent =
          '請改傳 JPEG、PNG 或 WebP，大小最多 5 MiB；也可以改用文字';
        return;
      }
      const current = document.querySelector('#identity').value;
      const base64 = await new Promise((resolve, reject) => {
        const reader = new document.defaultView.FileReader();
        reader.onload = () => resolve(String(reader.result).split(',')[1]);
        reader.onerror = () => reject(Error('圖片讀取失敗'));
        reader.readAsDataURL(file);
      }).catch(() => null);
      if (current !== document.querySelector('#identity').value) return;
      if (!base64) {
        document.querySelector('#status').textContent =
          '圖片讀取失敗，請重傳或改用文字';
        return;
      }
      ui.request('image', { mimeType: file.type, base64 });
    });
  for (const button of document.querySelectorAll('[data-action]'))
    button.addEventListener('click', () =>
      ui.request(
        button.dataset.action,
        button.dataset.mode
          ? { mode: button.dataset.mode }
          : button.dataset.menu
            ? { menu: button.dataset.menu }
            : {},
      ),
    );
  for (const label of [
    '使用指南',
    '使用說明',
    '閱讀指南',
    '認識水晶',
    '淨化方法',
    '功效與佩戴',
  ]) {
    const button = document.createElement('button');
    button.textContent = label;
    button.dataset.testid = 'guide-' + label;
    button.addEventListener('click', () =>
      ui.request('guide', { guide: label }),
    );
    document.querySelector('#guides').append(button);
  }
  for (const [role, text, label] of roleExamples) {
    const button = document.createElement('button');
    button.textContent = label;
    button.dataset.testid = 'role-' + role;
    button.addEventListener('click', () => ui.request('text', { text }));
    document.querySelector('#role-examples').append(button);
  }
}
if (typeof document !== 'undefined') {
  const ui = controller({ document });
  bindPage(document, ui);
  ui.selectUser('A');
}
