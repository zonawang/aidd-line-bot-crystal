# Zona Crystal — Minimal CI/CD Pipeline（U1）

## Sources

- [infrastructure-design-questions.md](infrastructure-design-questions.md)：已確認本機／最小CI方案。
- [performance-design.md](../nfr-design/performance-design.md)、[security-design.md](../nfr-design/security-design.md)、[scalability-design.md](../nfr-design/scalability-design.md)、[reliability-design.md](../nfr-design/reliability-design.md)、[observability-design.md](../nfr-design/observability-design.md)、[logical-components.md](../nfr-design/logical-components.md)：25項NFR的具體機制及同程序界線。
- [components.md](../../../inception/domain-design/components.md)、[functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)：四元件、全部功能與C1–C5。

## Build & Test Sequence

| Step | Stage / Gate | Configuration | Outcome |
|---|---|---|---|
| PIPE-01 Baseline | 實作前必要Git準備 | 檢查可提交檔／忽略私有資料；main無HEAD時建立安全基準，短期Bolt/worktree以main為base | 保留AI-DLC記錄版本，不提交秘密／機器cursor/runtime。 |
| PIPE-02 Plan | Code Generation初始Plan Approval | 完整可審實作計畫與testing contract，取得明定人工作答後才寫應用 | 自主completion不能代答plan。 |
| PIPE-03 Install | package/lock | Node24、npm ci，依安裝固定lock；無真秘密的example可啟動 | lock讓本機／CI依賴一致；簡單npm audit結果記錄、入口／秘密／隔離相關風險優先處理。 |
| PIPE-04 Check | 本機＋GitHub Actions | 同一npm run check：最小ESLint/Prettier、node:test、需求／adapter／HTTP與子程序持久restart smoke | test-after、每可測需求至少一測／四元件happy path；適用lint/format/關鍵tests失敗阻擋合併，無新增coverage百分比。 |
| PIPE-05 Verification | Construction Verification Command | 指定可執行check在實作後另行本人確認，再執行正式Unit驗證 | 此文件的命令名稱不是已授權verification receipt；保留人工作答。 |
| PIPE-06 Merge | 經過驗證的Bolt | 依流程squash回main；source history保留至worktree處理 | 未通過不merge，不自動push／發布。 |
| PIPE-07 Local delivery | 本機可展示 | npm start、health、完整生日→三卡→選卡及原功能展示，README/evidence記實際command/版本/exit | 全適用Operation階段以本機最小深度完成；不假稱正式部署。 |

## CI, Secrets & Promotion

CI配置只Node24→npm ci→共用check，測試可在無真LINE／Google秘密情境執行。虛構簽章密鑰只測入口；production secret不注入PR job、不記錄環境內容。原LINE_TOKEN/secret／Gemini keys／GCP project/location/model及角色override在server環境保留，.env.example只有占位符。

沒有新staging／prod／CD平台、blue-green／canary或付費資源；本機recreate足夠。若已有可用staging則合併後依既定流程deploy/smoke；正式production仍需獨立人工核准，這次不部署。發布／真HTTPS endpoint及外部手機測試由後續階段依可用性分列，不因CI pass宣稱外部已通過。

## Rollback & Evidence

PIPE-08：停止本機程序→改用前一個實際通過的程式版本→保持MEMORY_DIR及原FireStore資料不動→重啟→health／生日／卡／讀回smoke。具體commit／可執行命令在實作交付補入，不杜撰前一版本；若首次交付沒有可回退通過版本，明列「回退未驗證」，仍能停止服務並保留資料。不以git reset／刪資料作自動復原。

证據表分文件檢查、固定範例、adapter spy、本機實際HTTP／restart／瀏覽器、外部Google／Firestore／LINE及手機。無憑證或瀏覽器時寫未驗證／限制，不用mock冒充成功。原17stories52AC全部有實作及檢查落點，主旅程不能取代全功能完成條件。

## Assumptions & Open Questions

None. 此階段只有設計；尚未安裝依賴、建立應用check/CI、執行restart、merge或部署。
