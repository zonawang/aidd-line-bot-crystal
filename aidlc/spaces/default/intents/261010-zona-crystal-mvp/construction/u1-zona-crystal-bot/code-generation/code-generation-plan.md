# Zona Crystal — U1 Code Generation Plan

## Sources

- 本單位 functional-design/functional-spec.md、rules.md、entities.md；nfr-requirements 六文件與 traceability.json；nfr-design 六文件與 traceability.json；infrastructure-design/infrastructure-specification.md、cicd-pipeline.md、monitoring-design.md（相對本目錄均 ../）。
- ../../../inception/requirements-analysis/requirements.md、user-stories/stories.md、units-generation/unit-of-work.md、unit-of-work-story-map.md、domain-design/components.md、contract-design/contract-summary.md、refined-mockups/interaction-spec.md。
- active-space org、team、project、construction 規則完整讀取；shared／developer knowledge 已讀，space-level 同名 knowledge 目錄不存在。未讀 stage memory.md。
- 原碼唯讀來源 /private/tmp/zona-crystal-review/line-datetime-picker/index.js 與其餘六個 LINE clone；三卡 /Users//Documents/line-flex-message/index.js。精確內容／素材移植時再讀，不執行原 setup-rich-menus.js。

## Scope & Execution Boundary

PART 1 僅計畫；全部步驟未執行。初始 Plan Approval 人工作答及引擎 receipt 前，不啟動 Unit、Bolt／worktree、Git source mutation、依賴安裝或應用實作。應用與 tests 放核准後 workspace／Bolt 根目錄，記錄只放本目錄。main 尚無 HEAD：核准後由 conductor 建立不含秘密／runtime／cursor 的安全基準，再按引擎政策建立 Bolt/worktree；若來源 boundary 不能綁定，依引擎 repair 路徑處理，不能自造核准。

唯一 U1、四同程序元件：BotExperience 單向調用 CrystalKnowledge、Consultation、ConversationMemory。Node24／Express4／原生 HTML CSS JS；fs 私有 JSON 與 Firestore8 擇一，LINE SDK9、Gemini @google/genai／原 Vertex1 薄適配，不新增 ADK 編排／雲端資源／Docker／IaC。保留全部 FR1–FR10、17 stories、52 AC、25 詳細 NFR、23 BR；先本機生日→三卡→逐卡介紹可操作，再補全部功能，薄旅程不是完成條件。

deadline 2026-10-10T14:40:00Z（臺北22:40）。初始核准後目標：60分鐘內薄旅程；再100分鐘整合全部功能；45分鐘關鍵驗證；其餘留適用生命週期、人工檢查與展示。這是工作預算而非通過承諾；若剩餘時間不足回報具體阻礙，不減需求或延時。單項技術問題10分鐘停損，選可運行簡單薄適配、記限制。只簡化裝飾／非核心整備，不機械重設計架構。

## Planned Files & Configuration

| 責任 | 應用根目錄完整計畫路徑 |
|---|---|
| 啟動／安全設定 | package.json、package-lock.json、.env.example、.gitignore（核准後只追加應用資料／秘密排除）、eslint.config.js、.prettierrc.json、scripts/u1-zona-crystal-bot/check.mjs |
| BotExperience | src/server.js、src/config.js、src/bot-experience/experience.js、http.js、line-adapter.js、line-messages.js、deadline.js、logger.js、validation.js（後七檔同 src/bot-experience/） |
| CrystalKnowledge | src/crystal-knowledge/knowledge.js、content.js |
| Consultation | src/consultation/consultation.js、model-adapter.js、profiles.js |
| ConversationMemory | src/conversation-memory/schema.js、memory.js、local-store.js、firestore-store.js、legacy-projection.js |
| 原生頁面／素材 | public/index.html、public/styles.css、public/app.js、public/ui.js、public/assets/雅典娜.png、維納斯.png、莫伊來.png、richmenu_resized.jpg、五宮格_resized.jpg（後四檔同 assets/）；COSMOS與七水晶圖片維持原允許 HTTPS URL |
| 測試／資料 | test/u1-zona-crystal-bot/schema.test.js、memory.test.js、knowledge.test.js、experience.test.js、consultation.test.js、line.test.js、http.test.js、ui.test.js、delivery.test.js、fixtures.js、fixtures/valid-image.png、fixtures/legacy-memory.json |
| 教學／CI | README.md、docs/zona-crystal-demo.md、docs/zona-crystal-api.md、docs/zona-crystal-evidence.md、.github/workflows/zona-crystal-check.yml |
| 後續記錄 | 本目錄 code-summary.md、traceability.json、source-manifest.json；不是本 PART1 產出 |

