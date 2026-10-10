# Zona Crystal — 交付順序與風險

## Sources

- [delivery-planning-questions.md](delivery-planning-questions.md)：先打通主旅程、完整交付與一天上限。
- [bolt-plan.md](bolt-plan.md)、[dependency](../units-generation/unit-of-work-dependency.md)、[story map](../units-generation/unit-of-work-story-map.md)：唯一B1／U1與零依賴。
- [requirements.md](../requirements-analysis/requirements.md)、[contract-summary.md](../contract-design/contract-summary.md)、[team-practices.md](../practices-discovery/team-practices.md)：持久／身分、真實失敗、有限等待、安全與測試底線。

## Sequencing Heuristic & DAG Conformance

Bolt是一次以可運作成果結束的建置批次。本次按使用者既定價值優先，採Cockburn的最薄整合切片原則：先可展示生日三卡的端到端整合，接著盡早驗證高影響的持久重啟與身分隔離，再補齊其他功能。這是最薄旅程優先加必要風險前移，不是另作市場價值假設；正式walking-skeleton儀式仍依適用政策。

只有一個U1／B1，沒有可排序的其他Unit，故不計加權分數或捏造多批次成本資料。沿用[story map](../units-generation/unit-of-work-story-map.md)的Unit內次序；正式依賴圖為單節點零邊，沒有拓撲偏離。最薄旅程不改17故事全Must，也不能以初期可展示為最終完成。

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation / ten-minute fallback |
|---|---|---|---|
| 原功能多、流程核准耗掉實作時間 | Medium | High | 每階段只寫足夠內容；不重問既定方向，優先實作；砍裝飾／重構／正式部署，不延長8小時 |
| 重啟空狀態覆寫或A／B跨讀 | Medium | High | 唯一記憶擁有者、先讀再寫；實際持久資料與新實例／重啟盡早驗證，失敗不宣稱保存 |
| 模型／LINE／Firestore無安全存取 | High | Medium | 無金鑰本機範例＋實際本機儲存與適配器替身；保留真實路徑，外部未測明列，不等待雲端設定擠掉交付 |
| 供應商或依賴調查超時 | Medium | High | 單項十分鐘停損；沿用可用SDK或最簡適配，不全面重構／新增平台；仍衝突就回報具體原功能缺口 |
| 外部逾時後晚到結果／未知提交 | Medium | High | 共用deadline、清除UI等待、晚到結果不當新回覆，保存outcome-unknown不重送；最小序列化於設計落地 |
| 公開教學身分或專案根目錄靜態暴露 | Medium | High | 公開LINE模式停用demo API，驗簽後採平台身分；只公開素材，受限路徑／秘密與日誌檢查 |
| 原圖片／頭像來源失效 | Medium | Medium | 保留名稱、文字與可操作入口；先重用素材，不為裝飾或下載超過十分鐘；來源與未驗證限制保留 |
| 只驗按鈕存在／只驗主旅程 | Medium | High | 逐卡／逐追問／四角色／六指南實際觸發，32需求與52AC對照、全功能整合及錯誤後恢復 |
| 沒有Git HEAD或npm cache權限問題 | Medium | Medium | 先檢查忽略／秘密後建立基準；使用工作區／task tmp可寫cache，不修系統權限或延伸調查 |

## Go / No-Go

Go：追溯完整且U1可獨立執行；Construction依已核准最小設計開始。本機與外部證據分開，缺外部憑證不阻擋明示範例展示。

No-Go for completion：任一Must缺少實作或驗證、持久／隔離錯誤、無限等待、真實失敗冒充成功、秘密暴露，或必要人工作答／檢查未完成。先修影響核心功能的問題；到時限仍未達成則交代具體缺口，不冒稱完成。

## Deferred Improvements

正式雲端／高可用／擴展、跨程序exactly-once、背景佇列、完整監控／掃描平台、廣泛負載／相容矩陣、品牌裝飾與全面重構延後。這些不替代已核准的最小安全、有限等待、持久隔離或全部原功能驗收。

## Assumptions & Open Questions

None. 風險等級為本次規劃判斷，不是量測機率或正式SLA；執行結果仍待證據。
