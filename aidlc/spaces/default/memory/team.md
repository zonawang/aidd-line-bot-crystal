# Team-Level Rules

> This team's affirmed practices and corrections. Loaded after `org.md` as
> strict-additive guidance; contradictions with broader policy are rejected.
> Populated by the practices-discovery affirmation gate. Edit at the gate,
> not directly.

## Way of Working

我們沿用 org.md 的 trunk-based development：以 main 為共同主線，使用短期 Bolt 分支／worktree，驗證完成後 squash 合併至 main；不新增 develop 或長期發布分支。Codex 負責實作與關鍵驗證，使用者處理技能明定的人工作答及必要存取設定。全部 CAP1–CAP10 整合到同一新版，沿用既有實作與素材。

main 尚無 HEAD；Construction 建立 worktree 前先建立可用基準提交。本階段沒有建立分支、提交或 worktree。

## Walking Skeleton

我們先完成最薄的本機端到端版本：啟動 → 生日 → 生命靈數／三張不同水晶卡 → 選卡介紹，先確認各部分接得起來，再補齊其他既有功能。此切片只決定實作先後，不取代 CAP1–CAP10 全功能完成條件；設計文件不是可運作切片。

正式 walking-skeleton 儀式遵循引擎解析的 scope、Unit DAG 及 Construction 政策，不自行推定缺省欄位。啟用時遵守 org.md：首個整合 Unit 先完成適用階段、驗證命令及人工檢查；自治只涵蓋政策允許的檢查點，不能代答計畫、摘要、驗證命令或失敗處理。

## Testing Posture

- **Methodology**: test-after
- **Ordering**: 我們先實作每個適用且可測試的層，再撰寫並執行該層測試，通過後繼續整合。
- 測試量遵循本次 Minimal 策略及所有適用底線，不用新的百分比承諾取代需求驗證。org.md 的 80% 行覆蓋底線明列於 mvp／enterprise／feature／infra／classic；本次是自訂 zona-crystal-one-day，不因名稱含 MVP 擅自套用，若引擎確認另有適用底線則完整遵守。
- 每項可測需求至少一個對應測試，每個可測元件至少一條正常路徑；案例由後續 FR／AC 決定，CAP 數量不是測試數上限。沿用的既有測試保持通過。
- 關鍵路徑涵蓋 CAP1–CAP9：有效／無效生日、三卡與選卡對應、Echo 退出、文字／圖片分支、三個可點追問、四角色、等待結束、雙選單往返與指南，以及重啟記憶／A 與 B 使用者隔離。CAP10 提供可重現啟動與展示說明。
- 本機功能、外部服務及 LINE 手機證據分列；固定 AI／圖片範例與模擬 LINE 操作清楚標示。沒有外部憑證或實測時列未驗證，不把模擬當外部通過。
- 持久記憶使用實際本機儲存、獨立虛構資料與重新啟動驗證；不能只重用同一記憶體物件。記錄 A／B 選擇、目前身分及重啟沿用 A 的步驟；為四角色各附既有規則來源、示例輸入與預期名稱／頭像。本機固定範例和真實模型結果分列。
- 以最少依賴的功能測試及啟動 smoke 建立可重現檢查命令，本機與 CI 共用；關鍵測試及適用 lint／format 失敗阻擋合併，遵循所有適用 CI／覆蓋率底線。命令與工具留待實作和正式授權，記錄執行環境、exit code 及需求對照。
- 少量必要安全驗證涵蓋真實 webhook 拒絕無效簽章、公開素材入口不能讀取設定／秘密／記憶檔，以及秘密不進版本、回覆或日誌。本機 A／B 選擇器只用於教學，不作公開端身分驗證。
- 不新增全量效能、正式營運負載、廣泛相容性測試；已有測試若後續沿用，保持通過。故事的 Given／When／Then 驗收格式不改變上述 test-after 順序。

## Guard Policy

<!-- Affirmed by the team. Mode: strict, relaxed, or off. Strict here holds for every intent and cannot be changed from chat. A section under the retired Change Control heading, written by an earlier release, is still read. -->

## Deployment

我們以本機可啟動、可操作全部功能的展示作此次交付環境，不新增採購或正式雲端部署；本階段不建外部流水線。真實 LINE、模型及持久記憶串接保留，實測依安全存取及公開連線可用性補齊。

若已有 staging，遵循 org.md 的合併後部署及 smoke 檢查；正式環境仍需獨立人工核准，不因缺少 staging 新增多環境架構。本機復原採停止新版、改回前一個已通過版本、重啟與 smoke，保留記憶資料；具體版本及命令於實作後記錄。公開連線前確認本機教學入口暴露邊界。現在沒有部署或復原成功證據。

## Code Style

我們沿用既有 JavaScript／Node 寫法與素材，以單一應用程式整合，不額外導入微服務、框架遷移或全面 TypeScript 改寫。最終技術選擇留待後續最小設計。

依 org.md 優先採用實際 formatter／linter 設定及語言慣例；缺少時補最小 Prettier／ESLint 設定與合併前檢查。採 camelCase、保留既有 LINE 識別相容性；本機與 LINE 共用功能邏輯，外部串接／記憶讀寫保持可辨認，不大幅分層或全面改名。入口驗證真實曆日及必要欄位；錯誤提供重試，外部失敗結束等待、記憶失敗明示，不能靜默換成成功範例。

靜態入口僅提供公開素材；設定、秘密與記憶另置。真實 webhook 驗簽後才使用 LINE 來源身分；秘密由環境載入，範例用占位符，日誌不輸出秘密或完整對話。沿用套件鎖定檔及套件管理器的簡單漏洞檢查，記錄結果；優先處理影響入口、秘密或隔離的問題，十分鐘到限改簡單替代。圖片／文字大小格式檢查與本機文字安全呈現於最小設計落地；非核心 SAST／DAST、SBOM 或掃描平台延後。這些是本次訪談選定的工作慣例，不冒稱先前人工硬性命令或已通過證據。

## Forbidden

<!-- Team-specific forbidden patterns -->

## Mandated

<!-- Team-specific mandates -->

## Corrections

<!-- Self-learning loop appends here. -->