實作檔不得複製真 secrets／.env／service-account。保留原 LINE_CHANNEL_ACCESS_TOKEN、LINE_CHANNEL_SECRET、GEMINI_API_KEY、GOOGLE_GENAI_API_KEY、GCP_PROJECT、GCP_LOCATION、VERTEX_AI_MODEL、DEITY_ATHENA_ICON、DEITY_VENUS_ICON、DEITY_FORTUNE_ICON、DEITY_COSMOS_ICON；新增 HOST/PORT（127.0.0.1/8080）、APP_MODE=demo|line、BOT_MODE=example|real、MEMORY_ADAPTER=local|firestore、MEMORY_DIR（.zona-data）、明確 main/five menu ID 設定，範例只有占位符。原 model default 與 key 優先序沿用；角色原名稱／頭像、七水晶原介紹／圖片、六指南、alias_main_menu／alias_five_grids、兩 switch data 及原分享 URL 保留。

私有 .zona-data 0700、檔0600，不能在 public；新增schemaVersion=1與revision，不做破壞性 migration，legacy crystal_memories/appName=CrystalAstrology＋可信userId唯讀，新 zona_v1_身分digest專用session，原events不複寫。

## Sequential Implementation Steps

下列 Step 是核准後 PART2 的執行順序；每層實作後立即撰寫／執行該層測試，通過再接下一層。後續功能增量同樣遵守此順序，不以最後一批測試取代逐層測試。

