# Zona Crystal — NFR Design Questions（U1）

## Decision Basis

本階段依已記錄 autonomous 政策選最簡方案；以下是自主採用預設，不是逐題人工回答。承接已確認 NFR Requirements 的全部 25 項要求，17 stories／52 AC 與原功能不減。

來源：本 Unit nfr-requirements 六份產出、functional-design/functional-spec.md；inception/contract-design/contract-summary.md、domain-design/components.md。僅設計，應用程式碼與執行測試在 Code Generation／Build and Test。

## Q1 — Deadline, Persistence & Failure Isolation

如何以最少機制落實有限等待與實際記憶？

- A. 單 Node 程序、依 userKey 的 Promise 序列化；一個接受請求時建立的絕對 30 秒 deadline，各步驟只取剩餘時間。外部 adapter 有 timeout／AbortSignal，晚到結果忽略。ConversationMemory 私有每人 JSON 使用暫存檔＋rename；已提交寫入若逾時保留 pending-write latch，直到原 Promise 真正 settled 才解鎖，再讀回；其他人及明示不持久預覽可繼續。
- B. 加佇列服務、分散式鎖與多程序架構。
- X. Other (please specify)

[Answer]: A. 每人序列化、共用期限與私有 JSON／pending-write 保護。

隊列等待也計入 deadline；超時釋放 HTTP／UI 不表示底層寫入已取消。損壞資料 read-failed，不清空檔案；FireStore 讀 legacy 及新版獨立 session，先讀再寫、無雙寫／自動 retry。沒有持久權限／讀回時不能猜生日、Echo 模式或有效卡；僅明示非持久諮詢，依上游規則處理。前端 35 秒 abort／finally、身分 generation 隔離。

## Q2 — Security, UI & Diagnostics

如何以最少措施落實入口、介面與證據界線？

- A. Express webhook raw body 限制→簽章→JSON→事件驗證；安全常數時間比對。demo 路由在公開 LINE 模式直接 404，loopback 預設；本機 demo Host 限 localhost／127.0.0.1／IPv6 loopback、若有 Origin 必須同源，POST 只接受 JSON、不啟用跨源 CORS。靜態只開 public 明確素材、dotfiles／穿越拒絕。文字用 textContent、圖 URL 白名單、本機安全 headers；必要資料／日誌投影採欄位白名單。
- B. 新增登入、網路平台、正式安全／監控系統。
- X. Other (please specify)

[Answer]: A. 入口驗證、同源 demo、私有資料及安全顯示／日誌白名單。

驗 bytes／MIME／大小沿用已確認限制，公共 URL 及 sender 素材只從配置／既有資料選，模型文字不能提供任意 script／URL。視圖使用上游 C1 ModeIdentity、C2 MessageComposer、C3 BirthdayInput、C4 CrystalCards、C5 ReplyFollowUps、C6 MenuGuides、C7 StatusTeaching。原生控制／label／focus／alt、aria-live 文字狀態，375／1280 寬度實測；無 WCAG 認證。日誌只 requestId／動作／耗時／安全代碼／讀寫與外部狀態，健康端點僅程序 alive，無對話／生日／userId／秘密。

## Q3 — External SDKs, Component Boundaries & Verification

如何落實真實外部功能而維持一天 MVP？

- A. 沿用四元件與 C1–C5 薄適配。Gemini 用官方 @google/genai 直接 generateContent（不新增 ADK 編排）；Vertex 沿用 @google-cloud/vertexai 1，Firestore 8、LINE SDK 9。原 key／project／location／model／sender 配置與素材保留；伺服器選 example 或 real，real 失敗明示。測試用依賴注入控制正常／拒絕／永未完成及晚到，另外實際 HTTP／新程序重啟／UI 檢查，統一 npm check＋最小 ESLint／Prettier。
- B. 重構新框架、微服務或正式雲端架構。
- X. Other (please specify)

[Answer]: A. 原四元件與薄 SDK 適配、依賴注入及實際本機驗證。

採 @google/genai 是上階段已允許的直接 Gemini SDK 替代，以避免原 ADK 編排依賴；精確版本由安裝 lock 固定。真實圖片送實際 bytes／MIME；原角色／三追問／捷徑、選單、動畫及記憶兼容全部保留。不得用測試替身冒充外部通過。SDK／環境若十分鐘未解即採可用薄適配並記錄限制，不假裝 real 成功。建構驗證命令仍另行本人確認，本題只選設計與測試方向。

## Ambiguity & Contradiction Analysis

- 沒有新增正式吞吐／可用率、快取平台、circuit breaker、背景 worker 或自動副作用重試。
- 所有外部步骤共用 30 秒，前端 35 秒；已提交未知寫入與前端 abort 語義分開。
- 單程序的 pending-write latch 不宣稱跨程序一致性／exactly-once；持久恢復以保留資料重新讀回為準。
- 同源限制只用本機 demo，LINE webhook 保留簽章驗證，不誤要求平台 Origin。
- Google SDK 選擇落成直接呼叫、不新增多 agent 編排；adapter 全功能保留與外部證據分列。
- 無待解設計方向；安裝／憑證及供應商驗證是後續實際執行事項。

## Consolidated Summary Confirmation

- 單 Node 程序與原四元件；每人序列化、共用 30 秒 deadline、35 秒前端恢復與身分 generation。
- 私有每人 JSON 暫存＋rename、真實重啟讀回；未知寫入等待底層完成才解鎖，讀失敗不覆寫；Firestore legacy 唯讀。
- raw-body 驗簽、公開模式停用 demo、loopback／同源入口與靜態白名單；安全文字／診斷及必要資料投影。
- 原生可操作 UI；直接 Gemini／原 Vertex／LINE／Firestore 薄 SDK，全部原功能保留；同一本機／CI 檢查，外部證據另列。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
