# Zona Crystal — NFR Requirements Questions（U1）

## Decision Basis

本階段依已記錄的 Construction Autonomy Mode: autonomous 採用以下 MVP 預設；各題不是使用者逐題回答。保留全部原有功能、17 stories／52 AC；不新增正式容量、SLA 或合規認證承諾。

來源：inception/requirements-analysis/requirements.md 的 NFR1–NFR5；inception/contract-design/contract-summary.md 的 C1–C5；本 Unit functional-design/functional-spec.md、rules.md；已核准一天時限與十分鐘停損。

## Q1 — Performance & Capacity

採用什麼展示運作目標？

- A. 沿用後端互動／整批 webhook 30 秒總預算（含同身分排隊）、前端 35 秒；固定範例的純本機動作以 10 次順序操作每次 2 秒內為驗收目標，測試記錄機器與結果。單 Node 程序、A／B 教學身分；另做 5 個同時本機請求檢查隔離／序列化，不宣稱正式吞吐。
- B. 新增正式負載與可用率承諾。
- X. Other (please specify)

[Answer]: A. 沿用有限等待及單程序教學容量。

容量目標不是用戶功能上限；5 個請求是測試情境，不拒絕第 6 個正常請求。模型及外部供應商只驗有限等待及失敗行為，不要求在 2 秒內生成。輸入上限沿用文字 4000 字元、解碼圖片 5 MiB、JSON body 8 MiB；LINE 訊息分段依平台限制。

## Q2 — Security & Data Protection

採用什麼安全界線？

- A. 沿用 raw-body HMAC-SHA256 webhook 驗簽、可信 LINE userId、loopback 本機示範與公開 LINE 模式停用 /api/demo/*；靜態入口只服務允許素材，秘密留伺服器環境；模型輸出與使用者內容以安全文字呈現。必要記憶保存至操作者依文件重設，原始圖片／token／secret 不保存。
- B. 新增登入平台、正式稽核與合規認證。
- X. Other (please specify)

[Answer]: A. 沿用必要的身分、秘密、素材及記憶界線。

示範 A／B 不能充當公開登入；不將完整對話、生日、圖片 bytes 或秘密寫入診斷。範例／真實模式由伺服器配置控制，缺憑證不偽裝真實成功。不執行舊 setup-rich-menus.js、不刪除舊 Firestore 文件。README 說明必要資料、保存位置／重設與真實模型會接收當前身分必要上下文。

## Q3 — Reliability & Recovery

採用什麼持久及恢復目標？

- A. 本機每身分一份私有 JSON 檔，以同身分序列化及暫存檔寫完後 rename 更新；實際重啟讀回。讀取失敗不覆寫；已提交寫入逾時標 outcome-unknown，阻擋該身分後續持久操作直到底層完成，再重新讀回。Firestore 保留既有唯讀歷史＋新版獨立 session 映射；無自動重送未知副作用。
- B. 新增多程序分散式一致性、HA、備份平台及正式復原 SLA。
- X. Other (please specify)

[Answer]: A. 單程序實際持久、有限等待與明確失敗恢復。

暫存檔 rename 防止一般中斷產生半份 JSON；不保證斷電後零資料損失、跨程序鎖或 exactly-once。損壞檔案明示 read-failed 並保留供操作者處理，不自動清空。未知持久操作若永不完成，該身分維持可辨認的未持久服務；其他身分不受阻擋。回覆交付、保存、動畫／選單狀態分別呈現。

## Q4 — Technology, UX & Verification

採用什麼最小技術與驗證要求？

- A. JavaScript／Node.js 24（目前 v24.18.0）、沿用 Express 4 與 LINE SDK 9；原生 HTML／CSS／JS UI、Node 內建測試、原生 fs 本機持久。真實串接保留 Gemini／Vertex AI、Firestore 與原環境設定；先沿用既有 Google SDK，只有可直接串接的薄適配，不新增 ADK 編排。375／1280 寬度、鍵盤／焦點／標籤／alt、繁體中文與證據標示。每项可測需求及每元件正常路徑有檢查，本機／CI 同一命令。
- B. 換框架、微服務、正式雲端平台與完整可觀測性平台。
- X. Other (please specify)

[Answer]: A. 沿用現有技術，原生 UI／持久／測試及最小外部適配。

真實 adapter 的資料／呼叫／失敗路徑必須存在；憑證不具備時分列外部未驗證證據。保留原四角色、素材及全部功能。測試命令須在實作可執行後另外取得規定的使用者確認；本題不代替命令核准，也不自行新增覆蓋率百分比。

介面視圖 ID 採上游 interaction-spec.md：C1 ModeIdentity、C2 MessageComposer、C3 BirthdayInput、C4 CrystalCards、C5 ReplyFollowUps、C6 MenuGuides、C7 StatusTeaching。承接 Functional Design 評審的 Minor R-01，以此明確映射在後續設計／實作避免同號異義；不改已結案評審文件。

## Q5 — Observability & Deferred Work

採用什麼最小診斷？

- A. 啟動及每請求結果的結構化安全日誌，限 requestId、動作種類、耗時、結果／安全 error code、記憶／外部狀態；健康端點只報可用狀態。以成功、失敗、逾時與虛構秘密標記驗證；範例／adapter 替身／實際外部結果分列。無監控平台或自動告警。
- B. 新增分散式 tracing、正式 dashboard／告警及運維平台。
- X. Other (please specify)

[Answer]: A. 足以展示及排查的安全診斷。

延後多程序部署、正式備份／SLA／負載整備、監控與合規認證；不延後任何原有功能。每項技術問題十分鐘停損，以簡單適配或替代完成並記錄實際限制，不宣稱未實測能力。

## Ambiguity & Contradiction Analysis

- 數量化界線：30／35 秒、4000 字元、5／8 MiB、10 次本機測量、5 個並行測試、375／1280 寬度。
- 不把本機回應目標當外部模型 SLA；不把示範容量當正式吞吐保證。
- 持久原功能與一天時限以原生本機儲存＋薄外部 adapter 兼容；不要求新雲端環境才可展示。
- outcome-unknown、讀取失敗禁止寫入、legacy 唯讀映射與 A／B 世代隔離沿用已確認設計。
- 嚴格驗簽／安全內容／秘密界線是必要底線；正式安全／合規整備另列延後。
- 無待解產品方向或技術選型問題；外部憑證與供應商實測仍是證據限制。

## Consolidated Summary Confirmation

- 全部原功能保留；單 Node.js 24／Express 4 應用，原生 UI、私有本機 JSON 持久與薄 LINE／模型／Firestore 適配。
- 保留後端 30 秒／前端 35 秒及原輸入限制；順序 10 次本機 2 秒目標與 5 個並行請求是展示檢查，無正式 SLA。
- 驗簽、身分隔離、秘密／素材界線、讀失敗不寫、未知寫入不冒稱成功及重啟讀回必須驗證。
- 375／1280 寬度與鍵盤等可操作性、全部可測需求與元件正常路徑、同一本機／CI 命令；命令另行確認。
- 安全診斷與證據分列；正式雲端／擴展／SLA／監控平台延後，不減原功能。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