- [x] Step 1 — conductor 完成安全 Git baseline／合法 Bolt 邊界後，建立 package/config/server 骨架、私有資料排除與 lazy SDK 初始化；不把 secrets帶入版本。US1.1、US10.2。
- [x] Step 2 — 建立 node:test runner與 check.mjs exact-file清單、ESLint／Prettier設定、fixtures helper；不建立永遠通過的placeholder test。runner就緒先於第一個實際 test。US10.2。
- [x] Step 3 — 實作 schema／初始化／必要欄位白名單、可信身分digest、狀態與 turns 關聯。US3.1、US3.2。
- [x] Step 4 — 寫／跑 schema.test.js：正常聚合、跨人／非法狀態與原圖／secret排除。US3.1、US3.2。
- [x] Step 5 — 實作 local-store／memory 每人序列、read-before-write、tmp+rename、pendingWrites latch、deadline；保存未知原promise真正settled才解鎖，期限到不啟新副作用。US3.1、US3.2、US7.1。
- [x] Step 6 — 寫／跑 memory.test.js：真檔新instance／子程序重讀、A/B、空／壞／讀／寫失敗、晚成功／晚拒絕／永不settled、五並行與慢A不堵B。US3.1、US3.2、US7.1。
- [x] Step 7 — 實作 knowledge/content 原日期形式、公曆、1–9縮減、七池均勻不放回三卡與當前卡介紹；先完成薄旅程資料。US8.1、US8.2、US9.1。
- [x] Step 8 — 寫／跑 knowledge.test.js：各日期形式／嵌入／閏日／邊界／修正，4/2/4/6，三卡不同與每卡介紹，未知卡、無生日獨立推薦；後续指南增量也先實作再加本檔測試。US8.1、US8.2、US9.1、US6.2。
- [x] Step 9 — 實作 experience 薄旅程業務協調、有效生日保存、逐卡介紹＋相關明示三題、狀態／memoryStatus投影；不靠模型完成確定性介紹。US8.1、US8.2、US9.1、US4.1、US3.1。
- [x] Step 10 — 寫／跑 experience.test.js 薄旅程、逐卡、讀失敗禁止猜卡、保存失敗答案可讀與狀態不冒成功。US8.1、US8.2、US9.1、US3.1。
- [x] Step 11 — 實作 demo HTTP／health、安全static allowlist、loopback Host/Origin與JSON限制、C1契約驗證。US1.1、US10.1。
- [x] Step 12 — 寫／跑 http.test.js：實際HTTP薄旅程、非法action／extra field、路徑／symlink／私有檔拒絕、health僅alive，兩模式demo404。US1.1、US10.1。
- [x] Step 13 — 實作原生最薄頁面生日→三卡→選卡，穩定data-testid、文字安全呈現與memory notice；先取得可運行本機旅程。US8.1、US8.2、US9.1、US10.1。
- [x] Step 14 — 寫／跑 ui.test.js 薄頁互動；以實際瀏覽器操作補375/1280與鍵盤證據，工具不可用標未驗證。US8.1、US8.2、US9.1、US10.1。
- [x] Step 15 — 擴充 Consultation及業務層：完整example/real文字圖片、實際bytes/MIME、四角色與COSMOS、三追問／相關替代、life-path完整原問題、Echo退出優先、六指南、雙選單、recall；每個增量實作後寫／跑 consultation.test.js、experience.test.js、knowledge.test.js，逐題／逐角色／逐指南驗內容。US1.2、US2.1、US2.2、US4.1、US4.2、US5.1、US6.1、US6.2、US7.1。
- [x] Step 16 — 擴充 repository Firestore8／legacy唯讀投影、scope二次驗證、sourceRef去重與有效時間排序、新session聚合保存；實作後擴寫／跑 memory.test.js，不連live寫原資料。US3.1、US3.2。
- [x] Step 17 — 擴充LINE API層：raw驗簽、可信event、日期／選卡／switch、bounded image stream、reply Flex/sender/Quick Reply與動畫，事件防重／批次共30s／未知交付、不自動retry；實作後寫／跑 line.test.js及擴充http.test.js，無效簽章spy零副作用。US1.1、US2.2、US4.2、US5.1、US6.1、US7.1。
- [x] Step 18 — 擴充完整frontend：文字／圖片、三題完整送出、雙選單／六指南／分享、Echo、A/B清視圖＋generation忽略晚到、35s finally；在途身份選擇可用依後續Functional/NFR明定，取代早期mockup busy禁切細節。實作後擴寫／跑ui.test.js、http.test.js，實際瀏覽器逐功能檢查。US1.2、US2.1、US2.2、US3.2、US4.1、US4.2、US5.1、US6.1、US6.2、US7.1、US10.1。
- [x] Step 19 — 補完整env/lock、公開模式邊界、CSP與安全logger；實作後跑HTTP／LINE／delivery測試的secret sentinel、錯誤白名單及輸入大小case。簡單npm audit記結果，不降低安全門檻。US10.1、US10.2。
- [x] Step 20 — 完成README/API/demo/evidence與最小GitHub Actions，重用exact unit check命令；寫／跑delivery.test.js（實際server啟動／health／restart、暖機10次每次≤2s），本機與CI相同關鍵命令，失敗阻擋合併。US10.2、US3.1、US3.2。
- [x] Step 21 — 完整52AC／25NFR／23BR檢查與四元件正常路徑；全單位exact check，實際375/1280、鍵盤、A/B重啟與全功能demo。外部憑證可用時獨立記真模型／Firestore／LINE／手機，不執行live rich-menu setup；未測明列限制。全部17故事。
- [x] Step 22 — 產出code-summary、strict-schema source-manifest（含每個shell/generator寫入路徑）及traceability，OK只指存在的workspace檔，列所有AC/NFR/BR與未驗證證據；conductor接續後續review／verification command人工作答／checkpoint／Operation，本次不report complete。US10.2。

## Story-to-Step & 52 AC Test Map

AC ID逐項列出；測試名稱包含ID，可用參數化多例，但每AC需實際assert預期結果，不能僅驗文字列存在。全部目前未執行。

