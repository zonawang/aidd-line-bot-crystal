const modeLabel = (mode) => (mode === 'echo' ? '回聲模式' : '諮詢模式');
export function renderState(document, state) {
  document.querySelector('#mode').textContent =
    '目前身分：' +
    (state.user || document.querySelector('#identity').value) +
    ' · ' +
    modeLabel(state.mode);
  const menu = state.menu === 'five' ? '五宮格' : '主選單';
  document.querySelector('#menu-label').textContent =
    '目前選單：' + menu + ' · LINE 操作模擬';
  const image = document.querySelector('#menu-image');
  image.hidden = false;
  image.src =
    '/assets/' +
    (state.menu === 'five' ? '五宮格_resized.jpg' : 'richmenu_resized.jpg');
  image.alt = menu + '預覽';
  image.onerror = () => {
    image.hidden = true;
  };
}
export function renderResult(document, response, onAction) {
  const reply = document.querySelector('#reply'),
    cards = document.querySelector('#cards'),
    questions = document.querySelector('#questions'),
    shortcuts = document.querySelector('#shortcuts');
  reply.replaceChildren();
  questions.replaceChildren();
  shortcuts.replaceChildren();
  const add = (parent, tag, text) => {
    const element = document.createElement(tag);
    element.textContent = text;
    parent.append(element);
    return element;
  };
  const result = response.result;
  if (!result) return;
  if (result.sender) {
    const sender = add(reply, 'p', result.sender.name);
    sender.className = 'sender';
    const img = document.createElement('img');
    img.src = result.sender.iconUrl;
    img.alt = result.sender.name;
    img.addEventListener('error', () => img.remove());
    sender.prepend(img);
  }
  const text = add(reply, 'p', result.text);
  text.className = 'reply-text';
  for (const label of result.evidenceLabels || []) add(reply, 'p', label);
  if (result.cards) {
    cards.replaceChildren();
    for (const card of result.cards) {
      const item = document.createElement('article');
      item.className = 'card';
      const img = document.createElement('img');
      img.src = card.imageUrl;
      img.alt = card.name;
      img.addEventListener('error', () => img.remove());
      item.append(img);
      add(item, 'h3', card.name);
      add(item, 'p', card.summary);
      const button = add(item, 'button', '選擇' + card.name);
      button.dataset.testid = 'crystal-cards-select-' + card.crystalId;
      button.addEventListener('click', () =>
        onAction('select-crystal', { crystalId: card.crystalId }),
      );
      cards.append(item);
    }
  }
  for (const [index, question] of (result.followUps || []).entries()) {
    const button = add(questions, 'button', question);
    button.dataset.testid = 'reply-follow-up-' + (index + 1);
    button.addEventListener('click', () =>
      onAction('follow-up', { text: question }),
    );
  }
  for (const item of result.quickActions || []) {
    const button = add(shortcuts, 'button', item.label);
    button.dataset.testid = 'shortcut-' + item.action;
    button.addEventListener('click', () =>
      item.action === 'birthday'
        ? document.querySelector('#birthday').focus()
        : onAction(item.action, {}),
    );
  }
  document.querySelector('#memory').textContent =
    response.memoryStatus.message ||
    '記憶：' + response.memoryStatus.read + ' / ' + response.memoryStatus.write;
}
export function controller({ document, fetcher = fetch, timeoutMs = 35000 }) {
  let generation = 0,
    user = 'A',
    active = null;
  const status = document.querySelector('#status'),
    disable = (value) => {
      for (const button of document.querySelectorAll('button'))
        button.disabled = value;
    };
  function clear() {
    for (const selector of ['#cards', '#reply', '#questions', '#shortcuts'])
      document.querySelector(selector).replaceChildren();
    for (const selector of [
      '#birthday',
      '#birthday-text',
      '#message',
      '#image',
    ])
      document.querySelector(selector).value = '';
    document.querySelector('#memory').textContent = '';
    document.querySelector('#mode').textContent = '';
  }
  async function boundedFetch(url, options, abort) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        abort.abort();
        const error = new Error('等待逾時，請重試');
        error.name = 'AbortError';
        reject(error);
      }, timeoutMs);
    });
    try {
      return await Promise.race([
        (async () => {
          const response = await fetcher(url, {
            ...options,
            signal: abort.signal,
          });
          return { response, data: await response.json() };
        })(),
        timeout,
      ]);
    } finally {
      clearTimeout(timer);
    }
  }
  async function request(action, payload) {
    const current = ++generation,
      requestUser = user;
    active?.abort();
    const abort = new AbortController();
    active = abort;
    status.textContent = '正在整理回覆 · LINE 操作模擬';
    disable(true);
    try {
      const { response, data } = await boundedFetch(
        '/api/demo/interactions',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: requestUser, action, payload }),
        },
        abort,
      );
      if (current !== generation || requestUser !== user) return;
      if (!response.ok) throw new Error(data.error?.message || '操作未完成');
      renderResult(document, data, request);
      renderState(document, data.state);
      status.textContent = '操作完成';
    } catch (error) {
      if (current === generation)
        status.textContent =
          error.name === 'AbortError' ? '等待逾時，請重試' : error.message;
    } finally {
      if (current === generation) disable(false);
    }
  }
  async function selectUser(next) {
    user = next;
    ++generation;
    active?.abort();
    clear();
    disable(false);
    status.textContent = '載入身分 ' + user;
    const current = generation,
      abort = new AbortController();
    active = abort;
    try {
      const { response, data } = await boundedFetch(
        '/api/demo/state?user=' + user,
        {},
        abort,
      );
      if (current !== generation) return;
      if (!response.ok) throw Error('未能載入，請重試');
      renderState(document, { ...data.state, user });
      document.querySelector('#birthday').value = data.state.birthday || '';
      document.querySelector('#memory').textContent =
        '記憶：' +
        (data.memoryStatus.read === 'loaded'
          ? '已讀取'
          : data.memoryStatus.read === 'empty'
            ? '沒有先前內容'
            : '未能讀取');
      status.textContent = '已選擇 ' + user;
    } catch {
      if (current === generation)
        status.textContent = '未能載入，請重新選擇身分';
    }
  }
  return { request, selectUser };
}
