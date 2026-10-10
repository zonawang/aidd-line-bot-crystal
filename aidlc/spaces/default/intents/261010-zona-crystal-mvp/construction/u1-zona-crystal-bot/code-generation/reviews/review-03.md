## Review

**Verdict:** READY
**Reviewer:** aidlc-architecture-reviewer-agent
**Date:** 2026-10-10T11:03:57Z
**Iteration:** 1

### Findings

本輪對應 requestId `review:2b17e892d9b30156997c97b61830c073`。重新讀取指定 stage、Q&A、四項產出、source-manifest 的53個應用路徑及 dispatch 的上游契約；對現有 main 執行一次既有 Unit 檢查。依 dispatch 保留歷史 R-01–R-03 識別與實際狀態；本輪未新增 probe、修改應用或重建 MVP。先前獨立 probe 與本輪結果分列，不將歷史證據當作本輪重新執行。沒有人工 Accepted risk 處置。

| ID | Severity | Location | Finding | Required action | Status |
|---|---|---|---|---|---|
| R-01 | Major | src/bot-experience/line-adapter.js > webhookHandler record registration before remaining(deadline)／known.response guard | 已知 reply 拒絕可由平台重送原計算結果的修正仍存在，且本輪回歸通過；但前項耗盡整批 deadline 後，第二項先登錄 in-flight，再由 remaining 拋錯，catch 留 failed 且無 response。重送被 known.response guard 略過，未開始事件無法恢復。先前 main 獨立 probe：deadlineMs=5、前項等10ms，batch=500、redelivery=500、calls=['slow']；本輪唯讀追蹤確認此分支仍存在，未重跑 probe。違反 aidlc/spaces/default/intents/261010-zona-crystal-mvp/inception/contract-design/contract-summary.md > C2「預算不足不開始新項，未交付項可回500讓平台重送」。現有 batch 測試只驗第二項未開始，未驗其後重送。 | 對工作尚未開始且預算已耗盡的事件，不留下永久 failed 記錄，或定義可安全重新處理的未開始狀態；後續修復補前項耗盡預算、第二項未執行及新批次重送成功的測試。維持已計算 response 快取及未知交付不重播。 | Unresolved |
| R-02 | Major | src/bot-experience/line-adapter.js > webhookHandler missing webhookEventId branch | 缺非必填 event ID 的合法支援事件仍正常處理；key=null 不建立共用或偽造防重鍵。本輪既有回歸確認兩位可信 userId 分別回覆，缺 ID 重送仍被處理。先前 main 獨立 A／B／A probe 為歷史補充，非本輪執行。 | 已完成；保留缺 ID 與跨重啟防重限制，不宣稱 exactly-once。 | Resolved |
| R-03 | Major | src/bot-experience/line-messages.js > mandatory notice reservation／body capacity | 必要 evidenceLabels、保存、menu／external 狀態先預留，再限制正文及 Flex。既有30000字、含／不含 Flex 回歸本輪通過，來源及保存未知等狀態保留，明示正文截短，總訊息≤5、每則文字≤5000。先前40000字獨立 probe 為歷史補充，非本輪執行。 | 已完成；維持必要標示優先及正文截短提示，必要標示本身不可呈現時明確拒絕。 | Resolved |

### Validation Tool Results

| Tool | Result | Interpretation |
|---|---|---|
| node scripts/u1-zona-crystal-bot/check.mjs（本輪 main，執行一次） | PASS，exit0；Prettier、ESLint；64 tests／64 pass／0 fail／0 skip；warm10ms=[3,3,5,4,4,3,3,3,4,6] | 獨立現有檢查，包含實際 HTTP、子程序重啟與 A／B、期限／未知保存、SDK替身、DOM及三項既有回歸。不以歷史 receipt 代替本輪測試。 |
| Python 唯讀 traceability／manifest 核對 | PASS：100唯一 upstream IDs＝52AC＋25NFR＋23BR；100 coverage targets 存在；53個 manifest 路徑存在 | 追溯及宣告來源集合完整；存在的 target 表示映射，不代表真外部或完整視覺驗證。 |
| 指定來源與上游契約唯讀審查 | R-01殘餘路徑仍存在；R-02／R-03修正及回歸仍存在；runner 明列九個測試檔且任一非零即停止；CI執行相同 check:u1 | 一個 Unit、四同程序元件與單 writer 邊界一致。R-01不能由64項通過推論已修復。lock以JSON解析核對，二進位素材以檔頭及摘要核對，未將素材摘要當完整視覺證據。 |
| 先前 main 獨立 LINE probes（歷史證據，非本輪重跑） | R-01未開始事件500→500；reply已知拒絕500→200且interactions=1／replies=2；缺ID A／B／A；40000字含／不含Flex；pending／unknown不重播且晚成功可200 | 本轮僅以目前原碼及既有測試重新核對適用性，保留先前已重現缺陷及證據邊界，不新增 probe 或聲稱重新重現。 |

### Summary

零 Critical、一項 Unresolved Major，依固定零 Critical／≤2 Major門檻判定 READY；R-01仍是未修復的產品缺陷，沒有獲得人工風險接受。後續品質與交付紀錄須保留「批次逾時後尚未開始的 LINE 事件可能永久500」限制。

真 Gemini／Vertex／Firestore／LINE，以及精確375／1280完整視覺與完整人工鍵盤仍未驗證；本輪本機／替身證據不替代這些結果。只写本輪指定 review，未修改來源、資料或其他 stage 產出，未操作現有8080展示服務。
