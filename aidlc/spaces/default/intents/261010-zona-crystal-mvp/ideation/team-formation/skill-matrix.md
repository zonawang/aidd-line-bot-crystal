# Zona Crystal — 能力與缺口矩陣

## Sources

- [scope-document.md](../scope-definition/scope-document.md)：CAP1–CAP10 功能與驗收邊界。
- [intent-backlog.md](../scope-definition/intent-backlog.md)：IB1–IB7 工作清單。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)：本機執行工具可用；外部服務尚未驗證。
- [team-formation-questions.md](team-formation-questions.md)：已確認的分工。

## Skill Matrix

以下是責任與驗證安排，不是人員熟練度評級；角色存在不代表實作或外部串接已通過。

| 所需能力 | 功能／工作 | 主責 | 已有參考與待完成證據 |
|---|---|---|---|
| LINE 訊息與 Echo 整合 | CAP1／IB2 | Codex 開發角色 | 既有 Echo 及 webhook；待驗新版入口與回覆 |
| AI 文字與圖片處理 | CAP2／IB3 | Codex 開發角色 | 既有 AI 圖片輸入；待驗真實串接與標示清楚的教學模式 |
| 持久記憶與使用者隔離 | CAP3／IB4 | Codex 開發與品質角色 | 既有記憶服務；待驗後續讀取、重啟讀取與不同使用者隔離 |
| LINE 互動呈現 | CAP4–CAP7／IB5–IB6 | Codex 開發與設計角色 | 追問、四角色、雙選單、指南與動畫；待逐項整合及驗證 |
| 生日與生命靈數 | CAP8／IB1 | Codex 開發與品質角色 | 日期選擇與文字輸入參考；待驗正確日期與錯誤提示 |
| 水晶卡與選卡介紹 | CAP9／IB1 | Codex 開發與設計角色 | 已盤點三卡分支；待驗三張不同卡及介紹對應 |
| 關鍵測試與教學整理 | CAP10、CAP1–CAP9／IB7 | Codex 品質與交付角色 | 待產出可重現步驟、功能測試與實機狀態紀錄 |

## Gap Remediation Plan

- 以既有程式與資產作為整合參考，將功能與測試串成同一新版。
- 專業角色只在流程要求的階段參與；本次不安排外包、增員或額外培訓課程。
- 每項功能用實際產出與驗證建立信心，不以角色名稱代替證據。
- LINE、模型與外部記憶服務的憑證／權限／公開連線可用性另記；本機模擬不能替代外部通過證據。

## Assumptions & Open Questions

None.
