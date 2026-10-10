# Zona Crystal — 整合工作單位

## Sources

- [components.md](../domain-design/components.md)、[decisions.md](../domain-design/decisions.md)：四元件、六實體及唯一資料擁有權。
- [requirements.md](../requirements-analysis/requirements.md)、[stories.md](../user-stories/stories.md)：全部原功能、17個Must故事及52個AC。
- [units-generation-questions.md](units-generation-questions.md)：已核准分解計畫與已確認摘要。

## Unit Definitions

| Unit ID | Directory | Name | Kind | Relative complexity | Deployment model |
|---|---|---|---|---|---|
| U1 | u1-zona-crystal-bot | Zona Crystal 整合 Bot | service | L | standalone：單一Node應用，本機頁面與LINE webhook共用功能 |

Directory是Construction文件的單位名稱，應用程式碼仍放工作區根目錄。L表示原功能與錯誤處理的整合量，不是增加工期或採用大型架構的承諾。

## Responsibilities & Boundaries

U1交付全部17故事及其驗收，涵蓋生日／生命靈數／三卡與介紹、Echo及退出、文字與圖片諮詢、持久記憶及A／B隔離、三追問與額外日期／生命靈數捷徑、四角色、雙Rich Menu、六個指南入口、等待復原，以及無金鑰教學頁與可重現交付。

| Logical component | U1內責任 | Owned entities |
|---|---|---|
| BotExperience | 入口、身分、互動協調、安全呈現、LINE動作、教學頁與證據標示 | Interaction |
| CrystalKnowledge | 真實曆日與1–9生命靈數、七款水晶池、三張不同卡、卡片介紹與指南 | Crystal、Guide |
| Consultation | 文字／圖片模型與明示教學範例、四角色、三追問與相關替代問題 | DeityProfile |
| ConversationMemory | 目前使用者必要狀態與歷史的唯一持久擁有者、讀寫結果與重啟讀回 | UserConversation、ConversationTurn |

四元件同一部署但仍有可測責任邊界。BotExperience只單向呼叫其餘三個；Consultation接收目前使用者必要上下文，不自行查詢／寫入記憶。持久儲存、模型與LINE是外部依賴，不另建立本次工作單位。

## Implementation Notes & Constraints

- 沿用既有JavaScript／Node、原素材與規則；不搬入七套伺服器，不新增微服務或全面語言遷移。
- 本機與LINE入口走共用處理行為。本機AI／圖片範例及LINE模擬就近標示；有設定時保留真實呼叫路徑，真實失敗不靜默改成成功範例。
- 本機記憶使用實際持久儲存並驗證新實例／重啟；先讀再寫，讀取失敗不覆寫未知原資料。不新增持久圖片原檔或秘密，記憶不在公開素材路徑。
- LINE先驗簽再採用事件身分；本機A／B選擇不是公開認證。保留未知角色COSMOS、素材失敗文字入口及等待失敗後可恢復的要求。
- 生日支援全部已核准形式與閏日；生命靈數反覆縮減至1–9；三卡不重複且選卡介紹對應正確。保留原指南、角色名稱／頭像、選單動作與分享連結。
- 原生教學頁遵循已核准375／1280寬度、可讀標籤、鍵盤與可見焦點；不是新的獨立前端服務。
- 每項可測需求與每個可測元件須有相應檢查，遵循test-after與適用底線；全功能整合仍是完成條件，主旅程通過不能取代其餘功能。
- 一個工作天與單項十分鐘調查上限維持；縮減非核心裝飾、重構、正式雲端整備，不能自行刪除原功能。

## Design & Delivery Handoff

service適用的Construction設計矩陣由後續流程決定。Contract Design定義入口、外部LINE／模型／儲存交接；Functional Design補型別、驗證與最小讀寫競爭策略；後續適用階段選儲存、套件、等待上限與啟動／檢查命令。

本文件只定義Unit邊界；Unit內故事次序見[story map](unit-of-work-story-map.md)。Delivery Planning決定Bolt與展示驗證，不在此指定跨Unit建置排序或關鍵路徑。

## Assumptions & Open Questions

沒有新的產品方向疑問。外部憑證與LINE手機結果未驗證；這是工作單位規格，尚非可運作MVP或測試通過證據。
