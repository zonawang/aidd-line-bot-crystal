import { profile, exampleRole } from './profiles.js';
import { SafeError, remaining } from '../bot-experience/deadline.js';
export const relatedQuestions = (topic) => [
  '請介紹' + topic + '的挑選方式',
  '如何保養' + topic + '？',
  topic + '有哪些日常搭配情境？',
];
export function consultation({ mode = 'example', env = {}, model }) {
  return async ({ input, context, deadline }) => {
    remaining(deadline);
    let text,
      role = 'COSMOS',
      questions = [],
      labels = [];
    if (mode === 'example') {
      role = exampleRole(input.text || '水晶鑑定');
      text =
        input.kind === 'image'
          ? '這是圖片辨識教學範例。真實辨識會將本次完整圖片傳入模型；固定描述不代表這張照片的結論。'
          : '讓我們以教學情境探索「' +
            input.text +
            '」。可以先認識水晶的外觀、挑選與保養，再依自己的偏好選擇；生日與星座主題是理解規則的示例。';
      labels = [
        input.kind === 'image' ? '圖片辨識範例，非真實辨識' : '教學範例回覆',
      ];
      questions = relatedQuestions(
        input.kind === 'image' ? '水晶圖片' : input.text.slice(0, 40),
      );
    } else {
      text = await model.generate({ input, context, deadline });
      if (typeof text !== 'string' || !text.trim())
        throw new SafeError('EXTERNAL_FAILED');
      const match = text.match(/\[DEITY:\s*([A-Z]+)\]/i);
      role = match?.[1]?.toUpperCase() || 'COSMOS';
      text = text.replace(/\[DEITY:[^\]]*\]\s*/gi, '').trim();
      try {
        remaining(deadline);
        const raw = await model.generate({
          input,
          context,
          deadline,
          followUpText:
            '依下列回覆產生三個不同、相關的繁體中文追問，只輸出JSON字串陣列，每題不超300字以符合LINE訊息動作限制：\n' +
            text,
        });
        questions = JSON.parse(raw.replace(/^\`\`\`(?:json)?\s*|\`\`\`$/g, ''));
      } catch {
        questions = [];
      }
      const valid = Array.isArray(questions)
        ? [
            ...new Set(
              questions.filter(
                (q) => typeof q === 'string' && q.trim() && q.length <= 300,
              ),
            ),
          ]
        : [];
      if (valid.length !== 3) {
        questions = relatedQuestions(
          input.kind === 'image' ? '水晶圖片' : input.text.slice(0, 40),
        );
        labels.push('教學替代問題');
      } else questions = valid;
    }
    remaining(deadline);
    return {
      kind: 'consultation',
      text,
      sender: profile(role, env),
      followUps: questions,
      evidenceLabels: labels,
      ...(input.kind === 'image' ? { imageDescription: text } : {}),
    };
  };
}
