# Zona Crystal — 最小工作單位分解計畫

## Sources

- [components.md](../domain-design/components.md)：四個邏輯元件、六個實體及唯一資料擁有者。
- [decisions.md](../domain-design/decisions.md)：ADR-001／ADR-002；未要求元件獨立部署。
- [requirements.md](../requirements-analysis/requirements.md)：全部原功能與本機／外部證據界線。
- [stories.md](../user-stories/stories.md)：17 個 Must 故事、52 個 AC。
- [team-practices.md](../practices-discovery/team-practices.md)：一天、重用 JavaScript／Node、單一應用、test-after。
- 使用者明確授權後續採最簡 MVP-first 預設；本階段計畫核准及啟用的摘要確認仍須人工作答。

## Authorized Defaults

承接既有自治授權與已核准方向，不重新詢問已確認的產品需求。以下是本階段採用的具體設計答案；尚未生成工作單位產物或實作。

### Q1 — 工作單位邊界、粒度與部署方式

一天內要在同一新版展示全部原功能，如何分組才能維持四個元件責任並減少組裝成本？

- A. 一個 service 工作單位，內含四個邏輯元件與本機頁面，以一個 Node 應用啟動（推薦）。
- B. 四個 library 工作單位及一個 service 組裝單位，增加跨單位整合與設計交接。
- C. 依七個舊 repo 分成獨立服務，需要重複入口與多個執行環境。
- X. Other (please specify)

[Answer]: A

理由：沿用單一應用慣例，部署邊界與邏輯責任分開；一個 Unit 不代表所有程式混在一個元件。

### Q2 — 單位依賴與整合契約

本機展示和 LINE 入口如何共用功能，且避免新增跨服務相依？

- A. 單位 DAG 只有一個節點、無跨單位依賴；四元件沿用入口單向呼叫其餘三個，外部 LINE／模型／儲存契約交 Contract Design（推薦）。
- B. 增加獨立契約與 UI 工作單位，共享型別及 API，再整合服務。
- X. Other (please specify)

[Answer]: A

理由：現有責任圖足夠；不增加事件平台、跨單位共享可變資料或獨立部署。只有一個 Unit，不存在跨 Unit 並行集合。

### Q3 — 功能、資料與驗證邊界

同一 Unit 的交付要涵蓋哪些已核准故事與證據？

- A. 全部17故事、四元件及本機教學／交付檢查；實際本機持久記憶，保留真實串接路徑，範例／模擬與外部未驗證分列（推薦）。
- B. 只交生日、生命靈數與三卡，其他原功能留舊 repo。
- X. Other (please specify)

[Answer]: A

理由：B違反使用者要求全部原功能整合至同一新版。單位保持ConversationMemory唯一持久擁有權，Consultation只接收目前使用者必要上下文。

## Decomposition Plan

| Unit ID | Directory | Kind | 邊界 | 部署 |
|---|---|---|---|---|
| U1 | u1-zona-crystal-bot | service | BotExperience、CrystalKnowledge、Consultation、ConversationMemory；全部17故事與教學交付 | 單一 Node 應用，本機啟動；LINE webhook 使用同一應用 |

- 單位數：1；相依結構：單節點無邊 DAG。
- 元件內部維持三條單向呼叫及既有實體擁有權，沒有新增跨單位 API。
- service 是可執行應用；靜態教學頁與最小啟動／檢查文件隨同交付，不另建立 UI 或 packaging Unit。
- 此階段只描述拓撲；不指定跨 Unit 實作順序或關鍵路徑。生成時按規則記錄 Unit 內故事順序；經濟排序與展示檢查由 Delivery Planning 決定。
- 單一 Unit 可獨立啟動端到端流程，不依賴尚未完成的其他 Unit。正式 walking-skeleton 儀式依後續適用政策執行；本階段不推定缺省 scope 欄位。

## Tradeoffs & Alternatives

採單一service降低啟動、交接及整合成本；代價是不能獨立部署四個元件。這不妨礙逐元件測試、故障注入或教學來源對照。

拆成多個library加service可增強獨立重用，但增加本次工作單位交接；拆成七套服務較貼近舊repo結構，但重複入口、記憶與外部設定。一天展示目標不需要這些成本。

## Analysis & Inline Support

架構視角：ADR未要求獨立部署；四元件同Unit維持唯一擁有者及單向呼叫，全部17故事都有落點。

交付視角：用一個可啟動Unit承接全功能，避免把孤立設計文件作為不可執行的第一個Unit；不在此制定Bolt順序或關鍵路徑。相對複雜度預計L，代表功能整合量，並非工期承諾。

歧義檢查：單一部署不等於單一邏輯元件；單位內整合參照不等於Unit DAG邊；原功能與一天限制按既定方案保留，以免金鑰明示範例及本機真實記憶達成展示。不存在新產品方向衝突。

## Generation Checklist

- [x] 讀取已核准元件、決策、需求與故事。
- [x] 決定最小分組與具體預設，分析依賴與交付取捨。
- [x] 人工 Approve Plan。
- [x] 完成啟用的獨立 Consolidated Summary Confirmation。
- [x] 生成 unit-of-work.md、unit-of-work-dependency.md、unit-of-work-story-map.md、traceability.json。
- [x] 檢查DAG、17故事覆蓋與目標一致。

生成後的審查進度由獨立工作紀錄及正式審查紀錄追蹤，不再更動此已確認問題文件的內容。

## Assumptions & Open Questions

沒有新的產品需求疑問。完整schema、外部協定、儲存選型、有限等待及部署命令留後續最小適用階段；不刪原功能、不承諾未驗證的真實LINE效果。

## Plan Approval

是否核准一個service工作單位、四個內部邏輯元件、全部17故事、單節點無邊DAG的分解計畫？

- A. Approve Plan
- B. Revise Plan
- X. Other (please specify)

[Answer]: A. Approve Plan

## Consolidated Summary Confirmation

- U1／u1-zona-crystal-bot，kind為service；單一Node應用承接本機教學與LINE webhook。
- 同一Unit內維持BotExperience、CrystalKnowledge、Consultation、ConversationMemory四個邏輯元件及唯一資料擁有權。
- 單位依賴圖只有一個節點、沒有跨Unit依賴；不新增服務或事件平台。
- 全部17故事及原功能都納入，使用實際本機持久記憶；明示AI／圖片範例與LINE模擬，保留真實串接路徑並分列未驗證項目。
- 生成四份工作單位產物，檢查DAG與故事映射後作一次advisory架構審查；本階段不指定跨Unit實作順序或關鍵路徑。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
