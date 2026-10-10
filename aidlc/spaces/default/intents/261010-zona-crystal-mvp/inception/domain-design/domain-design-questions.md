# Zona Crystal — 最小領域設計方向

## Sources

- [requirements.md](../requirements-analysis/requirements.md)：FR1–FR10、NFR1–NFR5，全功能保留與證據界線。
- [stories.md](../user-stories/stories.md)：17 個故事、52 個 AC；故事互相參照不能直接變成有循環的建置依賴。
- [team-practices.md](../practices-discovery/team-practices.md)：一天、十分鐘停損、沿用既有程式、test-after、本機先行。
- [mockups.md](../refined-mockups/mockups.md)、[interaction-spec.md](../refined-mockups/interaction-spec.md)：已核准單頁、S1–S8、原生控制與身分／等待／錯誤狀態。
- 使用者先前授權自治預設方案，且要求全部舊功能整合至同一 Bot；摘要、核准與必要存取遵循明文人工作答規則。

## Context & Applicability

雖沿用舊程式與素材，這次仍需定義同一新版的邏輯責任、資料唯一擁有者，以及本機／LINE 共用行為；因此執行 Domain Design。不新增原功能以外的業務需求，也不把設計當作已完成程式。

此階段只定義程式的邏輯區塊；部署單位／拓撲留 Units Generation，資料型別／完整驗證 schema 留 Functional Design，外部協定留 Contract Design，儲存與套件選型留後續最小設計。既有 JavaScript／Node 慣例維持，但不在本階段新增技術選型。

## Design Questions & Authorized Defaults

沒有新的阻擋性產品問題；以下採用已授權的最簡 MVP-first 預設，不重新收集已確認需求。

| 設計題目 | 採用方向與理由 |
|---|---|
| 哪些是獨立邏輯區塊？ | 四個：BotExperience（互動協調／呈現）、CrystalKnowledge（水晶、指南、生日／生命靈數規則）、Consultation（文字／圖片諮詢、三追問、四角色）、ConversationMemory（每位使用者必要持久狀態）。按可測責任分開，不按七個舊 repo 複製七套入口。 |
| 資料由誰擁有？ | BotExperience 擁有短期 Interaction；CrystalKnowledge 擁有 Crystal、Guide；Consultation 擁有 DeityProfile；ConversationMemory 擁有 UserConversation、ConversationTurn。每個實體只有一個擁有者。生日、模式、選單與本次卡／選卡識別是 UserConversation 屬性；計算與內容規則不直接改寫記憶。 |
| 區塊如何互動？ | BotExperience 單向呼叫其餘三個：讀目前使用者記憶、執行內容規則或諮詢、交付結果與保存必要變化。Consultation 接收目前使用者的必要內容／歷史，不自行查別人的記憶；其餘區塊不反向呼叫入口。呼叫圖無循環，不引入事件匯流排或跨區塊可變全域狀態。 |
| 外部服務歸哪裡？ | BotExperience 處理 LINE 驗簽、圖片內容取得、回覆、選單切換與等待動作；Consultation 隔離既有真實文字／圖片模型呼叫和無金鑰明示範例；ConversationMemory 隔離真實持久服務與本機持久存取。LINE／模型／持久儲存是外部依賴，不是領域元件。具體服務／協定留後續。 |
| 如何維持舊功能與內容？ | 保留日期原形式／真實曆日、縮減至1–9、七款水晶池及 #水晶／今日水晶推薦、三追問加日期／生命靈數捷徑、四角色原名稱／頭像、六個指南文字入口、主與五宮格原動作／分享連結、Echo 與退出、等待及必要重啟記憶。規則與素材重用，七 repo 不各自部署成另一個 Bot。 |
| UI 如何分工？ | 已核准 C1–C7 是 BotExperience 的視圖／控制，不各自新增領域元件；它們只提交明確動作並呈現結果。本機 A／B 與已驗證 LINE 身分分開，切換不顯示他人歷史；文字安全呈現、原生鍵盤控制、圖片失敗仍有文字入口。 |
| 失敗如何交接？ | 記憶讀寫、模型、圖片、選單與動畫各自回報結果／失敗，由 BotExperience 顯示可繼續操作的狀態。真實失敗不靜默轉成成功範例；未知角色回 COSMOS、追問缺漏提供明示相關替代問題、動畫失敗不阻止諮詢。有限等待參數稍後定義。 |

