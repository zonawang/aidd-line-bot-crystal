# Zona Crystal — 一日全功能教學 MVP 交接摘要

## Sources

- [intent-statement.md](../intent-capture/intent-statement.md)、[stakeholder-map.md](../intent-capture/stakeholder-map.md)：目的、使用對象與一天時限。
- [scope-document.md](../scope-definition/scope-document.md)、[intent-backlog.md](../scope-definition/intent-backlog.md)：最新 CAP1–CAP10、IB1–IB7 及舊邊界取代關係。
- [competitive-analysis.md](../market-research/competitive-analysis.md)：官方文件與既有版本比較。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)、[constraint-register.md](../feasibility/constraint-register.md)：條件式本機可行性、外部依賴與十分鐘停損。
- [team-assessment.md](../team-formation/team-assessment.md)：Codex 主責與必要人工作答。
- [wireframes.md](../rough-mockups/wireframes.md)：已核准的八種互動狀態；[user-flow.md](../rough-mockups/user-flow.md) 補充跨狀態流程。
- [approval-handoff-questions.md](approval-handoff-questions.md)：本次已確認的交接方向；[decision-log.md](decision-log.md) 記錄意圖形成階段決策。

## Intent & Value

在一個工作天內，完成可展示、教學與分享的 Zona Crystal。展示者與學習者能操作生日、生命靈數、三張水晶卡、選卡介紹及後續互動，並重現全部既有功能。可運作 MVP 與端到端流程優先於架構完整度、裝飾和正式營運準備。

研究支持沿用官方 LINE 互動模式及既有素材，不構成商業需求、購買意願或報酬驗證。本次投入理由是使用者明確提出的教學與分享用途，不新增採購研究。

## Scope & Concept

全部 CAP1–CAP10 整合到同一新版：Echo／LINE 訊息入口、AI 文字及圖片諮詢、持久記憶、三個動態 Quick Reply、四角色名稱／頭像、雙 Rich Menu 與指南、Loading Animation、生日／Datetime Picker／生命靈數、三張不同水晶卡與選卡介紹，以及可重現教學交付。

主旅程：生日 → 生命靈數及三卡 → 選卡介紹 → 快速追問 → 記憶延續。延伸旅程：選單與指南 → 文字／圖片諮詢 → 等待 → 角色化回覆 → 追問；Echo 可進入及退出。沿用素材，保留初始、等待、成功、錯誤復原與部分可用狀態，詳見 wireframes 的 S1–S8。

較早 intent-statement、feasibility-assessment 與 constraint-register C3／C7 的「圖片／持久記憶延後」及「不永久保存對話」由最新 scope-document 取代；保留必要記憶、示範使用虛構資料。既有星座文字諮詢保留；新增精確星盤／即時天象、付費採購、正式雲端部署、大幅重構及正式營運承諾延後。

## Feasibility, Risks & Response

新版尚未實作或測試。既有功能與素材可供重用，本機工具已確認可執行，支持有條件繼續；尚不能保證全功能整合在一天內成功或外部全部通過。

- 時程：文件只到足以實作；先減少裝飾、重構、採購及正式部署。不得自行刪除原功能或延長一天排程。
- 技術阻礙：每項最多調查十分鐘，採保留功能的簡單替代方案並記錄；仍無法保留時回報具體衝突。
- 外部依賴：真實 LINE、模型及持久記憶串接保留；憑證、權限與公開連線未驗證。先完成不需金鑰的本機教學，固定 AI／圖片範例與模擬 LINE 操作清楚標示。
- 證據：本機功能／關鍵測試、外部服務、LINE 手機分列；模擬不能當作外部實測。缺少依賴時列未驗證，不假裝通過。
- 內容：生命靈數、水晶與星座為教學情境，不宣稱實證療效或經驗證的命運判斷。

## Team & Next Work

Codex 主責整合、文件與關鍵驗證；使用者處理技能明定不可代答的核准及必要存取設定。只在流程要求時使用專業協作／審查，不新增人員、例會或虛構投入時數。正式 Unit 與交付順序在後續需求及規劃階段定義。

依 IB1–IB7，先建立主展示旅程，再補齊入口、諮詢、持久記憶、角色／追問／動畫、選單／指南，最後逐項驗證與教學交付。後續需求須補齊已核准草圖審查的兩項工作：A／B 展示身分選擇、目前身分及重啟沿用方式；四角色既有主題規則來源與可重現示例。不需要新增管理頁。

## Go / No-Go & Completion Evidence

**建議：有條件繼續。** 產品方向與邊界清楚，適合以沿用和最小深度進入需求與實作；交接不是 MVP 完成證據。

完成須有全部 CAP1–CAP9 的可操作整合與至少一條關鍵驗證路徑，包含無效生日、三卡及選卡對應、文字／圖片、三個追問、四角色、等待結束、重啟記憶與使用者隔離、選單往返、各指南、Echo 退出。CAP10 提供啟動、示範、測試、限制與待驗證清單；全部適用生命週期階段完成。

## Assumptions & Open Questions

None. 外部依賴及交付成效仍待實測，不以假設填成已通過。
