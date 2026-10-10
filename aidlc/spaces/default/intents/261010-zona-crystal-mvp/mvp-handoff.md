# Zona Crystal — 本機 MVP 交接

## Sources

- [aidlc-state.md](aidlc-state.md)：Status=Completed；五個階段的流程狀態 Verified；原生路由回覆沒有待執行階段。
- [requirements.md](inception/requirements-analysis/requirements.md)：新版全功能 spec；17 stories、52 AC、25 詳細 NFR、23 BR。
- [review-03.md](construction/u1-zona-crystal-bot/code-generation/reviews/review-03.md)：本次有效 READY；零 Critical、一項未解決 Major R-01。
- [test-results.md](construction/build-and-test/test-results.md)：64/64、格式與 lint；品質目標未全滿足，使用者 Accept failure。
- [deployment-log.md](operation/deployment-execution/deployment-log.md)：本機交付已核准；程式版本與資料保留。

## Delivery

展示入口：http://127.0.0.1:8080 。目前既有服務運行，health 與教學頁 HTTP 200。

停止後從專案根目錄以 `npm start` 啟動；乾淨環境先 `npm ci --no-fund --no-audit`。預設 demo/example/local，不需金鑰。必要檢查命令為 `node scripts/u1-zona-crystal-bot/check.mjs`（`npm run check:u1` 同一 runner）。

生日 2000-01-01 → 生命靈數 4 → 三張不同卡 → 選卡介紹 → 三個追問是主展示旅程。原有文字／圖片路徑、四角色、Echo、六指南、雙選單、日期／生命靈數捷徑、等待提示、回憶與 A／B 持久隔離均保留；固定 AI／圖片範例及 LINE 模擬就近標示。詳細步驟見根目錄 docs/zona-crystal-demo.md。

本次恢復没有重建或修改應用程式。main 實作提交 `92efb89f68c5ab07cddc140d0bcfae0d41c7f090`；53 個 source-manifest 路徑、100 個詳細追溯 ID。資料 `.zona-data` 與既有備份均保留，不提交或公開。

## Validation & Meaning of Completion

本輪既有九檔、全檔與 check 的 distinct 命令各依階段要求執行一次；唯一 suite 64 tests、64 pass、0 fail、0 skipped，不把重跑累加為新覆蓋。Prettier／ESLint pass。真本機 HTTP、私有 JSON、新程序重啟、A／B 隔離與五並行通過；warm10 為 [5,4,2,4,5,8,2,2,3,2] ms，每次低於 2000 ms。

流程已完成，不等同全部品質目標通過。Build and Test 保留 3 個 Not Met 與 5 個 Unverified 目標，使用者明確 Accept failure 後繼續；存在 target 與 review READY 均不能解讀為 R-01 已修復或真外部服務已測。

恢復動作曾將四個已保留的 Construction 設計階段在主指標標為 skipped；其既有設計、答案及審查仍保留，沒有重做或手動篡改狀態。CI／CD／AWS provisioning／新監控／事故平台／額外負載及持續優化，依各條件與已足夠的本機配置由原生流程記錄 skipped；不宣稱這些新平台曾建置或測試。

## Deferred Items

| Priority | Item | Next bounded action |
|---|---|---|
| 1 | R-01：前項耗盡 LINE batch deadline，尚未開始的後項重送可能永久 500 | 另立必要修復：先驗剩餘期限再登錄未開始事件，補一條重送回歸；估 10–20 分鐘含 review，保持未知交付不重播。 |
| 2 | 375／1280 完整視覺與人工鍵盤、原生 A／B 下拉未驗證 | 使用可用瀏覽器完成既定清單；工具調查 10 分鐘仍不通即記錄，不能以 DOM 或 390 寬度替代。 |
| 3 | FR／母層 NFR 缺直接 OK entry；100 詳細 ID 映射完整 | 在合法後續 code-generation 更新追溯紀錄並重新審查；不改原需求或降低門檻。 |
| 4 | 真 Gemini／Vertex／Firestore／LINE HTTPS、手機 sender/loading/menu/date 未實測 | 操作者安全配置憑證後補既定外部測試；不跑舊 setup-rich-menus、不寫 legacy 文件。 |
| 5 | 舊版本回退尚未驗；單 writer、程序內去重限制 | 保留資料，沿用已測的同版本重啟；沒有正式 SLA、HA 或跨程序 exactly-once 承諾。 |
| 6 | 舊 Bolt worktree、state、audit cleanup 未完成 | 保留 dirty／未追蹤內容，後續由原生 recovery 處理；本輪不強制刪除或重新 merge。 |

根目錄部分歷史摘要對 R-01 的首輪修復描述只涵蓋已知 reply 拒絕分支；最新殘餘問題以 review-03、本輪 test-results 及本交接文件為準。這份交接沒有更改已核准文件的歷史內容。

## Assumptions & Open Questions

None.