| Story / FR | 全部AC | Step | test/u1-zona-crystal-bot/內檔案 |
|---|---|---|---|
| US1.1 / FR1.1 | AC1.1.1、AC1.1.2、AC1.1.3 | 1、11、12、17、21 | http.test.js、line.test.js |
| US1.2 / FR1.2 | AC1.2.1、AC1.2.2、AC1.2.3 | 15、18、21 | experience.test.js、ui.test.js |
| US2.1 / FR2.1 | AC2.1.1、AC2.1.2、AC2.1.3 | 15、18、21 | consultation.test.js、experience.test.js |
| US2.2 / FR2.2 | AC2.2.1、AC2.2.2、AC2.2.3 | 15、17、18、21 | consultation.test.js、line.test.js、http.test.js |
| US3.1 / FR3.1 | AC3.1.1、AC3.1.2、AC3.1.3 | 3–6、9、10、16、20、21 | schema.test.js、memory.test.js、delivery.test.js |
| US3.2 / FR3.2 | AC3.2.1、AC3.2.2、AC3.2.3 | 3–6、16–18、20、21 | memory.test.js、ui.test.js、line.test.js、delivery.test.js |
| US4.1 / FR4.1 | AC4.1.1、AC4.1.2、AC4.1.3 | 9、15、18、21 | consultation.test.js、experience.test.js、ui.test.js |
| US4.2 / FR4.2 | AC4.2.1、AC4.2.2、AC4.2.3 | 7–10、15、17、18、21 | knowledge.test.js、experience.test.js、line.test.js、ui.test.js |
| US5.1 / FR5.1 | AC5.1.1、AC5.1.2、AC5.1.3 | 15、17、18、21 | consultation.test.js、line.test.js、ui.test.js |
| US6.1 / FR6.1 | AC6.1.1、AC6.1.2、AC6.1.3 | 15、17、18、21 | experience.test.js、line.test.js、ui.test.js |
| US6.2 / FR6.2 | AC6.2.1、AC6.2.2、AC6.2.3 | 8、15、18、21 | knowledge.test.js、experience.test.js、ui.test.js |
| US7.1 / FR7.1 | AC7.1.1、AC7.1.2、AC7.1.3 | 5、6、15、17、18、21 | experience.test.js、line.test.js、ui.test.js |
| US8.1 / FR8.1 | AC8.1.1、AC8.1.2、AC8.1.3 | 7–14、21 | knowledge.test.js、experience.test.js、http.test.js |
| US8.2 / FR8.2 | AC8.2.1、AC8.2.2、AC8.2.3 | 7–14、21 | knowledge.test.js、experience.test.js |
| US9.1 / FR9.1 | AC9.1.1、AC9.1.2、AC9.1.3 | 7–14、21 | knowledge.test.js、experience.test.js、ui.test.js |
| US10.1 / FR10.1 | AC10.1.1、AC10.1.2、AC10.1.3 | 11–14、18、19、21 | http.test.js、ui.test.js |
| US10.2 / FR10.2 | AC10.2.1、AC10.2.2、AC10.2.3、AC10.2.4 | 1、2、19–22 | delivery.test.js、http.test.js、ui.test.js |

## Detailed NFR & BR Map

| NFR | Steps | 測試／驗證 |
|---|---|---|
| NFR1.1 | 17 | line.test.js／http.test.js：raw簽章有效、缺、錯、body修改、設定不足且無副作用 |
| NFR1.2 | 3–6、11、12、17 | schema.test.js／memory.test.js／line.test.js：可信身份與拒絕注入 |
| NFR1.3 | 11、12、19 | http.test.js：demo/line、Host/Origin、public allowlist／symlink／穿越 |
| NFR1.4 | 13、14、19 | ui.test.js／http.test.js／delivery.test.js：安全DOM、sentinel、錯誤／log／版本 |
| NFR1.5 | 11、12、15、17、19 | http.test.js／line.test.js／consultation.test.js：4000／5MiB／8MiB與檔頭／實際bytes |
| NFR1.6 | 3–6、16 | schema.test.js／memory.test.js：必要投影、私有權限與無原圖/token |
| NFR1.7 | 16、17、20 | memory.test.js／line.test.js：legacy唯讀、新ID／menu保留、無setup |
| NFR2.1 | 5、6、15、17 | experience.test.js／line.test.js：整批共30s、晚答不存、不重設budget |
| NFR2.2 | 18 | ui.test.js：35s解除等待、不自動重送 |
| NFR2.3 | 20、21 | delivery.test.js：暖機10次各≤2s，記環境與elapsed |
| NFR2.4 | 5、6 | memory.test.js／experience.test.js：排隊期限含總budget、過期零副作用 |
| NFR2.5 | 5、6、20 | memory.test.js／delivery.test.js：真檔rename、損壞保留、新instance／restart |
| NFR2.6 | 5、6、16 | memory.test.js：未知write latch晚成功／晚失敗／永不完成＋重新讀 |
| NFR2.7 | 15、17 | consultation.test.js／line.test.js：timeout/abort、追問替代、動畫失敗可恢復 |
| NFR2.8 | 17 | line.test.js：in-flight/delivered重送、reply未知、batch未交付500 |
| NFR2.9 | 18 | ui.test.js／memory.test.js：切B忽略A顯示且A不寫B |
| NFR3.1 | 2、20–22 | check.mjs、全部九test檔／CI、52AC對照與四元件happy path |
| NFR4.1 | 13、14、18、21 | ui.test.js＋實際瀏覽器375/1280／鍵盤、label/focus/alt/狀態 |
| NFR4.2 | 15、18、21 | consultation.test.js／ui.test.js／line.test.js：四種標示與real失敗 |
| NFR5.1 | 1、20 | delivery.test.js＋README單writer運行邊界 |
| NFR5.2 | 5、6、21 | memory.test.js：5個並行與慢A/B、revision/turns不遺失 |
| NFR5.3 | 9、10、15、17、18 | experience.test.js／line.test.js／ui.test.js：answer/save/menu/loading分開 |
| NFR5.4 | 19、20 | delivery.test.js：start/success/error/timeout白名單且无secret |
| NFR5.5 | 11、12、20 | http.test.js／delivery.test.js：health只alive |
| NFR5.6 | 20–22 | delivery.test.js＋docs/zona-crystal-evidence.md：真／替身／本機／未測分列 |

