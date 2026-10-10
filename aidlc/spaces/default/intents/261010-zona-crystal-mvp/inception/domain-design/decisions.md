# Zona Crystal — 領域設計決策與取捨

## Sources

- [requirements.md](../requirements-analysis/requirements.md)：全部 FR／NFR、全功能與原有行為。
- [stories.md](../user-stories/stories.md)：17 個故事、52 個 AC 與非循環建置依賴界線。
- [team-practices.md](../practices-discovery/team-practices.md)：一天、重用、test-after、最小安全與證據。
- [domain-design-questions.md](domain-design-questions.md)：已確認四個元件、六個實體及採用方向。
- [mockups.md](../refined-mockups/mockups.md)、[interaction-spec.md](../refined-mockups/interaction-spec.md)：C1–C7、S1–S8 與375／1280互動交接。
- 此工作記錄為 Greenfield；沒有 reverse-engineering 的 architecture／component-inventory 產出，不捏造不存在的上游文件。原程式與素材重用依已核准需求。

## ADR-001: 四個責任區塊共用功能行為

### Status

Proposed

### Context

一天內整合全部原功能，沿用七個repo及素材；本機教學與LINE必須體驗同一套功能。需要可測的責任邊界，但目前不需要新增獨立服務、基礎設施或產品功能。

### Decision

採 BotExperience、CrystalKnowledge、Consultation、ConversationMemory 四個邏輯元件，入口單向呼叫其餘三個。內容計算為規則呼叫，外部諮詢／記憶為等待完成的非同步交接；不引入事件平台。C1–C7是入口的視圖控制；部署拓撲留 Units Generation。

### Consequences

正面：日期／卡片規則可獨立測，模型與持久失敗可注入替身，兩種入口共用行為，少量邊界即可追溯17故事。負面：入口仍需協調多種動作；四元件不保證獨立部署／擴展。可逆性：責任可於同一程式中調整，沒有平台採購或遷移承諾。

### Alternatives Rejected

- 七個repo各自成元件／入口：方便講解來源，但重複日期、角色、追問與記憶整合；教學對照改以文件保留。
- 全部混成一個元件：組裝少，但測試及外部失敗／記憶擁有權難隔離，容易延續舊耦合。

### Security & Data Implications

BotExperience驗簽後才使用LINE身分；本機A／B限教學。公開素材與設定／秘密／記憶隔離，文字安全呈現；Consultation只能收到該身分必要上下文。沒有新增公開權限或正式合規認證。

## ADR-002: 必要狀態與歷史由記憶元件唯一管理

### Status

Proposed

### Context

FR3及US3.1／US3.2要求實際持久資料、重啟讀回與身分隔離；舊程式的空初始狀態覆寫問題不能繼續。日期、Echo及卡片功能也需要同一使用者的必要狀態。

### Decision

ConversationMemory唯一擁有UserConversation及ConversationTurn；生日、模式、選單、本次推薦與選卡識別為必要屬性。BotExperience先讀取再提交必要變化，其他元件接收資料而不直接寫儲存。空歷史與讀取失敗分開；失敗時不覆寫未知原資料，入口可明示未讀回／未保存後繼續非持久諮詢。

### Consequences

正面：重啟／隔離與讀寫結果可獨立驗證，避免多功能各自寫入和錯誤初始化。負面：入口需要交接讀寫狀態；持久服務本身仍可能失敗，不能承諾正式可用率。保存資料與使用者身分映射由後續完整schema／協定落地；讀寫競爭保護於Functional Design明定最小策略，不選大型架構。

### Alternatives Rejected

- 全域記憶體作唯一歷史：快但不能達重啟持久驗收，也易混淆不同使用者。
- 日期／模型／入口各自直接寫同一儲存：少一層交接，但無唯一擁有者，讀寫錯誤與初始化容易互相覆蓋。

### Security & Data Implications

只保存必要文字、生日、回覆／圖片描述及必要狀態，不新增圖片原檔／秘密保存。LINE可信身分與本機A／B分開，資料不在公開素材路徑；保留到展示者按文件重設，復原不能自動刪除記憶。實際資料型別、儲存／外部協定留後續；沒有另加新法遵承諾。

## Validation & Deferred Decisions

四元件／六實體、依賴與被依賴對稱、唯一擁有權、無循環及17故事映射已作文件結構檢查。Mermaid使用實際解析器驗證後寫入；完整結果見[validation.md](validation.md)。這些不是應用程式測試。

部署單位、完整schema、外部協定、儲存選型、套件、有限等待與競爭保護分別在後續最小適用階段定義；不為非核心完善超過十分鐘調查或延長一天時限。真實服務與LINE手機仍待驗證。

## Assumptions & Open Questions

None. 本階段的邊界／資料方向承接已確認摘要；不新增功能、正式部署、SLA或付費採購。
