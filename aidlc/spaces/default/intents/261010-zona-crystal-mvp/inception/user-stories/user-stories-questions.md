# Zona Crystal — 使用者故事計畫與產出前確認

## Sources

- [requirements.md](../requirements-analysis/requirements.md)：已核准 FR1–FR10、各子需求及 NFR1–NFR5；全部 Must，永久 ID 不變。
- [team-practices.md](../practices-discovery/team-practices.md)：test-after、逐需求與元件正常路徑驗證、先最薄生日／三卡旅程再補齊全部功能。
- [scope-document.md](../../ideation/scope-definition/scope-document.md)：CAP1–CAP10 全部整合，取代早期功能延後。
- [stakeholder-map.md](../../ideation/intent-capture/stakeholder-map.md)、[wireframes.md](../../ideation/rough-mockups/wireframes.md)：展示參與者、教學者及既有互動情境。
- [需求審查](../requirements-analysis/reviews/review-01.md)：手機與桌面測試寬度於後續最小介面設計／驗證清單明定，不回寫已核准 spec。
- 已讀前階段 questions 與同一紀錄的決策問答。使用者明確授權後續可自治選擇採最簡 MVP-first 預設；不把本計畫當成新增逐題人工作答。

## Story Plan & Recorded Decisions

沒有需重問的產品方向問題。以下依已核准需求及自治授權採最簡方案，正式產出仍須本次摘要確認。

| 規劃題目 | 採用方向與理由 |
|---|---|
| 使用者與目標 | 兩個情境人物：展示參與者（主要，體驗生日／三卡及諮詢）與教學分享者（次要，重現、解說及分享全部功能）。不是新增真人利害關係人或經訪談驗證的人口統計。 |
| 故事拆解方式 | 按可觀察功能／旅程切成 17 個小故事，對應全部子 FR。每個故事標示人物、行動、價值、來源、依賴、Must Have 與 INVEST 註記。共用入口依賴明列；獨立可測不冒稱完全沒有實作依賴。 |
| 驗收格式 | 每個故事使用穩定 USx.y 與 ACx.y.z，3–6 個 Given／When／Then 條件，包含正常及必要錯誤／邊界；日期格式、閏日、三卡逐卡對應、重啟及隔離須具體可判定。 |
| 優先及 MVP 邊界 | 全部故事 Must Have，不新增 Should／Could 功能。先生日、生命靈數、三卡和選卡，再補齊其他原功能；正式交付分組由 Delivery Planning 決定，不能縮為只交主旅程。 |
| 橫跨需求 | NFR1–NFR5 對應受影響故事的驗收或交付清單；保留全部 FR／子 FR／NFR ID 的逐項 traceability.json，不留 GAP。不在此鎖定套件、儲存方式、等待秒數或 UI 寬度。 |
| 專業檢查 | 摘要確認後先形成故事及人物稿，由設計、開發、品質三角色獨立貢獻，再整合與產品審查。真實 LINE／模型／記憶路徑保留，替身與外部實測分列。 |

## Planned Story Inventory

| 故事 | 子需求 | 可觀察價值 |
|---|---|---|
| US1.1 | FR1.1 | 從本機或真實 LINE 進入同一產品功能 |
| US1.2 | FR1.2 | 進出 Echo 並體驗文字回聲 |
| US2.1 | FR2.1 | 文字諮詢水晶、生日及星座 |
| US2.2 | FR2.2 | 圖片諮詢及失敗復原 |
| US3.1 | FR3.1 | 後續回合與重啟讀回必要記憶 |
| US3.2 | FR3.2 | 選擇 A／B 並看見目前身分及隔離 |
| US4.1 | FR4.1 | 點選三個相關追問繼續諮詢 |
| US4.2 | FR4.2 | 使用日期及生命靈數捷徑 |
| US5.1 | FR5.1 | 由四角色名稱／頭像理解回覆主題 |
| US6.1 | FR6.1 | 雙選單切換與返回 |
| US6.2 | FR6.2 | 閱讀全部既有指南並繼續操作 |
| US7.1 | FR7.1 | 諮詢等待、完成或失敗後恢復 |
| US8.1 | FR8.1 | 輸入既有生日形式並修正無效日期 |
| US8.2 | FR8.2 | 依原規則取得 1–9 生命靈數 |
| US9.1 | FR9.1 | 查看三張不同卡並取得所選卡介紹 |
| US10.1 | FR10.1 | 不需金鑰操作全功能本機教學頁 |
| US10.2 | FR10.2 | 依文件重現啟動、展示、檢查及證據層級 |

## Ambiguity & Contradiction Analysis

未發現阻擋故事產出的歧義；17 個故事是規劃拆解，不是新增功能承諾或時數估算。全部原功能與一天時限的風險已於 scope 和 spec 明列；沿用實作／素材、簡化設計及正式部署，不自行刪除功能。已核准 test-after 與 Given／When／Then 驗收並無衝突；故事格式不改變測試順序。

本機圖片／文字範例與模擬 LINE 操作清楚標示；真實失敗不能偷偷轉成功範例。重啟記憶使用實際持久讀取，A／B 不是公開端認證。缺憑證或實機證據不冒稱通過。角色示例沿用 spec 的四組輸入／sender；三追問不限制其他 Quick Reply 捷徑。

## Plan Checklist

- [x] 核對已核准 spec、工作慣例與歷史作答。
- [x] 決定人物、拆解、優先與驗收規則。
- [x] 完成歧義與衝突分析。
- [x] 取得產出前摘要確認。
- [ ] 產出故事、人物、評估與逐需求追溯。
- [ ] 完成三角色貢獻、整合及產品審查。
- [ ] 完成學習確認與階段核准。

## Assumptions & Open Questions

None. 儲存／套件／等待上限／檢查命令及手機、桌面寬度在後續最小設計或實作明定；不擴增跨裝置測試矩陣。外部成效待實測，人物是教學情境抽象，不宣稱經使用者研究驗證。

## Consolidated Summary Confirmation

- 兩個人物：展示參與者與教學分享者。
- 17 個 Must Have 小故事，完整覆蓋全部既有功能；先打通生日／生命靈數／三卡／選卡，再補齊其他功能。
- 每故事 3–6 個 Given／When／Then 驗收，正常、失敗及必要邊界可判定；明列依賴與 INVEST 註記。
- 逐項保留 FR、子 FR 與 NFR 的追溯，納入重啟／隔離、四角色、捷徑、等待／錯誤、安全及教學證據分列。
- 確認後由三專業角色協作並產品審查；不增加架構研究、正式部署或新功能。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
