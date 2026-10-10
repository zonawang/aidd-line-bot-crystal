# Zona Crystal — 全功能教學 MVP 範圍

## Sources

- [intent-statement.md](../intent-capture/intent-statement.md)：展示、教學、分享用途；一天時限與核心旅程。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)、[constraint-register.md](../feasibility/constraint-register.md)：本機展示優先、十分鐘停損與實機證據邊界。
- [scope-definition-questions.md](scope-definition-questions.md)：使用者要求「我原有的功能都要留著」，選擇全部整合到新版，並確認修正版範圍。
- 既有功能來源：`zonawang/line-echo-bot`、`zonawang/line-memory-bot`、`zonawang/line-quick-reply`、`zonawang/line-icon-switch`、`zonawang/line-rich-menu-switch`、`zonawang/line-loading-animation`、`zonawang/line-datetime-picker`，及已盤點的 `line-flex-message` 三卡分支。

## Product Goal

在一個工作天內完成可展示、教學與分享的新版 Zona Crystal。生日、三卡與選卡介紹是主展示旅程；既有功能全部整合到同一個新版產品，不能只保留分開的舊 Bot 或以主旅程完成代替其餘功能完成。

## In Scope

| ID | 必須保留的功能 | 最小可觀察行為 |
|---|---|---|
| CAP1 | Echo／LINE webhook | 可操作 Echo 模式；保留 LINE 訊息入口與回覆行為 |
| CAP2 | AI 文字諮詢／圖片輸入與辨識 | 保留水晶與星座情境諮詢；文字及圖片可送往模型並取得回覆 |
| CAP3 | 持久對話記憶／回憶 | 按使用者保留內容，後續回合及重新啟動後能讀取相關記憶 |
| CAP4 | Quick Reply | 回覆附三個後續問題；選擇其中一個可繼續互動 |
| CAP5 | 角色名稱／頭像切換 | 保留四個既有角色，依諮詢主題選擇呈現 |
| CAP6 | 雙 Rich Menu／靜態指南 | 可在主選單與五宮格間切換並返回；保留使用指南、認識水晶、淨化方法、功效與佩戴入口 |
| CAP7 | Loading Animation | AI 等待期間提供載入提示 |
| CAP8 | 生日／Datetime Picker／生命靈數 | 可選日期或輸入文字生日，取得生命靈數並繼續諮詢；錯誤日期有提示 |
| CAP9 | 三卡推薦／選卡介紹 | 顯示三張不同水晶卡，選卡後顯示對應內容 |
| CAP10 | 教學與分享交付 | 提供啟動、各功能示範及測試步驟，分列限制與驗證狀態 |

保留的是功能與使用者可觀察行為，不要求保留舊程式的缺陷。既有圖像、指南與互動素材優先沿用；文字保持教學用途，不把水晶效果或星座解讀表述為已驗證的醫療／命運判斷。

## Demonstration & Validation Boundary

新版包含真實 LINE、模型與持久記憶服務的串接功能，另提供不需金鑰的本機教學模式。本機模式可重現所有功能的互動與測試；若模型、圖片辨識或 LINE 操作採固定範例／模擬，必須明確標示。

| 證據層級 | 驗收內容 | 不得推論的結論 |
|---|---|---|
| 本機功能 | 主旅程、每項既有功能及持久記憶可操作；關鍵測試通過 | 不代表 LINE 平台或真實 AI 辨識已驗證 |
| 外部服務 | 憑證與權限可用時驗證模型、記憶服務與 LINE 行為 | 模擬回覆不能當作此層通過 |
| LINE 手機端 | 公開連線可用時操作真實日期選擇、卡片、追問、選單、角色與動畫 | 本機預覽不能當作手機端通過 |

缺少外部依賴時，實作與本機測試繼續，對應實機項目標示未驗證。最終交付須明確區分已實作、已測試、模擬與待驗證，不能宣告缺少證據的外部整合已通過。

## Out of Scope

新增商業平台採購、正式雲端部署、正式營運容量／可靠性承諾、大幅重構，以及歷史程式未真正實作的精確星盤與即時天象計算。既有星座文字諮詢、圖片輸入、記憶、選單與動畫均不在延後清單。

## Change from Approved Upstream

最新人工作答及本階段修正版確認優先於較早的範圍訊號：

- 前階段將照片辨識、永久記憶等列為延後的部分，由 CAP2、CAP3 及完整功能清單取代。
- 原 C7「不永久保存生日或完整對話」與持久記憶要求衝突；新版改為保存功能所需的必要記憶，資料處理於後續設計明確定義。示範仍優先使用虛構資料，不額外保存非必要內容。
- 一天時限、十分鐘停損、教學用途、關鍵測試及外部證據分列仍成立。舊文件保留作決策歷史，不將它們冒稱為新版全功能核准。

## Value Stream Map

主展示：生日輸入 → 生命靈數與三張水晶卡 → 選卡介紹 → Quick Reply 追問 → 記憶延續。

延伸展示：雙選單與指南 → 文字／圖片諮詢 → 載入提示 → 角色化回覆 → 後續問題 → 下次回憶。Echo 是同一新版中的教學模式。

## Definition of Done

- 所有 CAP1–CAP9 整合在新版中；各功能有至少一條可重現的關鍵驗證路徑。
- 本機可端到端操作主旅程與延伸功能，測試涵蓋生日錯誤、選卡對應、記憶讀取及功能串接。
- 真實外部服務的串接實作保留；本機模擬結果與外部實測結果分別紀錄。
- CAP10 的啟動、教學步驟、已知限制及延後項目完成。
- 全部適用 AI-DLC 階段以最小深度執行；本範圍文件本身不代表 MVP 已完成。

## Timebox & Stop Rule

全功能範圍比原先三步旅程大，交付風險提高。優先重用現有實作與資產，壓縮額外裝飾、重構與部署深度。技術問題最多調查十分鐘，改採保留功能的簡單替代方案；不得自行刪除 CAP1–CAP9。若連簡化或沿用都無法保留功能，需明確回報功能與時限的衝突，不延長排程或冒稱完成。

## Assumptions & Open Questions

None.
