# Zona Crystal — Observability Design（U1）

## Sources

- [nfr-design-questions.md](nfr-design-questions.md)：已確認最小設計。
- [performance-requirements.md](../nfr-requirements/performance-requirements.md)、[security-requirements.md](../nfr-requirements/security-requirements.md)、[scalability-requirements.md](../nfr-requirements/scalability-requirements.md)、[reliability-requirements.md](../nfr-requirements/reliability-requirements.md)、[observability-requirements.md](../nfr-requirements/observability-requirements.md)、[tech-stack-decisions.md](../nfr-requirements/tech-stack-decisions.md)：25 項要求與技術界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)、[components.md](../../../inception/domain-design/components.md)：功能、接口及四元件唯一擁有權。

## Design Solutions

| Solution | Requirement | 決策／驗證 |
|---|---|---|
| OBS-01 | NFR5.4 | JSON stdout 使用明確投影：requestId（server UUID）、action、elapsedMs、安全 errorCode、memoryRead／memoryWrite、externalStatus。啟動以固定 action=start；不附整個 request／error／conversation、生日／userId／secret。一次請求完成可辨成功／拒絕／逾時；各晚到结果只可安全碼診斷。 |
| OBS-02 | NFR5.5 | GET /health 只 {ok:true} 表示程序活著；不返回路徑／配置／供應商 ready。外部缺設定透過對應操作明確失敗，不把 health 當連通性測試。 |
| OBS-03 | NFR5.6 | 交付 evidence matrix 明列固定範例、adapter spy、本機 HTTP/持久重啟/UI、外部及手機；每次檢查記 command／Node／environment／exit，未測標「未驗證」。|
| OBS-04 | NFR3.1 | package check 組合最小 ESLint／Prettier／node:test／實際 HTTP及restart smoke，CI同一命令；需求/52AC→test map 與四元件 happy path，test-after。正式 Construction Verification Command 本人另外確認，不以本設計冒充授權。 |
| OBS-05 | NFR4.1 | 原生 buttons/input、label、focus-visible、圖片 alt、aria-live 文字 loading／錯誤；375／1280 自適應卡片及可換行問題。鍵盤操作生日／卡／追問／選單／圖片／身份／Echo，圖失敗仍文字可用。 |
| OBS-06 | NFR4.2 | result.evidenceLabels 在 UI／LINE實際訊息可見：教學範例回覆、圖片辨識範例，非真實辨識、LINE 操作模擬、教學替代問題。real主答失敗不換範例；三追問與日期/生命靈數捷徑分開。 |

## SLI, Tracing, Alerts & Dashboard

requestId 只供同一次入口／adapter安全診斷相關性，不傳完整上下文到新追蹤平台。耗時與安全結果用於本機10次測量／控制失敗檢查；無正式SLI／SLO、dashboard／分散式 tracing／告警。終端與原生 StatusTeaching 視圖顯示可採行的下一操作，不需新監控介面。

## UI Identity & Evidence

原生視圖沿權威 mapping：C1 ModeIdentity、C2 MessageComposer、C3 BirthdayInput、C4 CrystalCards、C5 ReplyFollowUps、C6 MenuGuides、C7 StatusTeaching。這是 UI 編號，契約 C1–C5 需明寫「契約」。DOM檢查不是實際手機LINE或瀏覽器操作證據；若瀏覽器無法使用，明列限制，不聲稱實測375／1280及鍵盤。

## Assumptions & Open Questions

None. 應用檢查、實際瀏覽器與外部手機結果待執行；無新增覆蓋率百分比／WCAG認證。
