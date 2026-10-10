## Review

**Verdict:** NOT-READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-10-10T10:30:22Z
**Iteration:** 1

### Findings

Location 的來源路徑相對於本輪 Bolt worktree：`.aidlc/worktrees/bolt-c15a7fe4_zona-crystal-full-demo`。所有 probe 只使用虛構身分／秘密與注入 adapter，沒有連外或寫應用檔。

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | src/bot-experience/line-adapter.js:188 > webhookHandler known／failed delivery branches | 明確失敗的事件也永久留在 deliveries。第一個 reply Promise 已拒絕後 record.status=failed；同 event ID 再來仍被 known 分支略過並回500，永不嘗試交付。唯讀 probe：第一次500、第二次500、interactions=1、replies=1，即使替身第二次本可成功。契約 contract-summary.md > C2 允許未交付項以500交給平台重送，functional-spec.md > Ordered Entry & Dispatch Flow／Lifecycle State Machines 要求失敗後可恢復；現有 test 只證明不重播未知結果，沒有驗已知拒絕後恢復。 | 明確區分已確認未交付、仍在途、未知結果與已交付；平台重送已知失敗時提供可恢復交付路徑，保留已完成的結果／副作用資訊以免重複持久寫入。仍在途或未知交付不可重播。補測第一次明確拒絕、平台重送後成功及持久副作用不重複。 | New |
| R-02 | Major | src/bot-experience/line-adapter.js:183 > webhookHandler missing webhookEventId | 合法已驗事件缺 webhookEventId 時直接 continue 並回500，完全不執行功能。probe 使用有效簽章、userId、replyToken 與文字，僅省略 event ID，結果500且interactions=0。contract-summary.md > C2 的 Event schema 未將 webhookEventId 列必填，且明列「缺事件ID…仍可能重送」的限制；此實作卻把防重能力不足變成拒絕原功能，不符合已確認入口契約。 | 依契約處理缺 ID 的合法事件，缺 ID 時明確採無穩定防重保證的受限路徑，仍維持可信身分、期限與副作用規則；不要以共用／偽造穩定 ID 混合不同人的事件。補有效缺 ID 事件的實際處理／交付測試，文件保留重送限制。 | New |
| R-03 | Major | src/bot-experience/line-messages.js:48 > four-text-message truncation | 將 r.text、evidenceLabels、memoryStatus.message 串接後只取前4×4900字，長答案／累積 recall 將來源及保存狀態全部截掉。probe：20000字答案＋「教學替代問題」＋「未能確認保存」輸出4則、19600字，兩標示皆不可見。契約 contract-summary.md > C1／C3／Error, Timeout & Retry Rules 要求來源可見與保存獨立標示；security／performance 上游未設定模型輸出19600字上限。這會將未確認保存呈現成只有答案，亦遺失必要教學來源。 | 在LINE的訊息數／長度預算內先保留全部必要來源、保存與外部狀態，再分段或明示截短正文；不能默默刪除必要標示。補超過19600字、保存未知及替代追問來源的payload測試，驗必要文字可見且每則與總數符合平台限制。 | New |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| npm run check:u1 | PASS，exit0；Prettier、ESLint、61 tests／61 pass／0 fail／0 skip；暖機10次ms=[6,9,3,11,7,3,4,2,2,3] | 真HTTP、子程序重啟、私有fs、身分隔離、未知寫入與DOM測試有實際assertions，並非空測試；但現有LINE測試未攔下三個probe缺陷 |
| Python 唯讀 traceability／manifest 檢查 | PASS：100唯一ID=52AC＋25NFR＋23BR；100 coverage rows status=OK，target檔存在，所有ID在plan列出；53 manifest路徑唯一且實際存在 | 結構映射完整，檔案存在不保證每個未測邊界正確；三項缺陷有runtime probe而非bookkeeping依據 |
| Node 唯讀已知失敗重送 probe | FAIL：500→500，interactions=1，replies=1 | 明確拒絕後同事件永久不能恢復，確認R-01 |
| Node 唯讀有效缺 ID probe | FAIL：500，interactions=0 | 有效事件因非必填ID缺失被拒絕，確認R-02 |
| Node 唯讀長 LINE payload probe | FAIL：4訊息／19600字，evidenceVisible=false，memoryStatusVisible=false | 正文截斷丟失必要狀態標示，確認R-03 |

### Summary

三項可重現 Major 超過 READY 門檻，因此本輪 NOT-READY。主要實作的持久序列／pending-write、驗簽、私有檔、確定性內容及本機教學都有有意義的測試；修正應集中於LINE事件恢復與輸出預算，不需要增加正式部署、分散式平台或SLA。

code-summary 已明列真 Gemini／Vertex／Firestore／LINE及精確375／1280完整視覺／鍵盤尚未驗證，DOM與替身亦沒有冒充外部通過；這些已記錄的證據限制不作本輪缺陷。既有check通過也不能抵銷上述已證實的產品／契約行為缺口。
