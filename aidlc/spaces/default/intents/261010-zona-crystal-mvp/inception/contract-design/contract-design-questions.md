# Zona Crystal — 最小契約方向

## Sources

- [unit-of-work.md](../units-generation/unit-of-work.md)、[unit-of-work-dependency.md](../units-generation/unit-of-work-dependency.md)：U1是唯一service，無跨Unit依賴。
- [components.md](../domain-design/components.md)：BotExperience單向協調三元件；ConversationMemory唯一管理持久資料。
- [requirements.md](../requirements-analysis/requirements.md)：全部FR／NFR、驗簽、隔離、範例標示、有限等待與可復原錯誤。
- [interaction-spec.md](../refined-mockups/interaction-spec.md)：目前身分／模式、輸入動作、原選單與結果附近標示。
- 既有line-datetime-picker/index.js（cc1f1938f11012a6518b7ecb2fab840984d9f478）：LINE SDK、Gemini API／Vertex AI與Firestore crystal_memories路徑；查核僅限契約所需片段，沒有重新盤點七repo。
- 使用者已授權最簡MVP-first自治預設；摘要確認、核准及必要存取仍遵循明文人工作答。

## Applicability

沒有跨Unit契約，但U1提供LINE平台呼叫的POST /webhook，及本機瀏覽器使用的教學HTTP API，因此符合本階段外部API條件。保留必要契約，不新增跨服務架構。

## Authorized Defaults

### Q1 — 對外介面、整合方式及擁有權

如何讓本機教學與LINE共用全部功能，同時保留既有外部路徑？

- A. U1擁有全部契約；本機HTTP／JSON、LINE原webhook與SDK動作，Gemini／Vertex AI及Firestore保留適配路徑；無新增跨UnitAPI、事件平台或gRPC（推薦）。
- B. 另建獨立API服務、UI服務與訊息平台，分別部署及管理契約。
- X. Other (please specify)

[Answer]: A

具體方向：

- 契約C1：本機教學介面，GET /api/demo/state讀目前A／B狀態，POST /api/demo/interactions送動作；文字、生日、選卡、指南、Echo、選單、回憶、圖片與追問走同一正規化流程。圖片以JSON的MIME／base64短期傳送，處理後不持久保存原檔。
- 契約C2：POST /webhook使用原LINE原始request body簽章驗證，驗證後只信任事件身分，不接受本機A／B覆蓋；保留文字、圖片、生日date postback與原選單switch data。
- 契約C3：LINE輸出適配器，覆蓋reply／sender／Quick Reply／Flex、圖片內容取得、選單及Loading Animation；保留原alias、日期捷徑、三追問及分享URL，不執行破壞性選單重設。
- 契約C4：Consultation的Gemini API／Vertex AI適配交接，文字／圖片及目前使用者必要上下文進入，回覆／角色／三追問與證據標示返回。教學範例不冒充供應商結果。
- 契約C5：ConversationMemory持久適配交接，區分empty／loaded／read-failed與saved／write-failed／outcome-unknown；本機實際儲存與原Firestore服務路徑保留，完整實體schema和儲存選型留Functional／NFR Design。

### Q2 — 身分、版本、錯誤與等待行為

這些介面如何在不新增登入平台與正式營運承諾下，保持可測、可復原及如實回報？

- A. 簡單v1契約、可信入口身分、明示結果來源與有限等待；不自動重試非冪等外部操作，失敗後可人工再次操作（推薦）。
- B. 新增公開登入、跨程序冪等儲存、背景佇列、自動重試及正式SLA。
- X. Other (please specify)

[Answer]: A

具體方向：

