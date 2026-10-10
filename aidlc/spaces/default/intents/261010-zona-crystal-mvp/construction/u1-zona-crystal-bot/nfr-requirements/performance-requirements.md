# Zona Crystal — Performance Requirements（U1）

## Sources

- [requirements.md](../../../inception/requirements-analysis/requirements.md)：NFR1–NFR5，全部原功能保留。
- [contract-summary.md](../../../inception/contract-design/contract-summary.md)：C1–C5、大小／期限／身分／證據界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[rules.md](../functional-design/rules.md)：同身分序列化、未知寫入、legacy 唯讀及 UI 世代。
- [nfr-requirements-questions.md](nfr-requirements-questions.md)：本階段自主採用預設，摘要已獲本人確認。

## Requirements & Verification

| ID | 要求／界線 | 最小驗證 |
|---|---|---|
| NFR2.1 | 後端互動從接受請求起共 30 秒；同身分排隊、讀寫、主模型／追問共享絕對期限。整批 webhook 同樣共 30 秒，沒有逐步重設預算。 | 控制慢讀／排隊／模型及批次，期限耗盡不啟動下一副作用；驗晚到不顯示／不保存。 |
| NFR2.2 | 前端 35 秒內釋放等待，所有成功／拒絕／逾時以 finally 等有限路徑恢復操作；不自動重送 POST。 | 成功、失敗、超時後可再操作；舊世代結果不污染新身分。 |
| NFR2.3 | 固定範例且無外部呼叫的純本機動作，啟動暖機後 10 次順序操作每次 2 秒內。這是展示驗收目標，不是模型或正式 SLA。 | 記錄機器、Node 版本、動作、10 次 elapsed 與 exit code；超標優先簡化非必要工作，不能假稱通過。 |
| NFR1.5 | 本機文字最多 4000 字元、解碼圖片最多 5 MiB、整份 JSON body 最多 8 MiB；驗 MIME 與檔頭，拒絕不合規輸入。LINE 回覆遵平台長度／數量限制。 | 邊界／超量／格式錯與真實 bytes 的 adapter 檢查，不將本機文字限制當平台規格。 |

## Budgets & Resource Boundary

單 Node 程序，原生 UI，圖片只在當次處理保有 bytes。5 MiB 圖片的 base64 可容納於 8 MiB body；body 在解析前限制，圖片解碼後再驗限制。使用可取消的供應商 timeout／abort，不能將 Promise 超時等同供應商真的停止。實作中若已提交持久寫入未完成，依 reliability-requirements.md 的未知結果保護，不開始後續寫入。

## Assumptions & Open Questions

None. 外部延遲不受本機 2 秒目標約束；本文件未執行性能測量、不宣稱應用已通過。正式效能／CPU／RSS／負載調校延後，不刪原功能。
