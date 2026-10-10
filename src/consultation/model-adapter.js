import { hasSecret } from '../config.js';
import { bounded, remaining, SafeError } from '../bot-experience/deadline.js';
const instruction =
  '你是溫暖理性、沈穩的水晶占星教學專家，以繁體中文回覆。沿用學習事業ATHENA、愛情人際VENUS、財運運勢FORTUNE、綜合鑑定COSMOS四角色，開頭輸出[DEITY: ROLE]。水晶與星座內容為教學情境，不能宣稱療效、科學療效或確定命運。只使用提供的目前使用者必要歷史，不推測不存在的個資。';
export function modelAdapter(env = {}, injected = {}) {
  let gemini = injected.geminiClient,
    vertex = injected.vertexClient;
  async function generate({ input, context, deadline, followUpText }) {
    const key = env.GEMINI_API_KEY || env.GOOGLE_GENAI_API_KEY;
    remaining(deadline);
    const text =
      followUpText ||
      instruction +
        '\n必要情境：' +
        JSON.stringify({
          birthday: context.birthday,
          turns: context.turns.slice(-12).map((t) => ({
            inputText: t.inputText,
            replyText: t.replyText,
            imageDescription: t.imageDescription,
          })),
        }) +
        '\n本次問題：' +
        (input.text ||
          '老師，這是我拍的水晶照片，請幫我分析鑑定並詳細解說它的能量特徵、五行，以及它與我磁場的契合度。');
    const parts = [
      { text },
      ...(input.kind === 'image' && !followUpText
        ? [
            {
              inlineData: {
                mimeType: input.mimeType,
                data: input.imageBytes.toString('base64'),
              },
            },
          ]
        : []),
    ];
    try {
      if (hasSecret(key) || gemini) {
        if (!gemini) {
          const { GoogleGenAI } = await import('@google/genai');
          gemini = new GoogleGenAI({ apiKey: key });
        }
        remaining(deadline);
        const response = await bounded(
          gemini.models.generateContent({
            model: env.VERTEX_AI_MODEL || 'gemini-2.5-flash',
            contents: [{ role: 'user', parts }],
            config: {
              httpOptions: { timeout: Math.ceil(remaining(deadline)) },
              abortSignal: AbortSignal.timeout(
                Math.max(1, Math.ceil(remaining(deadline))),
              ),
            },
          }),
          deadline,
        );
        return response.text;
      }
      if (!env.GCP_PROJECT && !vertex)
        throw new SafeError('CONFIG_UNAVAILABLE', 503);
      if (!vertex) {
        const { VertexAI } = await import('@google-cloud/vertexai');
        vertex = new VertexAI({
          project: env.GCP_PROJECT,
          location: env.GCP_LOCATION || 'us-central1',
        }).getGenerativeModel({
          model: env.VERTEX_AI_MODEL || 'gemini-2.5-flash',
        });
      }
      remaining(deadline);
      const response = await bounded(
        vertex.generateContent({ contents: [{ role: 'user', parts }] }),
        deadline,
      );
      return response.response?.candidates?.[0]?.content?.parts
        ?.map((p) => p.text || '')
        .join('');
    } catch (error) {
      if (error instanceof SafeError) throw error;
      throw new SafeError('EXTERNAL_FAILED');
    }
  }
  return { generate };
}