## Boundary Options & Tradeoffs

- **Option A — 四個責任區塊（採用）**：入口、內容規則、諮詢、記憶各有可測邊界；重用成本小。代價是入口仍協調多種動作；未承諾獨立部署。邊界容易在同一程式內調整。
- **Option B — 依七個舊 repo 切成七個區塊**：與原範例一一對照較直觀，但生日、角色、追問與記憶反覆穿越邊界，增加整合及重複入口成本；一天內不採用。教學來源對照可用文件保留。
- **Option C — 所有規則、呈現、模型與記憶混在一個區塊**：初始組裝少，但難以隔離外部失敗／測試持久重啟，容易沿用舊記憶覆寫或公開根目錄問題；不採用。

推薦 A，依使用者既有自治授權作為產出方向；正式核准仍由本階段核准點決定。ADR 記錄邊界及唯一記憶擁有者的正負取捨，不另新增大型架構。

## Analysis & Support Perspectives

架構視角：四個責任、六個實體、單向呼叫即可覆蓋17故事，沒有以 DB／外部API冒充程式元件。實體只列識別、屬性名稱及跨區塊引用，不在此制定型別、關聯基數或完整驗證 schema。

平台視角：本次本機交付不需要新增 AWS、VPC、容器編排或付費資源；實際持久路徑及原外部串接保留。外部憑證／可用性與真實 LINE 手機證據仍待取得，設計不推定已通過。

介面視角：既有 C1–C7 已足以承接全部動作，不將一個按鈕拆成一個服務。生日不是文字／圖片諮詢的先決條件；錯誤、空歷史、等待、部分素材失敗與 A／B 畫面隔離維持已核准規格。

最小安全／資料界線：驗簽後使用 LINE 身分；本機身分選擇只用教學；公開素材隔離設定／秘密／記憶；只保存必要文字／生日／回覆／圖片描述，圖片原檔和秘密不成為新持久實體。這是現有 NFR 的責任分工，不新增合規認證或正式 SLA。

## Generation Plan

- components.md：fenced YAML 四個元件、六個實體、對稱依賴／被依賴、外部依賴；由同一資料衍生 Mermaid、文字替代、摘要／擁有權／依賴／理由表。寫入前驗證 Mermaid。
- decisions.md：最少 ADR，含 Context／Decision／Consequences／Alternatives Rejected 及現有安全／資料界線。
- traceability.json：逐一列出17個 US ID，目標只用本階段宣告的元件／實體；全部須有落點，不把故事整合參照轉為循環。
- 產出後檢查 YAML 名稱／引用、唯一擁有權、依賴對稱、無循環、17故事全覆蓋，再作單次 advisory 架構審查。

## Assumptions & Open Questions

None. 沒有新增產品方向疑問；外部憑證、儲存／套件、有限等待及精確協定留適用後續階段，以最簡可行方式落地，不能因此刪既有功能或延長時限。

## Consolidated Summary Confirmation

- 四個邏輯元件：BotExperience、CrystalKnowledge、Consultation、ConversationMemory；本機與 LINE使用同一功能行為。
- 六個實體各有唯一擁有者，必要對話／生日與模式狀態由 ConversationMemory 管理；不保存圖片原檔或秘密。
- 入口單向呼叫其他三個元件，沒有循環、事件平台或七套重複入口；部署與完整資料 schema 留後續最小階段。
- 全部17故事、原水晶／指南／角色／選單／Echo／記憶／等待功能及錯誤復原維持；本機範例與真實串接證據分列。
- 產出 components.md、decisions.md、traceability.json，檢查擁有權與完整覆蓋後交架構審查。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
