**Collaborator:** aidlc-developer-agent

## Contribution

已獨立讀取四份初稿、practices-discovery 階段規定、active state、org／team／project 與 inception 規則，以及最新 scope-document、initiative-brief；未讀其他協作者貢獻、未重掃舊 repo、未讀寫階段日記。workspace 為 Greenfield，尚無應用程式可證明實際命名、分層、格式或錯誤處理慣例；以下是最小建議，不能冒稱既有事實或人工硬性約束。

- 命名：同意 JavaScript 的 camelCase。新增函式以動作與內容命名，布林值用 is／has 前綴；既有 LINE action、角色標籤及選單切換識別保持相容，不為統一風格全面改名。來源：team-practices 的 Code Style、scope-document 的保留可觀察行為。
- 邊界：單一應用程式足夠。生日／生命靈數／選卡邏輯、本機與真實 LINE／模型串接、記憶讀寫應可辨認；本機及 LINE 儘量共用功能邏輯，差異集中於輸入輸出與外部呼叫。這是可測試的最小邊界，毋須引入完整多層框架或微服務。來源：CAP1–CAP9、initiative-brief 的本機與外部證據分列。
- 錯誤：輸入入口驗證真實曆日與必要欄位；可復原錯誤提供重試方式。模型／LINE 失敗須結束等待狀態；記憶讀寫失敗須明示，不能回覆保存成功；外部失敗不悄悄換成成功範例。後續需求與測試明訂對應行為即可，毋須先建立複雜錯誤類別系統。來源：CAP3、CAP7、CAP8 及初稿 Code Style。
- 檔案：按功能集中少量程式與對應測試，公開素材與設定／記憶資料分開；不把專案根目錄當作靜態檔案目錄。保留既有素材與可追溯來源，避免整套搬移與重構。來源：CAP6、CAP9、初稿的一日整合與可公開素材界線。
- 訪談缺口：五項慣例仍待人工作答，其中 Code Style 可確認「沿用 JavaScript 與實際設定；若無設定補最小格式／lint 檢查」這個建議。套件、import 形式及工具版本留到實作檢查，不增加獨立架構問卷。A／B 身分與四角色示例已核准要補入需求，不重新詢問保留與否。

## Positions

AGREE: team-practices 的 Code Style 採既有 JavaScript 與設定優先，並且不全面改寫或改名；符合 org 的語言慣例與一日全功能範圍。

AGREE: 最薄端到端切片僅決定實作順序，不取代全部 CAP1–CAP10 完成條件；scope-document 與 initiative-brief 均明確要求全部整合。

AGREE: test-after 的 Methodology／Ordering 分開記錄；故事 Given／When／Then 不自行改變程式測試順序。正式 Code Generation 仍以當次工具產出的 Testing Contract 為準。

AGREE: discovered-rules 只納入有人工來源的硬性要求；上述開發建議應放入待確認慣例或後續設計，不能直接新增 ALWAYS／NEVER 規則。
