# Zona Crystal — 意圖形成階段決策紀錄

## Sources

- [intent-statement.md](../intent-capture/intent-statement.md)、[stakeholder-map.md](../intent-capture/stakeholder-map.md)。
- [scope-document.md](../scope-definition/scope-document.md)、[intent-backlog.md](../scope-definition/intent-backlog.md)、[scope-definition-questions.md](../scope-definition/scope-definition-questions.md)。
- [competitive-analysis.md](../market-research/competitive-analysis.md)、[build-vs-buy.md](../market-research/build-vs-buy.md)。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)、[constraint-register.md](../feasibility/constraint-register.md)。
- [team-assessment.md](../team-formation/team-assessment.md)、[team-formation-questions.md](../team-formation/team-formation-questions.md)。
- [wireframes.md](../rough-mockups/wireframes.md)、[rough-mockups-questions.md](../rough-mockups/rough-mockups-questions.md)、[草圖審查](../rough-mockups/reviews/review-01.md)。
- [approval-handoff-questions.md](approval-handoff-questions.md)：最新交接摘要已確認；本文件記錄決策內容，不代替正式核准紀錄。

## Decisions

| ID | 決策 | 來源與演變 | 交付影響 |
|---|---|---|---|
| D1 | 展示、教學、分享 Bot；整個生命週期限一天 | 使用者原始目標；intent-statement | 實作與核心流程優先，文件與架構最小深度 |
| D2 | 每項技術／環境問題十分鐘停損 | 使用者執行原則；constraint-register C2 | 超時採簡單替代方案並記錄，不延長時限 |
| D3 | 沿用既有功能與官方互動參考，自行整合 | competitive-analysis、build-vs-buy 已核准 | 不新增商業採購；研究不冒稱市場驗證 |
| D4 | 原先只做生日三卡，改為全部功能整合在新版 | scope-definition-questions 記錄「2我原有的功能都要留著」及「全部整合到新版 Zona Crystal」；scope-document 已核准 | CAP1–CAP10 與 IB1–IB7 均為必須完成，不能只交付三卡或分開舊 Bot |
| D5 | 持久記憶保留，取代舊不保存歷史限制 | scope-document 的 Change from Approved Upstream | C7 舊限制留作歷史；保存必要記憶，虛構展示資料優先，重啟讀回與隔離需驗證 |
| D6 | 本機不需金鑰教學優先，真實串接保留 | feasibility 的本機方向、scope-document 的最新外部邊界 | AI／圖片固定範例及 LINE 模擬清楚標示，外部與手機證據獨立記錄 |
| D7 | Codex 主責，不新增真人團隊 | team-assessment、team-formation-questions 已核准 | 不編造預算／時數／班表；使用者只處理必要決策與存取設定 |
| D8 | 沿用素材、LINE 手機優先、本機可操作預覽 | rough-mockups-questions 與 wireframes 已核准 | S1–S8 保留所有功能，涵蓋等待、錯誤、部分可用與無障礙註記 |
| D9 | 草圖繼續，補充帶入後續需求與教學 | 草圖核准時使用者選 Approve；本次交接摘要再次確認 | 補 A／B 展示身分及重啟沿用操作、四角色主題來源與示例；不新增管理頁 |
| D10 | 日常可自主選最簡單方案；明文人工作答保留 | 使用者最大自主授權與既有分工紀錄 | 不反覆討論日常選項；必要摘要、階段核准及憑證需求依規則處理 |
| D11 | 暫不做正式營運與新增精確天象能力 | scope-document Out of Scope 已核准 | 採購、正式部署、大幅重構與正式品質承諾延後；既有星座文字諮詢仍保留 |

## Precedence & Outstanding Evidence

D4、D5 是使用者對較早範圍的明確修正，優先於 intent-statement、feasibility-assessment、constraint-register 與 raid-log 舊的圖片／記憶延後、不保存對話及縮減原功能表述。舊文件不靜默改寫；後續依最新 scope-document 與本交接摘要執行。

本次沒有已核准的新增採購金額、外部利害關係人簽核或真人工時。新版程式、全功能測試及真實 LINE／模型／記憶服務證據均待後續建立；不能從文件完成推論 MVP 已完成。

## Assumptions & Open Questions

None. 外部驗證及一天交付仍是條件與風險，不是假設已成功。
