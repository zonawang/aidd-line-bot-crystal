# Zona Crystal — Reliability Design（U1）

## Sources

- [nfr-design-questions.md](nfr-design-questions.md)：已確認最小設計。
- [performance-requirements.md](../nfr-requirements/performance-requirements.md)、[security-requirements.md](../nfr-requirements/security-requirements.md)、[scalability-requirements.md](../nfr-requirements/scalability-requirements.md)、[reliability-requirements.md](../nfr-requirements/reliability-requirements.md)、[observability-requirements.md](../nfr-requirements/observability-requirements.md)、[tech-stack-decisions.md](../nfr-requirements/tech-stack-decisions.md)：25 項要求與技術界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)、[components.md](../../../inception/domain-design/components.md)：功能、接口及四元件唯一擁有權。

## Design Solutions

| Solution | Requirement | 決策／驗證 |
|---|---|---|
| REL-01 | NFR2.5 | ConversationMemory read 區分 ENOENT→empty、合法 schema→loaded、其他錯誤→read-failed；同人 queue 範圍包含 read→process→save。save 投影 schemaVersion=1、revision+1，以唯一私有暫存檔寫完再 rename 覆換本人 JSON。新程序先讀，損壞檔不清空／覆寫。 |
| REL-02 | NFR2.6 | 寫前驗 deadline；已提交 save 的 underlying Promise 與 bounded await 分離。bounded await 超時標 outcome-unknown，pendingWrites[userKey] latch 留著；為原 Promise 附 success／reject handler，真 settled 後清 latch。latch 存在的後項不啟動持久 read/save，以 read-failed／未確認保存狀態明示，只可非持久諮詢。解鎖後下一項先重新 read。 |
| REL-03 | NFR2.7 | 外部主模型、追問、LINE與持久共享 PERF-01；可用 abort／timeout＋忽略晚到結果。無自動 retry、副作用 replay或通用 circuit breaker。主模型失败回安全錯誤；主答成功但三題不足／追問失敗，以三個相關替代題並標示；loading失败不中斷主答。 |
| REL-04 | NFR2.8 | 同程序 eventId Map 記 in-flight／delivered；重送已 delivered 略過，in-flight 不再啟動。failure 不假標 delivered；原操作確定失败可釋放待平台重送；reply outcome-unknown 保留原在途追蹤直到底層 settled，未知時不自動 replay。批次逐項 bounded awaited，未交付回500；不在回200後啟動新工作。 |
| REL-05 | NFR2.9 | UI user＋generation guard、清舊視圖／abort，A save 若已提交只對 A；B read 取得 B。後端不相信 frontend abort 代表 A 已回滾。 |
| REL-06 | NFR5.3 | Result／memoryStatus.read/write／menu/loading 各自反映事實；只 explicit confirmed success 才 saved。已知拒絕 write-failed、未知 outcome-unknown。讀錯不把未知原記憶當 empty；UI與LINE答案旁有未保存／模擬／外部失敗文字。 |

## Atomicity & Legacy Persistence

本機 rename 只避免一般中斷的半份 JSON，不承諾斷電零損失；.tmp 失敗盡力移除自己暫存、不得移除原檔。Firestore 使用新版專用文件 update，legacy 原事件唯讀投影加入目前模型必要上下文；原 events 不複製進新版 events。實作沿 functional-spec 的來源 sourceRef／時間／映射，不從舊文字猜生日。

## Health, Recovery & Backup

health 僅程序 alive；read-failed 以明示非持久服務保留基本諮詢，保存生日／卡／模式等需要重讀成功。未知 write 永不 settled 時本人維持受限預覽，不阻擋其他人。操作者可停止程序、保留私有檔做手動備份／檢查，再用同版本重啟 reread，不自動重設／retry。回退改用先前通過版本且保留私有資料，版本／可執行命令在交付補上。

## Verification Handoff & Limits

實際子程序重啟／損壞 JSON／寫拒絕；inject 超時晚成功、晚拒絕、永未完成，驗 latch／無第二寫與其他身分可用。LINE duplicate／missing ID／批次交付失敗與未知結果替身檢查。跨程序重啟、缺 eventId、供應商結果未知可能重送，無 exactly-once／SLA／RPO／RTO；delivered map 在單程序展示期留存，重啟不保證防重。

## Assumptions & Open Questions

None. SDK timeout 不等於取消，所有晚到 promise 被觀察但不改已結束顯示；外部實測分列。
