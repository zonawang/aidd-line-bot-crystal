# U1 — Unit Test Instructions

## Testing Contract & Scope

以 code-generation-plan.md 原樣 Testing Contract 為唯一排序來源：test-after，每適用層先實作再寫／跑測試；Node24 node:test，Minimal需求驅動，一個可驗證測試／可測需求、四元件各正常路徑，至少兩個錯誤／邊界案例。52AC、25詳細NFR、23BR映射見plan。自訂 zona-crystal-one-day 無額外80%floor，保留既有suite、lint/format及既定門檻。5–15非上限，不減測需求。

目前應用／tests／runner未建立；以下命令全部未執行、尚無exit code，不表示通過。核准後Step2建立runner與config，首次test執行前ready；不是測試先行，無需虛構Red或永pass placeholder。

## Runner Setup & Exact Unit Commands

Node24及npm。首次安裝只在初始Plan Approval receipt與合法workspace之後；package.json鎖定production majors Express4、LINE9、Firestore8、Vertex1及Google genai精確lock，dev最小ESLint／Prettier，DOM行為使用小型DOM替身（jsdom dev dependency，lock固定），不需Playwright平台。node:test內建無額外runner dependency。eslint.config.js與.prettierrc.json配套；scripts/u1-zona-crystal-bot/check.mjs明列此Unit源檔／public／九tests，先format/lint再node:test，任何nonzero傳遞exit1，無skip成功。npm run check:u1由package精確指向此script，GitHub Actions同命令。

核准後依步驟只跑當層exact path，例如：

```bash
node --test test/u1-zona-crystal-bot/schema.test.js
node --test test/u1-zona-crystal-bot/memory.test.js
node --test test/u1-zona-crystal-bot/knowledge.test.js
node --test test/u1-zona-crystal-bot/experience.test.js
node --test test/u1-zona-crystal-bot/consultation.test.js
node --test test/u1-zona-crystal-bot/line.test.js
node --test test/u1-zona-crystal-bot/http.test.js
node --test test/u1-zona-crystal-bot/ui.test.js
node --test test/u1-zona-crystal-bot/delivery.test.js
```

全U1 exact測試命令：

```bash
node --test test/u1-zona-crystal-bot/schema.test.js test/u1-zona-crystal-bot/memory.test.js test/u1-zona-crystal-bot/knowledge.test.js test/u1-zona-crystal-bot/experience.test.js test/u1-zona-crystal-bot/consultation.test.js test/u1-zona-crystal-bot/line.test.js test/u1-zona-crystal-bot/http.test.js test/u1-zona-crystal-bot/ui.test.js test/u1-zona-crystal-bot/delivery.test.js
```

包含本單位lint／format／tests／restart與HTTP smoke的可重現候選命令：

```bash
node scripts/u1-zona-crystal-bot/check.mjs
```

它只check此Unit明列paths，不跑框架suite或所有Unit。正式Construction Verification Command由conductor另行呈現與取得人工作答，這份文件不等於該receipt。runner config在package.json與check.mjs，精確tests清單不依glob漏檔；coverage若記錄只是診斷，不新增百分比成功条件。

## Files, Cases & Component Happy Paths

