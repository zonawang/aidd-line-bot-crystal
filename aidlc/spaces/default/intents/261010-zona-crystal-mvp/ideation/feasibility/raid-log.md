# Zona Crystal — RAID 紀錄

## Sources

- [intent-statement.md](../intent-capture/intent-statement.md)：一天交付與十分鐘停損。
- [competitive-analysis.md](../market-research/competitive-analysis.md)、[market-trends.md](../market-research/market-trends.md)、[build-vs-buy.md](../market-research/build-vs-buy.md)：參考功能、證據邊界與最小自行建置。
- [feasibility-questions.md](feasibility-questions.md)：本機展示、LINE 未驗證與資料處理方向已確認。

## Risks

| ID | 風險 | 影響 | 處理與觸發點 | 負責角色 |
|---|---|---|---|---|
| R1 | 文件或非核心功能排擠實作時間 | 無法在一天內展示 | 各階段用最小深度；時程有風險立即移除非核心工作 | 交付負責人 |
| R2 | 分開的生日與三卡範例難以直接整合 | 核心旅程中斷 | 沿用互動概念；問題超過十分鐘改用更簡單做法 | 開發者 |
| R3 | LINE 憑證或公開連線不可用 | 手機展示無法驗證 | 保留串接入口；本機核心展示照常完成，實機結果獨立標示 | 開發者 |
| R4 | 示範中輸入真實生日並被保存或披露 | 不必要的個人資料處理 | 優先虛構資料；展示端不永久保存生日或完整對話，後續確認實作行為 | 開發者／品質負責人 |
| R5 | 教學推薦被理解為實證療效或命運預測 | 誤解產品用途 | 以可解說教學素材呈現；不作上述效果宣稱 | 產品負責人 |

## Assumptions

無待補答的產品方向假設。可行性是有條件判斷，不等於整合成功；待驗證證據列於 Issues 與 Dependencies，不能先記為通過。

## Issues

| ID | 當前狀態 | 結案證據 |
|---|---|---|
| I1 | 新版核心旅程尚未實作或測試 | 可操作的端到端示範與關鍵測試通過 |
| I2 | LINE 手機端尚未驗證 | 實際生日互動、三卡與選卡回覆證據；未完成則留在已知限制 |

## Dependencies

| ID | 依賴 | 現況 | 替代／處理 |
|---|---|---|---|
| D1 | 本機執行工具 | 已確認 Node v24.18.0、npm 11.16.0 可執行 | 後續實際啟動及測試，不以版本檢查取代驗收 |
| D2 | 可解說的水晶教學內容 | 既有版本提供情境參考，尚需整理新版素材 | 範圍以三卡與選卡介紹所需為限 |
| D3 | LINE 憑證及可用公開連線 | 未驗證；本機展示不依賴此項 | 不需金鑰的本機流程；實機驗證延後或於時限內補證據 |

## Deferred Items

照片辨識、永久記憶、進階占星、付費平台評選、正式雲端部署、正式營運品質與公開營運前的隱私義務確認。每個超過十分鐘的新增阻礙，也要記錄原因及採用的替代方案。

## Assumptions & Open Questions

None.