- 本機教學預設只綁loopback；LINE公開模式停用/api/demo/*，不把A／B或任何客戶端userKey當公開認證。公開連線前的模式設定留部署檢查；瀏覽器不能自行切換模型模式或指定外部憑證。
- 版本1.0.0：教學API回覆帶contractVersion；新增可選欄位相容，消費者忽略未知回覆欄位。破壞性修改須同步更新U1、文件與測試；LINE供應商wire格式維持原協定，不塞入自訂版本欄位。
- 本機動作輸入是明確action與對應payload；text最多4000字元，decoded圖片最多5MiB、JPEG／PNG／WebP，JSON body最多8MiB。日期與選卡仍按完整原規則驗證；詳細實體型別由Functional Design補齊。
- 單次互動總等待上限30秒，各外部呼叫不得超出剩餘預算，完成／失敗／逾時都釋放等待；前端35秒結束自身等待。這是展示預算，不是正式平台SLA。
- HTTP區分400輸入錯誤、413過大、415格式不支援、503設定不足、502外部失敗、504逾時；JSON錯誤含code、繁體中文message、retryable及安全requestId，沒有秘密／堆疊／完整對話。無效webhook簽章回401且不讀寫記憶。
- 成功回覆與記憶／動畫結果分開：保存失敗或提交結果未知時可顯示答案及明示未確認保存；記憶讀取失敗不覆寫未知原資料。動畫失敗不阻止諮詢，真實模型失敗不能換成範例成功。
- 不自動重送LINE reply或持久寫入；webhook重送以同程序事件ID盡力防重，跨重啟防重與背景佇列留待完善。本次不承諾exactly-once。
- 回覆帶角色、三追問與另外的日期／生命靈數動作、水晶卡／詳情、必要UI狀態與evidenceLabels；僅當前A／B或驗證LINE身分可讀對應內容。

## Analysis & Inline Support

架構視角：五項契約覆蓋唯一Unit的對外輸入及必要供應商適配，不新增Unit。C1／C2使用OpenAPI格式；C3／C4／C5採適配器shared-schema格式，明確標為應用交接，不冒充重新定義供應商官方wire API。

平台視角：沿用Gemini／Vertex AI及Firestore，不新增AWS、付費採購或雲端環境。沒有憑證時本機範例＋實際本機記憶可展示；真實模式缺設定回明確錯誤。外部寫入逾時不能承諾已取消，標記結果未知，不自動重試；後續實作選最簡可行方式。

歧義／矛盾檢查：單一Unit仍需外部契約；本機A／B不是LINE身分；範例與真實呼叫分開；讀取錯誤不等於空歷史；動畫或保存問題不必抹掉已形成的回覆。此前未定的大小與等待上限在本階段提出明確預設，不刪原功能或新增正式品質承諾。

## Generation Plan

產出contract-summary.md：來源與五行契約表、各契約fenced正式spec、U1擁有權／版本規則、錯誤／等待／資料界線、需求對照及未解問題表。以YAML解析及引用／例子結構檢查驗證，完成一次advisory架構審查。所有工作進度記在獨立validation.md，不在摘要確認後修改此文件。

## Assumptions & Open Questions

None. 外部憑證與LINE實機結果待驗證，不是假定成功；完整實體schema、儲存選型、競爭保護及具體命令留指定後續階段。真實路徑保留，單項技術調查仍十分鐘停損。

## Consolidated Summary Confirmation

- 五項契約：本機教學HTTP API、LINE webhook、LINE輸出／圖片／選單／動畫、Gemini／Vertex AI諮詢、必要持久記憶；全部由U1擁有，沒有跨Unit服務。
- 本機loopback與A／B教學入口和公開LINE模式分開；驗簽後採事件身分。保留全部原動作、角色、三追問＋額外日期捷徑、卡片與資料擁有權。
- 版本1.0.0、文字4000字元、decoded圖片5MiB／JPEG／PNG／WebP、JSON8MiB、互動30秒／前端35秒；錯誤安全且可復原，不自動重送非冪等動作。
- 本機範例／LINE模擬、成功回覆、記憶讀寫／結果未知與外部未驗證分別標示；真實失敗不換成功範例，不覆寫讀取失敗的原記憶。
- 生成最小正式spec與需求對照後驗證並審查；具體schema、儲存及實作留適用Construction階段。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