| test/u1-zona-crystal-bot/檔 | 實際assert重點 |
|---|---|
| schema.test.js | 合法schema與身份／turn關聯、非法enum／跨人、necessary projection去除圖/token/secret |
| memory.test.js | 真fs＋新reader／子程序；A/B讀回與5並行、空／壞／讀／寫失敗，tmp/rename及權限；未知write晚成功/拒絕/永不settled、read失敗零save、legacy只讀與新session |
| knowledge.test.js | 每日期形式／嵌入／多日期、公曆0001–9999／閏年／修正、4/2/4/6、七池均勻不放回與逐卡、無生日推薦、全部六指南 |
| experience.test.js | birthday→三卡→每卡介紹，Echo進出／圖片／優先序、完整life-path原問題、必要context、讀／保存狀態、期限過期零副作用與下一合法請求恢復 |
| consultation.test.js | example水晶/生日/星座及四組原輸入／名稱／頭像；Gemini/Vertex替身實際text與bytes/MIME，role marker清除、COSMOS、三題完整及缺題相關標示；real失敗不例子 |
| line.test.js | 原事件映射、date params、switch/alias/已配置menuId、Flex/sender與平台limits、三題完整message＋額外date/life-path、bounded image stream、loading非阻擋、dedup／batch deadline／reply未知 |
| http.test.js | 真HTTP合法／非法JSON/action/字段、4000字／5MiB／8MiB、MIME/頭、有效／無效簽章零副作用、Host/Origin/public404/static白名單／穿越／symlink／health |
| ui.test.js | DOM互動逐卡／逐追問／全功能入口、textContent拒HTML、A/B generation忽略晚A與35s finally、不autoPOST、label/focus/alt/證據標示 |
| delivery.test.js | 實際spawn server啟動/health/停止/重啟再A、暖機10次每次≤2s；safe logger start/success/failed/timeout sentinel；doc/demo及CI共用check配置 |

CrystalKnowledge happy path：有效生日4與三不同卡；ConversationMemory happy path：真檔寫A、新實例讀A；Consultation happy path：文字／圖片adapter真輸入替身與角色三題；BotExperience happy path：真HTTP birthday→cards→select並有正確projection。各元件之外至少兩個必要edge/errors由上述無效生日、讀失敗、real失敗、無效簽章等提供；不寫鏡像implementation或assert true。

測試名稱包含AC/NFR/BR IDs。每個FR子需求都有對應行為；同個參數化test可以覆蓋相關多ID，但逐條assert結果。日期各形式、四角色、六指南、三卡、三追問逐項觸發，不能只assert按鈕或文件存在。

## Mocks, Fixtures & Isolation

SDK client／clock／random／fs能力注入適配邊界；fake Google檢查確實傳text／Buffer/MIME，fake LINE檢查message及complete question，fake Firestore記query/appName/userId及readonly original、新doc唯一write。偽call證據只算adapter替身；不要使用真金鑰或live資料。受控clock驗30s/35s不需真等待35秒；另正常真HTTP/子程序為實際本機證據。

每case建立獨立os tmp位置與假身份，權限0700/0600，清理只測試自己tmp，不碰.zona-data／原Firestore／舊repo。重啟使用新程序或新reader而非同記憶體object。fixtures.js、fixtures/valid-image.png（真有效小PNG）、fixtures/legacy-memory.json（虛構events包含非文字/失敗時間）無真PII。超大／偽MIME/壞base64由測試產生；不持久存原圖。未知write以deferred Promise控制真实settled，race後仍觀察reject、不造取消。

四角色原輸入：
- ATHENA：我想提升學習專注力，有什麼水晶建議？
- VENUS：我想了解愛情與人際關係的水晶搭配
- FORTUNE：最近財運起伏，有什麼水晶情境建議？
- COSMOS：請介紹水晶基礎鑑定

## Manual UI, External Evidence & Reporting

實際375/1280瀏覽器檢查生日、逐卡、逐題、選單、圖片、A/B、Echo、鍵盤、focus/alt、錯誤及範例標示，記瀏覽器／寬度；DOM替身不能當實際瀏覽器。A写→B不讀A→A讀回→停止服務→重啟再選A；記目前身份與必需history。

每次執行記exact命令、Node/npm/機器、mode、exit code、AC/NFR映射及證據層級；純本機10次elapsed每次≤2000ms、五並行revision/turns、deadline控制證據不降低門檻。docs/zona-crystal-evidence.md分已實作、本機已測、固定範例、adapter替身、真模型/Firestore/LINE手機已測、未驗證。真外部缺憑證或失敗列明原因，不以mock/範例替通過，不執行setup-rich-menus.js或原legacy寫入。

所有tests與smoke目前未執行。後續Build and Test驗證並補必要失敗case；tests在Code Generation即實作／執行，不延至Build/Test才建立。

## Assumptions & Open Questions

None. 缺秘密不阻本機example，但真外部另驗；未授權公開連線、live menu變更或破壞性資料重設。安全source binding／初始Plan Approval及正式驗證命令receipt由conductor處理。

