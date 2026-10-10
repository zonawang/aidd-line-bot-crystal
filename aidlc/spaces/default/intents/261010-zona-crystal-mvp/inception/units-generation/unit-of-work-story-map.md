# Zona Crystal — 全部故事與工作單位對照

## Sources

- [stories.md](../user-stories/stories.md)：17個Must故事及52個AC，保留全部驗收內容。
- [requirements.md](../requirements-analysis/requirements.md)：全部原功能與NFR1–NFR5。
- [unit-of-work.md](unit-of-work.md)：唯一Unit U1及四元件責任。
- [units-generation-questions.md](units-generation-questions.md)：已確認全故事同一Unit。

## Story Mapping & Within-Unit Order

以下只記錄U1內故事實作次序；不是跨Unit排序或Bolt經濟規劃。入口附最薄教學操作殼，US10.1完整驗收仍須全部功能可操作。每個故事的原AC不因次序而縮減，全部都是本次Must。

| Within-unit order | Story ID | Story | Unit ID | Directory | Primary logical responsibility |
|---|---|---|---|---|---|
| 1 | US1.1 | 進入同一產品 | U1 | u1-zona-crystal-bot | BotExperience |
| 2 | US8.1 | 生日輸入與修正 | U1 | u1-zona-crystal-bot | CrystalKnowledge、BotExperience |
| 3 | US8.2 | 取得生命靈數 | U1 | u1-zona-crystal-bot | CrystalKnowledge、BotExperience |
| 4 | US9.1 | 三卡與選卡介紹 | U1 | u1-zona-crystal-bot | CrystalKnowledge、BotExperience、Consultation |
| 5 | US3.1 | 重啟後仍有記憶 | U1 | u1-zona-crystal-bot | ConversationMemory、BotExperience |
| 6 | US3.2 | 切換A／B身分 | U1 | u1-zona-crystal-bot | BotExperience、ConversationMemory |
| 7 | US1.2 | 體驗及退出Echo | U1 | u1-zona-crystal-bot | BotExperience、ConversationMemory |
| 8 | US6.1 | 雙選單往返 | U1 | u1-zona-crystal-bot | BotExperience、ConversationMemory |
| 9 | US6.2 | 閱讀既有指南 | U1 | u1-zona-crystal-bot | CrystalKnowledge、BotExperience |
| 10 | US2.1 | 文字諮詢 | U1 | u1-zona-crystal-bot | Consultation、BotExperience、ConversationMemory |
| 11 | US5.1 | 四角色回覆 | U1 | u1-zona-crystal-bot | Consultation、BotExperience |
| 12 | US4.1 | 點選三個追問 | U1 | u1-zona-crystal-bot | Consultation、BotExperience |
| 13 | US4.2 | 生日與生命靈數捷徑 | U1 | u1-zona-crystal-bot | CrystalKnowledge、BotExperience |
| 14 | US2.2 | 圖片諮詢 | U1 | u1-zona-crystal-bot | Consultation、BotExperience、ConversationMemory |
| 15 | US7.1 | 可復原等待 | U1 | u1-zona-crystal-bot | BotExperience |
| 16 | US10.1 | 全功能本機教學頁 | U1 | u1-zona-crystal-bot | BotExperience及其餘三元件 |
| 17 | US10.2 | 重現及解說交付 | U1 | u1-zona-crystal-bot | BotExperience及其餘三元件 |

## Cross-Cutting Concerns & Integration

所有故事只跨邏輯元件，不跨Unit。故事中的「依賴」保留為整合驗收參照；例如諮詢、記憶、三追問、角色及等待的相互整合不能被誤譯成循環Unit DAG。

- NFR1：US1.1、US3.2、US10.1、US10.2；驗簽身分、隔離資料與公開素材、秘密保護。
- NFR2：US2.1、US2.2、US3.1、US7.1；有限等待、讀寫／模型失敗辨識及下一請求復原。
- NFR3：US10.2；逐需求測試、逐元件正常路徑、本機與CI同檢查命令及適用底線。
- NFR4：US10.1；375／1280、繁體中文、原生控制、鍵盤與可見焦點。
- NFR5：US10.2；最小安全診斷及本機／模擬／外部待驗證證據。

## Coverage Verification & Acceptance Handoff

17／17個US各出現一次，全部指向U1及u1-zona-crystal-bot；唯一Unit有17故事，沒有未分配故事或空Unit。機器對照見[traceability.json](traceability.json)。

原52個AC全部保留給後續設計／測試。本次完成須涵蓋所有故事的整合行為與必要錯誤復原，不能以最薄生日三卡旅程取代全功能。記憶須用實際持久資料及新讀取實例／重啟、A／B隔離驗證；四角色、六指南、全部生日形式、三追問逐題與三卡逐卡須可重現。

本機固定AI／圖片內容與LINE動作標示範例／模擬；真實串接保留且錯誤不冒稱成功。沒有外部憑證或手機實測時明列待驗證，不宣稱LINE線上驗收已通過。此處覆蓋檢查是文件對照，不是應用測試結果。

## Assumptions & Open Questions

None. 不新增產品需求或跨Unit契約；具體Bolt、展示命令與驗證由後續適用階段落地。
