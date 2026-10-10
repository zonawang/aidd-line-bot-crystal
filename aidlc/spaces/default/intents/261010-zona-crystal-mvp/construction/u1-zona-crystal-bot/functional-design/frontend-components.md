# Zona Crystal — 最小教學視圖與狀態

## Sources

- [functional-spec.md](functional-spec.md)、[entities.md](entities.md)、[rules.md](rules.md)。
- [interaction-spec.md](../../../inception/refined-mockups/interaction-spec.md)、[mockups.md](../../../inception/refined-mockups/mockups.md)：沿用 C1–C7 與375／1280設計，不建立新的UI框架／服務。
- [C1本機契約](../../../inception/contract-design/contract-summary.md)：state與interactions入口、action、結果／錯誤投影。

## Component Hierarchy & Responsibilities

|既有視圖|輸入／顯示|本地狀態／動作|
|---|---|---|
|C1 AppShell|教學模式、目前A/B／Echo或consult、範例提示|activeUser、displayGeneration、loading-state；控制取得當前身分state|
|C2 BirthdayInput|日期控制、文字生日、可讀錯誤|dateText；birthday提交／更正，錯誤不顯新數字|
|C3 CrystalCards|恰三張原卡名稱／簡介／圖與文字替代|cards、目前selected；每張select-crystal提交各自ID|
|C4 Conversation|回覆／角色名稱、頭像、三追問與額外捷徑|currentResult；follow-up送完整題文，日期動作回C2、life-path另送action|
|C5 Composer|文字、圖片控制、送出／等待／重試|inputText、短期file、busy、safeError；text/image明確分流|
|C6 IdentityMemory|A/B目前身分、回憶與read/write狀態|state只取目前身分；recall讀取，不自行寫持久資料|
|C7 MenuGuidePreview|主／五宮格、指南、返回、分享、Echo入口|menu預覽及guide內容；set-menu／guide／set-mode；本機標LINE操作模擬|

表格是既有視圖責任的交接摘要，不新增領域元件。BotExperience提供顯示投影；其他三元件不擁有瀏覽器快取或畫面狀態。

## Props / State & Request Binding

視圖接收可信結果投影／狀態／safeError／evidenceLabels與可操作動作，不傳平台token或內部userKey。C1唯一管理activeUser與displayGeneration，送出時快照身分與世代；只有兩者仍匹配的回覆才能更新畫面。

同一畫面一次提交，busy停用重複提交按鈕；身分切換仍可用。切換立即清空舊結果／卡／追問／生日／歷史／模式快取，取消或忽略舊請求，再GET新state；GET失敗顯示重試，不能還原前一人的內容。取消顯示不是撤銷已提交的伺服器保存，A結果仍只屬A。

前端在35秒上限釋放busy，成功／拒絕／網路錯誤均回idle；不自動重送POST。伺服器共同30秒deadline沿用；使用者重試是新互動，先重讀持久狀態。

## API Integration & Validation

- state：GET /api/demo/state?user=A|B；只用伺服器回的state，不用另一身分快取補欄位。
- interaction：POST /api/demo/interactions，以user、action及該action的payload送出；不送source、userKey、provider或無關payload。
- text／follow-up非空且4000字元；birthdaydateText必要、後端公曆規則為準；日期控制不加年齡或未來日期限制。
- image：JPEG/PNG/WebP、5MiB，前端協助提醒，後端嚴格解碼／檔頭驗證；8MiB body上限。選檔只是短期資料，處理後釋放，不存瀏覽器長期儲存。
- select-crystal只送當前三卡ID；guide使用六個允許入口；mode為consult/echo，menu為main/five；未知action不提交。
- read/write與答案分開。saved才說已保存；read-failed、write-failed、outcome-unknown分別說明，顯示候選不假冒持久狀態。

## Accessibility, Fallbacks & Evidence

375／1280主要操作均可達；手機三卡直排，追問與捷徑可換行。原生按鈕／表單控制有可讀label，可見focus，互動元素有穩定data-testid；結果／等待狀態提供文字與可讀動態通知。圖片有alt，載入失敗保留名稱／介紹／動作，不只靠顏色傳錯誤。

使用者／模型文字以純文字呈現。固定文字、圖片辨識範例、LINE模擬、追問替代在對應結果附近標原文字；四角色名稱仍可讀，技術標記隱去。分享使用原URL。公開LINE模式伺服器停用/api/demo/*，不只藏選擇器。

## Acceptance Handoff

逐項操作生日→三卡→三張各自介紹→三追問逐題、兩選單往返／六指南、文字／圖片、A/B／回憶／重啟、Echo／退出；加控制逾時與切B後A晚到回覆案例。這是UI行為設計，尚未提供瀏覽器實測或可運作應用證據。
