# Zona Crystal — 既有功能完整整合範圍確認

## Sources

- [intent-statement.md](../intent-capture/intent-statement.md)：展示、教學、分享；生日、三卡與選卡介紹；一天時限。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)：本機優先、LINE 實機另驗、教學情境與完成證據。
- [constraint-register.md](../feasibility/constraint-register.md)：C1–C9 的時間、範圍、資源、資料與品質限制。
- [raid-log.md](../feasibility/raid-log.md)：核心整合尚待實作，LINE 憑證與公開連線未驗證。
- 前階段已確認的問題紀錄：`../intent-capture/intent-capture-questions.md`、`../market-research/market-research-questions.md`、`../feasibility/feasibility-questions.md`。
- 使用者已授權：採最簡單 MVP-first 選項；時程有風險則縮減非核心範圍，不延長時限。
- 最新範圍修正：使用者回覆「2我原有的功能都要留著」，並選擇「全部整合到新版 Zona Crystal」。此修正優先於前階段將既有功能延後的邊界。
- 功能來源：`zonawang/line-echo-bot`、`line-memory-bot`、`line-quick-reply`、`line-icon-switch`、`line-rich-menu-switch`、`line-loading-animation`、`line-datetime-picker`，另含已盤點的 `line-flex-message` 三卡分支。本階段補核對本機副本中的互動、記憶與選單操作。

## Requested Changes Feedback

What should change?

使用者原始修正：「2我原有的功能都要留著」。上一輪摘要回覆為 Request changes。

A. 全部整合到新版 Zona Crystal — 保留功能，只簡化實作與部署
B. 新版核心旅程＋原版功能仍可使用 — 其他功能可沿用既有 Bot
X. Other (please specify)

[Answer]: A

使用者回覆：「1」；對應已呈現的「全部整合到新版 Zona Crystal」，不是自動代答。

## Revised Scope

原有功能全部保留在同一個新版產品中。生日與三卡仍是主展示旅程；其他既有功能也是本次必須實作的範圍，不因核心旅程完成而視為已完成全部工作。

### Must Have

| ID | 保留功能 | 功能來源／可展示結果 |
|---|---|---|
| CAP1 | Echo 與 LINE webhook | Echo 模式可回覆輸入文字；LINE 訊息入口可運作 |
| CAP2 | AI 文字諮詢與圖片輸入／辨識 | 保留既有水晶、星座等情境諮詢；圖片可送入模型取得回覆 |
| CAP3 | 持久對話記憶與回憶 | 按使用者保留對話，後續諮詢可取得既有內容；不得以刪除記憶功能避開整合 |
| CAP4 | Quick Reply 動態追問 | 回覆後提供三個後續問題，點擊可繼續互動 |
| CAP5 | 角色名稱與頭像切換 | 保留四個既有角色及按主題切換的行為 |
| CAP6 | 雙 Rich Menu 切換與靜態指南 | 主選單、五宮格及返回切換；保留使用指南、認識水晶、淨化方法、功效與佩戴等既有入口 |
| CAP7 | Loading Animation | 等待 AI 回覆時提供 LINE 載入提示；教學模式亦能呈現等待狀態 |
| CAP8 | Datetime Picker、生日輸入與生命靈數 | 日期選擇與文字生日輸入可繼續諮詢、計算生命靈數；錯誤日期有修正提示 |
| CAP9 | 水晶三張推薦卡與選卡介紹 | 整合既有三卡分支，能選擇任一卡片取得對應介紹 |
| CAP10 | 教學與分享交付 | 可重現啟動、各功能示範、關鍵測試、依賴與限制紀錄 |

以上為使用者可觀察的功能，不要求保留原有程式缺陷或把分開的示範服務留作唯一使用方式。推薦與星座諮詢維持教學情境，不擴大為醫療效果或經驗證的命運判斷。

### Conditional Validation

保留真實 LINE、AI 與記憶服務的串接功能；本機另提供不需金鑰的教學模式。教學模式中的模型回覆、圖片辨識及 LINE 平台操作如採固定範例或模擬，必須明確標示，不宣稱真實辨識或平台驗證通過。

實際外部驗證依可用憑證、權限與公開連線執行。缺少依賴時，實作與離線測試仍繼續，但實機項目列為未驗證；不能以模擬結果宣告完整外部整合已通過。

### Won't Have This Time

新增付費平台採購、正式雲端部署、正式營運容量與可靠性承諾、大幅重構，以及歷史程式未真正實作的精確星盤／即時天象計算。不把已存在的星座文字諮詢誤列為延後功能。

## Upstream Changes & Precedence

本次最新人工作答已改變產品範圍，舊文件保留作決策歷史，不冒稱它們已核准新版全功能邊界。

- 原意圖與可行性 C3 將照片辨識、永久記憶等延後：此部分由最新「既有功能全部整合」取代。
- 原可行性 C7 不永久保存對話：與要求保留持久記憶衝突，改為保留必要記憶，於後續設計明確定義儲存與資料處理；示範仍優先使用虛構資料，不額外保存非必要內容。
- 一天時限、十分鐘停損、教學用途、關鍵測試、外部驗證分開紀錄仍適用。
- 若排程有風險，先省去額外裝飾、重構與正式部署。不能自行刪除 CAP1–CAP9；若連沿用與簡化都無法保留功能，必須明確回報衝突。

## Value Stream & Sequencing

主旅程：輸入有效生日 → 生命靈數與三個水晶選項 → 選卡介紹 → 快速追問與記憶延續。

延伸旅程：透過雙選單進入指南或諮詢 → 傳文字／圖片 → 等待提示 → 角色化回覆與追問 → 下次讀取記憶。Echo 作為可操作的教學模式保留。

先完成核心整合，再沿用既有實作補齊其餘功能與資產；各功能保留至少一條關鍵驗證路徑。最後整理示範步驟，依可用外部依賴補實機證據。

## Scope-vs-Timeline Check

全功能整合比原三步旅程範圍大，且新增模型及持久記憶依賴；一天內交付有更高風險，不能保證外部實機全數通過。降低風險的做法是重用現有功能與資產、縮減重構和部署深度、明確區分本機教學證據與外部證據。每個技術阻礙最多調查十分鐘，優先選保留功能的簡單替代方案。

## Assumptions & Open Questions

None.

## Consolidated Summary Confirmation

以上修正版將用於全功能整合的範圍文件與優先工作清單，取代上一輪將既有功能延後的建議；實機驗證狀態誠實分列。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
