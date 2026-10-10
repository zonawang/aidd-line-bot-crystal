# Zona Crystal — 精簡展示定位研究

## Sources

- 產品目標：`../intent-capture/intent-statement.md`；使用者已核准展示、教學、分享用途與一天時限。
- 使用者本次指示：後續階段凡允許自主決定，直接採推薦的 MVP-first 選項；不自行代答技能明定必須由人回答的確認點。
- LINE Developers：[Send Flex Messages](https://developers.line.biz/en/docs/messaging-api/using-flex-messages/)。本次讀取成功，官方頁面包含 Flex Message Simulator 與 Hello, World 範例入口。
- LINE Developers：[Use quick replies](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/)。本次讀取成功，官方頁面包含 Quick Reply 組件、設定及消失行為。
- 已盤點的既有版本：[line-datetime-picker](https://github.com/zonawang/line-datetime-picker/tree/cc1f1938f11012a6518b7ecb2fab840984d9f478)、[line-flex-message](https://github.com/zonawang/line-flex-message)。前者已在先前程式閱讀確認生日、生命靈數及追問；後者已確認三張隨機水晶卡。

## Q1. 研究要如何服務本次展示與教學目的？

這個決定影響是否花時間做商業市場與付費服務比較。

A. 比較官方互動範例與既有水晶 Bot，聚焦一條可示範旅程（推薦）
B. 商業競品、付費方案及市場規模完整研究
C. Not applicable
X. Other (please specify)

[Answer]: A

決策依據：依使用者本次明確授權，採推薦的 MVP-first 選項；並非使用者逐題作答。

## Q2. 建置或採購的推薦方向？

這個決定影響一天內能否完成可操作成果。

A. 完成最小展示旅程，沿用已盤點的互動概念；購買服務非必要就延後（推薦）
B. 先採購商業 Bot 平台並完成服務比較
C. Not yet defined
X. Other (please specify)

[Answer]: A

決策依據：依使用者本次明確授權，採推薦的 MVP-first 選項；並非使用者逐題作答。

## 研究結論與產出範圍

- 對照方案：官方 Flex Message 模擬與範例可用來學訊息格式；既有 Bot 提供水晶情境的已實作互動；新版目標是在一次展示中串起生日、推薦與選卡介紹。
- 這是展示方案比較，不是商業競品排名；沒有客戶訪談、購買意願或市場份額證據，不宣稱優於市場產品。
- 定位：讓展示參與者可以操作完整旅程，讓教學者有清楚的輸入、推薦理由與後續互動可解說。
- 採最小自行建置方案，維持一天時限；不購買本次核心旅程不需要的服務。
- 延後：商業市場規模、付費服務價格與採購評選、外部客戶需求驗證。價格與受眾人數沒有本次查證資料，不填推測數字。
- `market-trends.md` 僅記錄來源可支持的互動形式與教學定位；不把官方功能文件推論成市場成長趨勢。

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
