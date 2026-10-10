# Zona Crystal — Monitoring Design（U1）

## Sources

- [infrastructure-design-questions.md](infrastructure-design-questions.md)：已確認本機／最小CI方案。
- [performance-design.md](../nfr-design/performance-design.md)、[security-design.md](../nfr-design/security-design.md)、[scalability-design.md](../nfr-design/scalability-design.md)、[reliability-design.md](../nfr-design/reliability-design.md)、[observability-design.md](../nfr-design/observability-design.md)、[logical-components.md](../nfr-design/logical-components.md)：25項NFR的具體機制及同程序界線。
- [components.md](../../../inception/domain-design/components.md)、[functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)：四元件、全部功能與C1–C5。

## Metrics & KPIs

| Metric | Source | Threshold | Why it matters |
|---|---|---|---|
| MON-01 elapsedMs／安全結果 | server投影JSON stdout，UUID requestId／action／errorCode／memoryRead/Write／externalStatus | backend30s總budget；固定例子10次本機每次≤2s驗收，不是正式SLA | 能辨識成功／拒絕／逾時及保存未知；無對話/生日/userId/秘密。 |
| MON-02 process alive | GET /health只{ok:true} | 本機啟動後200 | 只測程序，不代表Google／LINE／Firestoreready。 |
| MON-03 waiting/error／證據標示 | 原生StatusTeaching/C7與LINE結果文字 | 前端35s釋放；模擬／真實失敗／未保存文字可見 | 可恢復下一操作、教學證據來源清楚。 |
| MON-04 acceptance evidence | test report／README evidence matrix | 全部17stories52AC／適用NFR、元件happy path；失敗不可合併 | 本機／替身／外部／手機分列，不以文件或spy假稱外部通過。 |

## Alerts

| Alert | Condition | Severity | Routes to |
|---|---|---|---|
| None | 未配置自動告警平台 | N/A | 操作者閱讀終端與畫面；安全碼提供下一步操作，不發訊息給他人。 |

## SLIs / SLOs

| SLI | SLO target | Measurement window |
|---|---|---|
| 無正式SLI／SLO | 不承諾正式可用率／P99／復原時間 | N/A；本機10次與5並行是驗收情境，非持續監控承諾。 |

## Logs & Tracing

| 項目 | 配置 | 邊界／驗證 |
|---|---|---|
| MON-05 log aggregation | 程序stdout，安全白名單投影，啟動action=start | 不公開logs API，不直接serialize request/provider error。控制失敗與虛構secret marker驗證。 |
| Correlation / tracing | server UUID requestId用於當次安全診斷 | 無OpenTelemetry/X-Ray／分散式平台；不以userId當traceId。 |
| Dashboard | 原C7狀態文字＋終端 | 不建新dashboard；health不顯路徑／設定。 |
| Escalation | 操作者停止／檢查保留記憶／重啟reread | 無自動刪除／retry未知寫入；原程式受限時明示本人非持久，其他人仍可用。 |

## Assumptions & Open Questions

None. 量測、畫面與控制錯誤證據待實際執行；沒有監控或外部服務已ready的宣稱。
