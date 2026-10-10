# Zona Crystal — Reliability Requirements（U1）

## Sources

- [requirements.md](../../../inception/requirements-analysis/requirements.md)：NFR1–NFR5，全部原功能保留。
- [contract-summary.md](../../../inception/contract-design/contract-summary.md)：C1–C5、大小／期限／身分／證據界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[rules.md](../functional-design/rules.md)：同身分序列化、未知寫入、legacy 唯讀及 UI 世代。
- [nfr-requirements-questions.md](nfr-requirements-questions.md)：本階段自主採用預設，摘要已獲本人確認。

## Requirements & Verification

| ID | 要求 | 最小驗證 |
|---|---|---|
| NFR2.5 | 本機使用每身分私有 JSON，暫存檔寫完後 rename；重啟／新 instance 先讀回，empty 與 read-failed 分開。讀失敗不寫未知 snapshot；損壞檔保留。 | 實際檔案、新程序重啟、損壞／拒絕讀／寫，正常資料不被空覆寫。 |
| NFR2.6 | 同身分 read→process→save 序列化；寫前期限檢查。已提交寫入超時為 outcome-unknown，沒有回滾／成功宣稱，阻擋該身分下一持久操作直到底層真完成，後續 reread。 | 控制晚到寫成功／拒絕、後項不得重送或覆寫；其他身分可操作。 |
| NFR2.7 | 每個外部呼叫有剩餘預算及可用 timeout／abort；主模型失敗不替成成功範例，追問失敗可保留主答＋標示替代三題。動畫失敗不阻擋諮詢。 | 成功／拒絕／超時替身，後續正常操作、主答／替代題標示與等待清除。 |
| NFR2.8 | LINE 事件同程序以 event ID 追蹤 in-flight／delivered，已交付重送不再寫／回覆；未交付可能回 500。不自動 retry replyToken 或未知寫入。 | 同事件重送、批次中失敗／期限、reply 失敗；跨重啟／缺 ID 的限制明列。 |
| NFR2.9 | A／B 切換清空視圖，結果綁身分＋generation；A 已提交寫入僅保存 A，晚到 A 顯示忽略。 | 在途切换後 B 無 A 資料；A 持久結果可重讀。 |
| NFR5.3 | 回覆交付、保存、選單／動畫狀態各自如實標示；未確認保存不等於成功。 | HTTP 200 答案但 save failed／unknown，以及選單／動畫失敗。 |

## Availability, Recovery & Durability

無正式 SLA／SLO、備份 RPO／RTO 或 exactly-once 承諾。rename 避免一般中斷留下半份 JSON，不聲稱斷電零損失。底層未知寫入若永不結束，該身分維持明示未持久服務、其他身分可用；操作者可停止程序、保留／检查私有檔後重啟重新讀取，不能自動刪除。手動備份／重設說明記錄實际位置，未執行刪除。Firestore 原文件唯讀、新專用 session 更新，原歷史不複製回新版 events。

## Assumptions & Open Questions

None. 真實外部持久／模型／LINE 的可用性依憑證實測分列；adapter 替身不證明供應商已通過。
