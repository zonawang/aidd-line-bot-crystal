# Zona Crystal — Scalability Design（U1）

## Sources

- [nfr-design-questions.md](nfr-design-questions.md)：已確認最小設計。
- [performance-requirements.md](../nfr-requirements/performance-requirements.md)、[security-requirements.md](../nfr-requirements/security-requirements.md)、[scalability-requirements.md](../nfr-requirements/scalability-requirements.md)、[reliability-requirements.md](../nfr-requirements/reliability-requirements.md)、[observability-requirements.md](../nfr-requirements/observability-requirements.md)、[tech-stack-decisions.md](../nfr-requirements/tech-stack-decisions.md)：25 項要求與技術界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)、[components.md](../../../inception/domain-design/components.md)：功能、接口及四元件唯一擁有權。

## Design Solutions

| Solution | Requirement | 決策／驗證 |
|---|---|---|
| SCALE-01 | NFR5.1 | 一個 Node/Express 應用，四邏輯元件同程序，單 writer；本機檔與 Firestore 是選擇其一的 adapter，不雙寫。無 load balancer／自動 scaling／多程序部署。 |
| SCALE-02 | NFR5.2 | userKey→queue Map 僅串同人，A／B／LINE不同身分互不等待；queue 尾 Promise 在 settled 且仍為 tail 時移除。五個並行請求含同人更新及不同人，驗 revision／turns與身份。 |
| SCALE-03 | NFR2.4 | 每個排隊項有自己的入口 deadline，隊列到期即停止，不啟動 read／save；pending-write 時另走受限非持久分支，而非無限 queue 堵住所有人。詳 REL-02／PERF-01。 |

## Capacity, Partitioning & Scaling Triggers

每人私有檔名按 namespace/userKey digest 分割，非分散式 shard。必要回合按原需求保留、不新增截斷上限；沒有第六個請求拒絕規則。展示10次純本機操作／5個併發測量資料與錯誤狀態；資料成長造成延遲超標時記錄優化事項、限制擴大展示，不擅自刪記憶或減原功能。擴展需另立工作，不能啟動多個程序共享同一 MEMORY_DIR。

## Trade-offs

單 writer 操作簡單且易測，代價是沒有多程序一致性／HA。每人隔離處理只限程序內；私有 JSON 為展示資料量設計，正式容量／分頁／索引／自動擴展延後。

## Assumptions & Open Questions

None. 沒有新增正式 QPS 或可用率承諾；併發測試結果待實作後記錄。
