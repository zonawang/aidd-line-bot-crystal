# Zona Crystal — 意圖形成至需求階段的一致性檢查

## Sources & Method

依 `.codex/knowledge/aidlc-shared/verification.md` 檢查 intent-statement → scope-document → intent-backlog，並對照 feasibility-assessment、constraint-register、team-assessment、wireframes、initiative-brief 及 decision-log。來源位於本紀錄的 ideation 各階段；最新人工作答的範圍取代關係以 scope-definition/scope-document.md 為準。

此階段沒有需求、故事或程式 traceability.json，不能填造該類覆蓋率。下表只量測已定義功能 CAP1–CAP10 在工作清單與概念草圖中的對照，不代表實作／測試通過。

## Scope Coverage

| 範圍 | 工作清單 | 草圖 | 可行性依據與待驗證 |
|---|---|---|---|
| CAP1 Echo／LINE 入口 | IB2 | S1、S8 | 既有 Echo／訊息入口來源；真實 LINE 未驗證 |
| CAP2 文字／圖片諮詢 | IB3 | S5 | 既有 AI／圖片實作可沿用；模型依賴與新整合未驗證 |
| CAP3 持久記憶 | IB4 | S6 | 既有記憶來源；需補 A／B 操作並驗重啟讀回、隔離 |
| CAP4 三個追問 | IB5 | S4、S5 | 既有 Quick Reply 來源；需驗可點擊延續 |
| CAP5 四角色 | IB5 | S4、S5 | 既有角色來源；需補示例與逐角色驗證 |
| CAP6 雙選單／指南 | IB6 | S7 | 既有素材與互動；LINE 切換及各入口未驗證 |
| CAP7 載入動畫 | IB5 | S5 | 既有等待行為；真實 LINE 與結束時機未驗證 |
| CAP8 生日／生命靈數 | IB1 | S2、S3 | 既有日期選擇；需整合三卡並驗真實日期及復原 |
| CAP9 三卡／選卡 | IB1 | S3、S4 | 既有分支；與生日整合、不同卡及內容對應未驗證 |
| CAP10 教學交付 | IB7 | 本機教學與全部路徑 | 本機工具可執行；實際啟動、教學步驟與測試待產出 |

文件對照為 10／10（100%）：各 CAP 有工作項目、草圖及既有功能／本機工具來源支持條件式繼續。完整整合可行性尚待實作驗證，不能將參考來源等同成功保證。

## Consistency & Warnings

- 目的、一天時限、十分鐘停損及教學用途一致。
- 意圖／可行性舊的圖片、永久記憶延後與 C7 不保存歷史，已由使用者核准的全功能 scope-document 明確取代；initiative-brief 與 decision-log 均承接。這是已記錄的範圍演變，不把舊邊界冒稱仍有效。
- 全功能整合比原三步範圍大；可行性結論只支持有條件繼續，新版所有功能仍待實作。時間風險以重用、最小文件與減少裝飾／重構／正式部署處理，不自行刪原功能。
- 外部存取及手機驗證尚未備妥；本機模擬與外部證據獨立記錄。
- 草圖的 A／B 身分及四角色示例補充已帶入交接，後續需在需求與教學步驟落實。

## Boundary Status

文件追蹤檢查完成，沒有未記錄的範圍遺漏。使用者已選 Approve，正式紀錄顯示 Approval & Handoff 完成、Ideation 為 Verified，並已記錄 PHASE_VERIFIED；此報告不宣告 MVP 或外部整合通過。

- [x] 使用者核准 Approval & Handoff（依本次人工作答及正式核准紀錄確認）。
- 新版功能／測試：尚未完成。
- 外部服務／LINE 手機：尚未驗證。
