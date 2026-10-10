# Zona Crystal — Performance Design（U1）

## Sources

- [nfr-design-questions.md](nfr-design-questions.md)：已確認最小設計。
- [performance-requirements.md](../nfr-requirements/performance-requirements.md)、[security-requirements.md](../nfr-requirements/security-requirements.md)、[scalability-requirements.md](../nfr-requirements/scalability-requirements.md)、[reliability-requirements.md](../nfr-requirements/reliability-requirements.md)、[observability-requirements.md](../nfr-requirements/observability-requirements.md)、[tech-stack-decisions.md](../nfr-requirements/tech-stack-decisions.md)：25 項要求與技術界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)、[components.md](../../../inception/domain-design/components.md)：功能、接口及四元件唯一擁有權。

## Design Solutions

| Solution | Requirement | 決策／驗證 |
|---|---|---|
| PERF-01 | NFR2.1、NFR2.4 | HTTP 接受動作時建立一次單調時鐘絕對 deadline = now + 30000ms；整份 webhook 批次共用同一期限。排隊、read、模型主答／追問、save、LINE 各次呼叫只取 remaining，不重設。expired 就不啟動下一操作；受控時鐘＋慢步驟／排隊驗證。 |
| PERF-02 | NFR2.2、NFR2.9 | UI 每次請求綁 user＋generation，35 秒 AbortController timeout，finally 僅對仍屬此世代的請求清 waiting；切 A／B 立即清全部舊視圖與自增 generation／abort，忽略遲到回覆。前端 abort 不代表後端副作用取消。 |
| PERF-03 | NFR2.3 | 確定性生日／卡／指南與 example 不呼叫外部。process 內只讀靜態池，不導入 Redis、CDN、模型結果快取；HTTP 測 10 次暖機後順序本機動作均 ≤2s 並記錄機器／版本。 |
| PERF-04 | NFR1.5 | Express JSON body 8 MiB limit、文字 4000 字元、base64 嚴格格式／decode≤5 MiB／MIME與檔頭一致；LINE image 串流讀到上限即中止，不能先無限下載再驗。採限制後的暫存 bytes，處理後釋放。 |

## Async Calls & Resource Use

只使用 SDK 客戶端連線重用，不新增自訂 pool／worker；client 延遲建立，example 無憑證也能啟動。remaining 以整數毫秒交 adapter，adapter 使用支援的 timeout／abort，外层 bounded await 加結果世代保護。不能以 Promise.race 宣稱 SDK／寫入已取消；未知寫入保護詳 reliability-design.md。所有 rejected／late Promise 有處理，避免 unhandled rejection。

## Trade-offs & Verification

不用 API／conversation 快取，確保每個操作先讀目前身分資料；不設計正式 QPS／P99。五併發只驗隔離及有限排隊。實作後記錄實際量測，超過目標先減非必要工作、不可減原功能或修改門檻冒充 pass。

## Assumptions & Open Questions

None. 這是設計，不是量測證據；SDK 精確版本由後續 lock 固定。
