## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-10-10T10:38:20Z
**Iteration:** 2

### Findings

來源路徑相對本輪 Bolt worktree `.aidlc/worktrees/bolt-c15a7fe4_zona-crystal-full-demo`。保留全部原 finding ID；仍有一項部分修正的 Major，未視為已接受風險。

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | src/bot-experience/line-adapter.js > webhookHandler known.status／known.response guard、record registration before remaining(deadline) | 原 reply 明確拒絕後永久500路徑已修：重送使用快取response、新replyToken，probe為500→200、model=1、save=1、reply=2、revision=1；新增menu測試也驗menus=1／saves=1。但未交付恢復仍有殘餘：整批第一項耗盡deadline後，第二項尚未開始interact，卻先登錄record，再由remaining拋錯留下failed且無response。下一個新批次只重送第二項，known.response guard永遠略過。probe：deadlineMs=5，第一項等10ms，batch=500、retrySecond=500、calls=['slow']，second從未被處理。契約C2允許「預算不足不開始新項，未交付項可回500讓平台重送」，此未開始項卻永久無法恢復。 | 縮限修正到尚未開始任何工作／副作用的batch項目：不要在檢查剩餘deadline前將其登錄成永久failed，或明確記錄安全未開始狀態使平台重送可處理。補前項耗盡budget、第二項未執行、新批次重送第二項成功的測試；維持已完成response快取及pending／outcome-unknown不重播。 | Unresolved |
| R-02 | Major | src/bot-experience/line-adapter.js > webhookHandler missing webhookEventId branch | 原缺非必填event ID的合法事件完全不處理已修：無ID採key=null、不進穩定防重Map。獨立probe三個有效事件依A／B／A順序得到200、users=['review-A','review-B','review-A']、replies=3，沒有共用偽ID或跨人合併；新增測試也驗再送無ID事件仍獨立處理。 | 已完成；保留缺ID／跨重啟不保證防重的文件限制。 | Resolved |
| R-03 | Major | src/bot-experience/line-messages.js > mandatory notices reservation／body capacity | 原長正文截斷丟失來源與保存狀態已修：先保留notice訊息，按textSlots與Flex預算明示截短正文。獨立40000字probe，純文字及含Flex均5則、text最大4900字，教學替代問題、未能確認保存、menu outcome-unknown、external failed及截短說明全可見；新增測試逐一驗四種來源標示及≤5則／≤5000字。 | 已完成；維持必要notice優先及明示截短，不以默默刪标示滿足平台上限。 | Resolved |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| npm run check:u1 | PASS，exit0；Prettier／ESLint；64 tests／64 pass／0 fail／0 skip；warm10ms=[8,8,12,4,6,6,3,3,3,4] | 新增三個review回歸測試有實際assertions；原持久、HTTP、UI、SDK替身與deadline路徑維持綠燈 |
| Node 獨立快取交付／副作用probe | PASS：known reply rejection 500→200；實際experience＋conversationMemory的model=1、save=1、reply=2、revision=1 | R-01原reply失敗路徑已修，重送不重複模型／保存；suite另驗menu不重複 |
| Node 獨立pending／unknown probe | PASS：在途／超時未知重送皆500；interactions=1／replies=1；底層晚成功後重送200且仍不重播 | 修正未破壞未知交付保護，不將bounded await逾時當取消 |
| Node 獨立無 ID／長文probe | PASS：無ID按真實身分逐項處理；40000字純文及Flex都保留必要notice、≤5訊息且text≤4900 | 確認R-02／R-03已修 |
| Node 獨立未開始batch項重送probe | FAIL：batch=500、retrySecond=500、calls=['slow']；second從未啟動 | R-01仍Unresolved：已確認沒有開始的事件也被永久failed/no-response攔住；既有suite未覆蓋這個恢復步驟 |
| Python 唯讀traceability／manifest | PASS：100唯一ID／100 coverage，OK target全存在；53唯一manifest路徑全存在 | 結構保持完整，沒有以改映射或減少來源掩蓋失敗 |

### Summary

本輪零Critical、一項Unresolved Major、兩項Resolved，依固定「≤2 Major」門檻判定READY；READY不表示R-01剩餘缺陷已修復或已接受風險。整批預算耗盡後尚未開始的LINE事件仍可能永久500，應在後續品質／交付記錄明列限制，不能只引用64項測試全通過稱LINE恢復完整。

修復已確認不重複已完成模型／保存／menu副作用，未知交付保持阻擋，缺ID逐身分處理，長正文與Flex保留必要標示。真LINE／Google／Firestore與精確375／1280完整視覺／鍵盤證據仍依既有文件列未驗證，本輪不將替身或本機check當作外部通過。
