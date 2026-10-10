# U1 Code Generation — 實作交接

## 範圍與狀態

PART2 已在核准 Bolt worktree／branch bolt-c15a7fe4_zona-crystal-full-demo 實作原全部功能，保留17故事、52AC、25詳細NFR、23BR。worktree：.aidlc/worktrees/bolt-c15a7fe4_zona-crystal-full-demo；基準4b28567b70bcaa066b272579630b46c74721b552。未改核准計畫正文，僅勾選已執行步驟；未以薄旅程替代完整功能。

Testing Contract：test-after、Minimal、自訂zona-crystal-one-day，hash sha256:1d6256fca67658f5a55a77db7aa6b6f35510dea3fc15454971fd25e14f907e97。各層先實作、再寫／跑當層測試；無新80%門檻。Unit原生verification由conductor另行處理，這不是正式人工作答或stage完成。

## 內容與檔案

53個應用寫入路徑完整列source-manifest.json（strict stage/unit/version/writes，含lock、ignore、config、原圖copyFile、PNGfixture、Prettier產物與額外runner清單helper）。record文件／原生state與audit fork不冒列為應用source。無真秘密、原Firestore寫入、setup-rich-menus、發布或commit。

| 元件 | 實作 | 正常路徑證據 |
| --- | --- | --- |
| BotExperience | src/bot-experience／server／config、public | 真HTTP生日→三卡→逐卡介紹，DOM全功能 click／FileReader |
| CrystalKnowledge | src/crystal-knowledge | 原日期形式／公曆／1–9、七池三張不同、逐卡、全部六指南 |
| Consultation | src/consultation | 四組原輸入原名稱／頭像、Gemini／Vertex替身完整bytes／MIME、完整三題 |
| ConversationMemory | src/conversation-memory | 真fs私有JSON、新讀取實例／子程序restart、A／B、Firestore原唯讀新session |

原三角色圖片與雙選單圖片從原clone唯讀copy；七卡URL、四完整指南／六alias、share URL保留。selected reply明示卡名／介紹。四種範例／模擬標示就近呈現，中文模式名稱。life-path送原完整問題，不重抽卡；額外日期／生命靈數捷徑不佔三追問題數。LINE追問最多300字以完整符合訊息動作限制；缺漏則明示相关替代题。

## 必要設計落地

- 單程序四元件單向調用、lazy SDK、example／real分支；真失敗不變成功範例。
- fs0700/0600、唯一tmp＋rename、每人序列／共用deadline、unknown write在原promise settled前禁止後續寫，read-failed不覆寫原檔。Firestore只讀trusted appName/userId舊events，另寫zona_v1_digest；demo不查LINE歷史。
- raw8MiB HMAC先驗再parse、trusted source.userId、實際stream圖片≤5MiB／檔頭、同批30秒、in-flight／delivered／unknown防重、reply失敗500、no自動retry。原menu alias／data／configured IDs與loading20秒best effort保留。
- frontend35秒即使fetch忽略abort也finally解除鎖定；切A/B立即清視圖／表單、generation拒晚A。static allowlist＋realpath、loopback Host/Origin、public模式demo404、CSP安全HTTPS origin、textContent、logger安全enum投影。
- deadline timer使用monotonic absolute時間，timer早醒重新排程；過期不開始後續I/O，晚模型結果不保存。未冒稱race已取消底層promise。

## 已執行驗證

環境：Node.js24.18.0、npm11.16.0、Darwin arm64。測試資料每例獨立tmp，demo/example；Google／LINE／Firestore為明示替身。各層exact node --test檔案均已跑；最終全單位：

```sh
npm run check:u1
```

exit0：Prettier＋ESLint＋test-files.mjs明列九檔、61tests／61pass／0fail／0skip。真HTTP／raw簽章／8MiB／symlink／safe errors、FileReader圖片、逐角色／六指南／每卡／每題、期限／未知保存／交付、五並行／慢A不堵B、真server停止重啟与A/B全部有assertions。四元件各正常路徑及多錯誤／邊界案例。

