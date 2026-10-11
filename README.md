# Zona Crystal

同一個 Node.js 程序整合水晶文字／圖片諮詢、生日生命靈數、三卡、追問、四角色、Echo、六指南、雙選單與持久記憶。本機無金鑰可使用清楚標示的教學範例；LINE、Gemini／Vertex、Firestore 真實路徑保留。

公開體驗：[Zona Crystal 教學網站](https://zona-crystal-demo-3sv3zqjszq-de.a.run.app/)。不需登入或金鑰；每個瀏覽器有獨立的 A／B 示範記憶。使用教學範例回覆與圖片範例，請勿輸入敏感資料。

## 本機啟動

需要 Node.js 24（開發驗證：24.18.0）及 npm。

```sh
npm ci --no-fund --no-audit
npm start
```

開啟 http://127.0.0.1:8080 。預設 APP_MODE=demo、BOT_MODE=example、MEMORY_ADAPTER=local；不需要 .env。生日可先輸入 2000-01-01，應得到 4 和三張不同卡，逐卡點選再逐題追問。完整展示流程在 [教學清單](docs/zona-crystal-demo.md)。

```sh
npm run check:u1
npm audit
```

check:u1 共用本機與 CI 的格式、lint 及十個指定測試檔；任一失敗皆回傳非零，CI 阻擋合併。自訂 Minimal 測試策略沒有新增百分比門檻。[API](docs/zona-crystal-api.md) 與 [證據／限制](docs/zona-crystal-evidence.md) 說明邊界。

公開教學網站的部署設定、費用與後續更新方式見 [Cloud Run 部署說明](docs/cloud-run-deployment.md)。

## 設定與真實模式

需要設定時，把 .env.example 的欄位另存為本機 .env，填自己的設定。不要把 token、金鑰或 service-account 放進 Git。BOT_MODE=real 才呼叫模型；GEMINI_API_KEY 優先於 GOOGLE_GENAI_API_KEY，沒有這兩者則使用 GCP_PROJECT／GCP_LOCATION 的 Vertex 與 ADC。VERTEX_AI_MODEL 預設 gemini-2.5-flash。真實失敗回傳錯誤，不轉成成功範例。

APP_MODE=line 關閉全部 /api/demo 路由。LINE webhook 為 POST /webhook，要求 LINE_CHANNEL_SECRET、LINE_CHANNEL_ACCESS_TOKEN 與合法原始內容簽章，身分只取已驗證的 source.userId。外部平台需要可到達的 HTTPS；本案沒有建立隧道或雲端資源。PUBLIC_BASE_URL 填已部署 HTTPS 位址供角色原圖使用。main／five 切換需 LINE_MAIN_MENU_ID／LINE_FIVE_MENU_ID；保留 alias_main_menu、alias_five_grids 與原 switch data，不建立、刪除或重設既有 Rich Menu。不要執行舊 setup-rich-menus.js。

四個 DEITY_*_ICON 可覆寫合法 HTTPS 頭像；CSP 只加入這些 URL 的安全 origin。缺角色採 COSMOS；頭像失敗保留名稱與文字。

MEMORY_ADAPTER=firestore 使用 ADC／GCP_PROJECT。原 crystal_memories 中 appName=CrystalAstrology 且 userId 相符的歷史只讀投影；新資料寫入 zona_v1_身分摘要文件，不覆寫舊文件。demo 與 line 分 namespace，demo 不讀原 LINE 歷史。外部服務及手機尚未實測，不能由替身結果推論成功。

## 資料與復原

本機預設 .zona-data，目錄 0700、JSON 0600；只保留生日、模式、選單、卡識別及必要文字／圖片描述，不保存圖片原檔、token 或完整模型回應物件。每人序列操作、單程序單 writer，檔案採 tmp＋rename。讀失敗不覆蓋原檔；未知寫入結果在底層 promise 真正結束前鎖住該身分，其他人可繼續。不要以多個程序共用本機目錄；Firestore 也僅以本案單 writer 邊界驗證。

停止服務使用 Ctrl+C，保留資料後重啟，再選 A 並點回憶。需要重設時，先停止服務並備份 MEMORY_DIR，再由操作者明確移走自己的資料目錄；這會移除該目錄中 A／B 的生日、卡、模式、選單及歷史。不提供 reset API，也不自動刪資料。回退先停止服務、保留記憶，再切回已驗證版本；本案尚無已驗證舊版，回退版本流程列待驗證。

backend 絕對期限 30 秒（LINE 同批共用）；frontend 35 秒解除等待、不自動重送。LINE 防重與未知交付 latch 在目前程序內保留，程序重啟後需重新確認外部交付，不能保證跨程序恰好一次。日誌只記 request ID、動作、耗時與安全狀態，health 只回報程序存活；不承諾正式 SLA。