BR全部納入後續traceability：BR1.1→11/17；BR1.2→15；BR2.1/BR2.2→15/17；BR3.1/BR3.2/BR3.3/BR3.4→3–6/16/18；BR4.1/BR4.2/BR5.1→9/15/17/18；BR6.1/BR6.2→15/17/18；BR7.1→5/15/17/18；BR8.1/BR8.2/BR9.1/BR9.2→7–14；BR10.1/BR10.2/BR10.3/BR10.4/BR10.5→11–14/18–22。測試target依上述真行為落在現有實作／test檔。

## Validation & Delivery Limits

測試設定與exact命令見 unit-test-instructions.md。每可測需求至少一測／四元件各正常路徑，另至少兩個錯誤／edgeケース；約5–15只是通用提示，本單位52AC不得裁減，參數化案例可超過。自訂scope沒有新80%floor，不設假coverage pass；任何已定義門檻不得降。所有命令目前未執行，不稱測試完成。

doc/demo需列原四組角色輸入與原名稱／頭像、六指南、A写→B隔離→A讀→停止重啟再選A、每卡及每題、無效後修正。資料保留至操作者明確依文件reset；不提供reset API／自動刪除。回退版本若尚不存在標未驗證，先停止服務保留資料。外部失敗與配置不足不以範例替成功。

## Assumptions & Open Questions

None. 無新增產品方向問題。執行依賴／risks：安全Git source binding與合法worktree由conductor处理；無真憑證／HTTPS／LINE手機／瀏覽器可用時如實未驗證；SDK精確版以lock固定。初始 Plan Approval與後續正式Construction Verification Command仍須人工作答；現在不記answer／decision／challenge，不執行正式驗證或stage完成。

## Testing Contract