暖機十次最終陣列（ms）：[6,4,4,4,3,2,2,3,5,6]，每次≤2000ms。spawn server→A寫／B隔離→A讀→停止→新程序→A讀，實際持久檔，不重用同記憶體物件。

npm audit --json --cache /private/tmp/zona-crystal-npm-cache：exit0、0漏洞。初始兩個moderate由Vertex傳遞gaxios6.7.1的uuid9造成；普通audit fix未解，scoped override uuid11.1.1，保留gaxios實際v4 API並測兼容／四SDK真正載入。不開--force／不降安全門檻；npm仍提示genai/protobufjs兩個install scripts未批准，外部服務另驗。

git diff --check exit0。traceability.json有100唯一upstream IDs（52/25/23），每OK target為一個存在的worktree相對測試檔，表達實作／本機證據映射；**不能把source target當外部或完整人工視覺通過**。四元件、source manifest及CI相同命令已可供獨立review。

## 人工與限制

root Chrome/native AX薄頁已驗2000-01-01→4、逐卡與錯誤修正2000-02-29→6；薄頁繼承390×844 preset看見手機排列與截圖。完整頁AX另驗四組原文字／原角色／教學標示／三追問、Echo原样<水晶>／進出、五宮格／正確alt、淨化指南。完整指南676字未截短；AX摘要輸出有截斷。

精確375／1280、完整頁視覺、原生A/B dropdown與完整鍵盤人工尚未驗：browser extension auth unavailable、AX popup不响应、coordinate noWindowsAvailable，全頁screenshot空白但AX互動可用。已按10分鐘技術限時停止追查；DOM label/focus／generation與真子程序A/B證據分列，不替代指定寬度通過。

真Gemini/Vertex、真Firestore、外部HTTPS webhook與LINE手機日期／sender／loading／richmenu均未測、未新增雲資源。LINE防重僅程序內，無跨restart／多instance exactly-once；儲存單writer邊界。未驗證舊版回退／正式SLA／廣泛相容性／負載。README保留資料／operator reset影響與停止重啟再選A。

文件：README、API、demo、evidence与最小GitHub Actions完成；包含四組原輸入、全功能清單、資料復原與外部缺設定路徑。8080服務供review的session26679仍運行；進一步source變更須先重新載入Node服務。

## 首輪 Review 修復

review-01.md 的 NOT-READY 三項 Major（R-01／R-02／R-03）已依 lead-only 授權修復，僅變更 line-adapter.js、line-messages.js、既有 line.test.js 與必要 API／evidence／本摘要；source 集合維持53，traceability仍100-ID，未改核准計畫、instructions或上游。

R-01：known rejected reply 可由平台 redelivery 再交付，使用先前計算結果、新replyToken；不重複模型、圖片、保存或選單。回歸實際私有JSON revision保持1、saves=1、menu effects=1、interactions=1、replies=2，第二次成功，再重送不重播。在途／outcome-unknown仍鎖住，late settle才更新交付狀態。

R-02：有效支援事件沒有webhookEventId仍處理；只為真正ID建立dedup記錄，不使用共用或衍生fake ID。兩人缺ID各自回覆，重送按無穩定防重保證路徑處理，維持可信身分與期限。

R-03：先保留所有必要來源、memoryStatus.message、menu／external狀態，再預算正文／Flex，必要時明示正文截短。30000字正文兩種payload回歸均≤5訊息／每則≤5000，四來源標示與保存未知／外部狀態保留；不可呈現的超長必要標示明確拒絕，不默默丟棄。

實作後新增三項回歸，LINE指定檔10tests／10pass；修復後完整npm run check:u1 exit0：Prettier＋ESLint＋九個指定檔64tests／64pass／0fail／0skip。暖機十次 [4,4,3,3,3,3,4,6,2,2] ms。source manifest仍53、traceability仍100，不需改集合。為載入LINE修復，26679 Node服務已停止並以session37910重啟8080，保留全部既有合成展示記憶，未刪資料。未自行宣告review READY或stage完成。

## 下一步

交回conductor獨立review、正式verification command人工作答、後續Build/Test與生命周期。未report complete、未commit／merge／發布。
