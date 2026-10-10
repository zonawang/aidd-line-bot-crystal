# Zona Crystal — Scalability Requirements（U1）

## Sources

- [requirements.md](../../../inception/requirements-analysis/requirements.md)：NFR1–NFR5，全部原功能保留。
- [contract-summary.md](../../../inception/contract-design/contract-summary.md)：C1–C5、大小／期限／身分／證據界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[rules.md](../functional-design/rules.md)：同身分序列化、未知寫入、legacy 唯讀及 UI 世代。
- [nfr-requirements-questions.md](nfr-requirements-questions.md)：本階段自主採用預設，摘要已獲本人確認。

## Requirements & Verification

| ID | 要求 | 最小驗證 |
|---|---|---|
| NFR5.1 | 一個 Node 程序與本機教學瀏覽器為容量邊界；A／B 可切換，沒有跨程序／自動擴展承諾。 | 實際啟動、顯示模式；README 說明單 writer 限制。 |
| NFR5.2 | 驗 5 個同時本機請求跨 A／B 的序列化與隔離，同人不遺失更新，慢 A 不使 B 同步阻塞。5 是測試情境，不是拒絕第 6 人／請求的產品上限。 | 併發完成與最終持久 revision／turns／身分；含 A 同身分及 B 請求。 |
| NFR2.4 | 佇列等待算在 30 秒總預算；過期請求不開始新讀寫／模型。 | 慢前項＋排隊逾時，spy 證明後項無副作用。 |

## Data Growth & Scaling Trigger

必要回合保存至操作者重設；不擅自截斷已有記憶或刪原功能。展示使用虛構小量資料；文件提醒私有檔隨回合成長，實際資料過多／記憶讀取或本機 2 秒目標超標時，先停止擴大展示並記錄後續分頁／儲存優化。多 writer／雲端容量需求是下一次工作，不能把單程序讀寫鎖說成分散式一致性。

## Assumptions & Open Questions

None. 沒有正式 QPS、容量 SLA 或百分位延遲承諾；本階段不部署負載平台或自動擴展。
