# Zona Crystal — Logical Components（U1）

## Sources

- [nfr-design-questions.md](nfr-design-questions.md)：已確認最小設計。
- [performance-requirements.md](../nfr-requirements/performance-requirements.md)、[security-requirements.md](../nfr-requirements/security-requirements.md)、[scalability-requirements.md](../nfr-requirements/scalability-requirements.md)、[reliability-requirements.md](../nfr-requirements/reliability-requirements.md)、[observability-requirements.md](../nfr-requirements/observability-requirements.md)、[tech-stack-decisions.md](../nfr-requirements/tech-stack-decisions.md)：25 項要求與技術界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)、[components.md](../../../inception/domain-design/components.md)：功能、接口及四元件唯一擁有權。

## Inventory & Ownership

| Component | 同程序責任／唯一實體 | NFR機制／邊界 |
|---|---|---|
| BotExperience | Interaction；Express入口、共用互動協調、本機UI與LINE adapter | raw驗簽／來源身分、PERF deadline、SERIAL queue與event防重、35s／generation、OBS安全投影；只向下呼叫其餘三元件。 |
| CrystalKnowledge | Crystal／Guide；生日、公曆／生命靈數、七池三卡與指南 | 靜態唯讀資料／确定性規則、原素材URL；無外部模型／儲存依賴。 |
| Consultation | DeityProfile；主答、圖片、角色與三追問／替代題 | example與real分開；Gemini @google/genai直接generateContent，Vertex沿@google-cloud/vertexai1；原設定保留，真圖片bytes／MIME；無直接memory存取。 |
| ConversationMemory | UserConversation／ConversationTurn；唯一持久擁有者 | 本機私有檔／Firestore其一、read-before-write、REL pending-write、legacy唯讀、新session；對BotExperience只回資料與狀態。 |

## Service, Failure Domains & Shared Resources

只有一個service Unit，沒有新微服務。BotExperience 單向呼叫 CrystalKnowledge、Consultation、ConversationMemory；三者不互相／反向呼叫。server配置、deadline utility、安全logger及SDK clients是同程序資源；mutable conversation 僅由Memory管理，其他模組無共用全域history。

| 失敗來源 | 影響範圍 | 隔離與復原 |
|---|---|---|
| 本人資料讀錯／未知寫 | 本身分持久功能 | 不寫未知snapshot；明示非持久諮詢、pending直至settled，其他人queue獨立。 |
| Gemini／Vertex失敗 | 當前real諮詢 | bounded deadline及安全錯誤，原確定性功能／example仍可用；不得假裝real成功。 |
| LINE圖片／reply／menu | 對應平台事件／動作 | 期限／交付狀態分別辨識；動畫非必要，未知reply不自動retry。 |
| 素材圖片失敗 | 對應卡／角色視圖 | 名稱、文字alt及動作仍在；不影響生日計算。 |
| Node程序／私有目錄不可用 | 單服務或Memory | 無HA；保留資料、停止／重啟reread及本機smoke，正式復原平台延後。 |

## Infrastructure Handoff & Alternatives

交給Infrastructure Design的最小運行需求：Node24/Express單程序、public素材、私有MEMORY_DIR、server環境設定、loopback8080、可選公開LINE模式HTTPS入口。無必需Docker／AWS／GoogleCloudRun建置、Redis／worker／load balancer。外部模型／Firestore／LINE仍是既有可選依賴與真實adapter，不改為分開舊Bot。

選定同程序四責任區塊＋依賴注入，能在一天實作／驗證。分散式隊列／鎖、ADK多agent與新UI框架增加組裝，無展示所需收益，延後。所有NFR映射見traceability.json；全部原功能與17stories／52AC由既有functional-spec承接。

## Assumptions & Open Questions

None. 本文件定義設計與運行需求，不宣稱已建立環境／安裝SDK／實作完成。
