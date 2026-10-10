# Zona Crystal — Observability Requirements（U1）

## Sources

- [requirements.md](../../../inception/requirements-analysis/requirements.md)：NFR1–NFR5，全部原功能保留。
- [contract-summary.md](../../../inception/contract-design/contract-summary.md)：C1–C5、大小／期限／身分／證據界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[rules.md](../functional-design/rules.md)：同身分序列化、未知寫入、legacy 唯讀及 UI 世代。
- [nfr-requirements-questions.md](nfr-requirements-questions.md)：本階段自主採用預設，摘要已獲本人確認。

## Requirements & Verification

| ID | 要求 | 最小驗證 |
|---|---|---|
| NFR5.4 | 結構化日誌能區分啟動、成功、拒絕、外部失敗／逾時，白名單只有 requestId、動作種類、耗時、安全 error code、記憶／外部狀態。 | 真實啟動及控制成功／失敗／超時，驗白名單及虛構秘密 marker 無洩漏。 |
| NFR5.5 | 健康端點只回程序可用狀態，不回秘密、檔案路徑、生日／歷史或 userId，不宣稱外部依賴可用。 | 實際 HTTP health 與配置不足的結果；provider 未測不報已 ready。 |
| NFR5.6 | 交付清單分固定教學範例、adapter 替身、本機實際持久／HTTP／UI、真實外部與手機結果；未驗證標明，不冒充通過。 | README／測試報告逐項命令、環境、exit code、證據來源及限制。 |
| NFR3.1 | 本機／CI 同一可重現檢查；每項可測需求有測試、各四元件至少正常路徑，保留 17 stories／52 AC 對照及適用 lint／format 底線。失敗阻擋合併。 | 執行核准後的命令，記錄來源／結果／需求映射；不新設覆蓋率百分比。 |
| NFR4.1 | 375／1280 寬度可操作、主要動作鍵盤可達，有標籤／focus／圖片 alt；等待與錯誤有文字、繁體中文角色／水晶可讀。 | 實際操作生日、卡、追問、選單、圖片、A／B、Echo，記錄瀏覽器／寬度；DOM 替身證據分列。 |
| NFR4.2 | 範例回覆、圖片範例、LINE 模擬、替代追問有既定可見標示；real 缺配置／失敗不顯示為外部成功。 | 固定例子及 real failed 分支，UI／LINE payload 檢查可見標示。 |

## Monitoring, SLI & Alerts

展示診斷量只有各動作耗時、成功／失敗代碼及持久狀態，用於排查及本機 2 秒目標；不建立正式 SLI／SLO、dashboard、分散式 tracing 或自動告警。操作者依終端及畫面錯誤處理。無公開日誌 API。全部日誌採允許欄位，不能直接序列化 request／provider error 或 conversation。

## Assumptions & Open Questions

None. 建構驗證命令仍需在實作後依既定流程本人確認，本文件不代替該核准。無 WCAG 認證或正式監控平台承諾。