```json
{
  "version": 1,
  "methodology": "test-after",
  "source": "team",
  "ordering": "我們先實作每個適用且可測試的層，再撰寫並執行該層測試，通過後繼續整合。",
  "scope": "zona-crystal-one-day",
  "test_strategy": "minimal",
  "project_type": "greenfield",
  "applicable_notes": [
    {
      "layer": "org",
      "text": "We treat tests as a first-class deliverable in every Bolt. The specific\nmethodology (TDD, BDD, ATDD, or classic test-after) is affirmed at\npractices-discovery and recorded in `team.md` under this heading with explicit\n`Methodology` and `Ordering` fields; Code Generation resolves those fields\nindependently from coverage, tooling, and scope notes.\n\nWhen no posture has been affirmed, our default per scope is:\n- **Methodology**: test-after\n- **Ordering**: implement each applicable testable layer, then write and run\n  that layer's tests.\n- `mvp`, `enterprise`, `feature`, `infra`, `classic` add an 80% line-coverage\n  floor and CI execution before merge.\n- `bugfix`, `security-patch` add a targeted regression for the specific\n  bug/vulnerability and require the existing suite to remain green.\n- `express` uses the Minimal strategy: requirement-driven unit tests (one per\n  requirement, with a happy-path floor per component); existing tests remain\n  green.\n- `poc`, `refactor`, `workshop` add no extra new-test floor and require the\n  existing suite to remain green.\n\nThe active `Test Strategy` still applies in every scope and determines test\nvolume/types. Scope floors are additive; they never reduce or replace the\nselected strategy.\n\nBuild and Test verifies defined coverage floors and affirmed quality targets;\nthey may not be weakened to make a step pass.\n\nAffirm a stricter posture in `team.md` if the team commits to one."
    },
    {
      "layer": "team",
      "text": "- **Methodology**: test-after\n- **Ordering**: 我們先實作每個適用且可測試的層，再撰寫並執行該層測試，通過後繼續整合。\n- 測試量遵循本次 Minimal 策略及所有適用底線，不用新的百分比承諾取代需求驗證。org.md 的 80% 行覆蓋底線明列於 mvp／enterprise／feature／infra／classic；本次是自訂 zona-crystal-one-day，不因名稱含 MVP 擅自套用，若引擎確認另有適用底線則完整遵守。\n- 每項可測需求至少一個對應測試，每個可測元件至少一條正常路徑；案例由後續 FR／AC 決定，CAP 數量不是測試數上限。沿用的既有測試保持通過。\n- 關鍵路徑涵蓋 CAP1–CAP9：有效／無效生日、三卡與選卡對應、Echo 退出、文字／圖片分支、三個可點追問、四角色、等待結束、雙選單往返與指南，以及重啟記憶／A 與 B 使用者隔離。CAP10 提供可重現啟動與展示說明。\n- 本機功能、外部服務及 LINE 手機證據分列；固定 AI／圖片範例與模擬 LINE 操作清楚標示。沒有外部憑證或實測時列未驗證，不把模擬當外部通過。\n- 持久記憶使用實際本機儲存、獨立虛構資料與重新啟動驗證；不能只重用同一記憶體物件。記錄 A／B 選擇、目前身分及重啟沿用 A 的步驟；為四角色各附既有規則來源、示例輸入與預期名稱／頭像。本機固定範例和真實模型結果分列。\n- 以最少依賴的功能測試及啟動 smoke 建立可重現檢查命令，本機與 CI 共用；關鍵測試及適用 lint／format 失敗阻擋合併，遵循所有適用 CI／覆蓋率底線。命令與工具留待實作和正式授權，記錄執行環境、exit code 及需求對照。\n- 少量必要安全驗證涵蓋真實 webhook 拒絕無效簽章、公開素材入口不能讀取設定／秘密／記憶檔，以及秘密不進版本、回覆或日誌。本機 A／B 選擇器只用於教學，不作公開端身分驗證。\n- 不新增全量效能、正式營運負載、廣泛相容性測試；已有測試若後續沿用，保持通過。故事的 Given／When／Then 驗收格式不改變上述 test-after 順序。"
    }
  ],
  "obligations": {
    "strategy": "minimal",
    "strategy_volume": [
      "One verifiable test per requirement at the narrowest effective level.",
      "At least one happy-path unit test per component.",
      "Unit tests are the default; a bugfix/security scope floor may require an integration or E2E regression when that is the narrowest level that reproduces the defect."
    ],
    "scope_floor": [
      "Keep the existing test suite green.",
      "This scope adds no extra new-test floor beyond the selected test strategy."
    ],
    "combination_rule": "Apply every selected-strategy obligation and every scope-floor obligation; neither replaces the other, and a targeted scope regression may add the narrowest necessary test type beyond the strategy default."
  },
  "plan_profile": {
    "methodology": "test-after",
    "runner_step": "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
    "runner_ready_before_first_test": true,
    "testable_layers": [
      "Data model / database behavior",
      "Repository / data access",
      "Business logic",
      "API / endpoint",
      "Frontend behavior"
    ],
    "steps": [
      "Project structure and production configuration skeleton.",
      "Bootstrap the minimal test runner/configuration and record the exact unit-scoped command.",
      "Data model / database behavior - implement.",
      "Data model / database behavior - write and run its tests after implementation.",
      "Repository / data access - implement.",
      "Repository / data access - write and run its tests after implementation.",
      "Business logic - implement.",
      "Business logic - write and run its tests after implementation.",
      "API / endpoint - implement.",
      "API / endpoint - write and run its tests after implementation.",
      "Frontend behavior - implement.",
      "Frontend behavior - write and run its tests after implementation.",
      "Environment/build configuration.",
      "Documentation and traceability."
    ]
  },
  "input_sha256": "sha256:ebaec4d7084c7b6b62e428751a6053ec1f3eaf0dfd26ed3de2512d3792b9f687",
  "contract_sha256": "sha256:1d6256fca67658f5a55a77db7aa6b6f35510dea3fc15454971fd25e14f907e97"
}
```
