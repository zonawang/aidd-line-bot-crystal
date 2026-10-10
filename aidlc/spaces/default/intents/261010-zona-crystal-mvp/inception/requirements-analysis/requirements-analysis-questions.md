# Zona Crystal — 需求整理與產出前確認

## Sources

- Initial description: Build Zona Crystal as a demonstrable, teachable and shareable LINE Bot using an MVP-first, one-working-day timebox. Complete the full AI-DLC lifecycle with every stage at minimal sufficient depth. Prefer the simplest local end-to-end environment, lightweight requirements and design, implementation bias, critical-path tests, documented limitations and deferred items. Stop investigating any architecture, infrastructure, dependency, environment or design issue after 10 minutes and choose a workaround or reduce scope. Core proposed journey: enter birthday, receive three crystal recommendation cards, select one to learn more. Defer image recognition, permanent memory, advanced astrology and production readiness unless essential. Time-to-MVP is the highest priority.
- `aidlc engine workspace project-description` 回傳來源 `project-description.json`；上列保留原始請求，較晚的人工作答優先於其中舊的功能延後訊號。
- [intent-statement.md](../../ideation/intent-capture/intent-statement.md)：用途、一天時限與主展示旅程。
- [scope-document.md](../../ideation/scope-definition/scope-document.md)：最新已核准 CAP1–CAP10、全功能整合、必要持久記憶與外部證據邊界。
- [team-practices.md](../practices-discovery/team-practices.md)：已核准 test-after、Minimal、逐需求測試、本機交付、最小安全及風格慣例。
- [initiative-brief.md](../../ideation/approval-handoff/initiative-brief.md)、[wireframes.md](../../ideation/rough-mockups/wireframes.md)：A／B 展示身分、四角色示例與互動／復原路徑。
- 既有 `line-datetime-picker/index.js`，本次已盤點的提交 `cc1f1938f11012a6518b7ecb2fab840984d9f478`，第 175–178、336–350、357–398 行：主題、實際 sender 名稱、日期格式及生命靈數規則。只補讀相關片段，沒有重新掃描全部 repo。

## Analysis & Depth

類型為新整合產品，沿用既有功能而不是只重寫文件；範圍涵蓋全產品，但用單一應用程式和既有素材降低實作成本。多個外部依賴使完整整合有不確定性，依已核准一日時限仍採 Minimal 深度，不追加長期架構研究。

已核准資料足以定義需求，不重新詢問功能保留、教學用途或測試方法。以下六維度皆有清楚邊界；外部憑證與實測成效是待驗證依賴，不是產品方向缺口。本階段不新增一般澄清題，僅保留明定的產出前摘要確認。

## Six-Dimension Completeness

| 維度 | 已知需求及處理 |
|---|---|
| 功能 | CAP1–CAP10 全部保留；各功能至少一條關鍵驗證，生日三卡不是唯一完成條件。 |
| 非功能 | 驗簽、使用者隔離、公開素材邊界、秘密處理、可復原等待／錯誤、實際持久記憶、本機啟動；不新增正式容量、可用率或延遲 SLA。外部處理使用可設定的有限等待與失敗提示，具體值後續最小設計決定。 |
| 情境 | 主旅程、文字／圖片、三追問、四角色、選單與指南、Echo 進入／退出、A／B 與重啟回憶；包含無效日期、服務與記憶失敗、素材不可用。 |
| 商業／使用目標 | 展示、教學、分享；使用者與 Codex 分工、一日時限及十分鐘停損已決定，不新增採購。 |
| 技術情境 | 本機教學與真實 LINE／模型／持久記憶串接保留；不預設憑證可用。沿用 JavaScript／Node；具體套件／儲存方式留到最小設計，不阻擋可觀察需求。 |
| 品質 | test-after、逐需求／元件正常路徑、本機與 CI 共用檢查、鍵盤與文字替代、繁體中文介面；不作 WCAG 認證或正式營運承諾。 |

## Clarified Behavioral Defaults

以下為已核准範圍與既有程式可確定的細節，不是新增人工作答：

- 日期保留原有文字形式：YYYY-MM-DD、YYYY/MM/DD、YYYY年M月D日、以空白分隔的年月日、YYYYMMDD，以及 LINE 日期選擇結果；文字可包含原有「我的生日是」等句子。須驗真實曆日和閏日，錯誤不生成結果且可修正；不額外加入原範圍未要求的年齡條件。
- 生命靈數沿用生日數字逐位相加並反覆縮減至 1–9；不改成保留 11／22／33 的另一套規則。有效生日帶出三張不同卡與對應選卡內容。
- 諮詢提供三個可點選追問；原有生日日期選擇與「了解我的生命靈數」捷徑另外保留，不把「三個追問」誤當全部 Quick Reply 只能有三個項目。
- A／B 是本機固定展示身分，頁面顯示目前身分並能切換；重啟後可重新選 A 讀回 A 的必要記憶。真實 LINE 使用已驗證事件中的使用者身分，不能採信公開輸入的任意 A／B 身分。
- 四角色示例：事業／學習 → ATHENA「智慧守護神 雅典娜」；愛情／關係 → VENUS「金星守護神 維納斯」；財運／運勢變化 → FORTUNE「命運之輪 莫伊萊」；綜合／水晶鑑定 → COSMOS「星曜守護導師 艾蓮」。COSMOS 實際 sender 名稱以上述原程式設定為準，補正草圖使用的簡寫，不改寫舊文件。
- 教學示例提供可重現角色輸入與預期名稱／頭像；真實模式沿用主題選擇行為，模型輸出仍需驗證。缺少有效角色時使用既有預設 COSMOS，不把技術標記當一般回答。
- 必要對話文字及生日記憶按使用者持久保存，直到展示者依文件進行重設；本次不新增自動保存圖片原檔或秘密的需求。本機重設步驟須說明受影響資料，不在一般互動中自動刪除記憶。
- 不增加登入後台、搜尋／分頁、資料匯出、付費平台或精確天象計算。指南與原有文字觸發入口保留；本機模擬明示，真實模式失敗不得偷偷換成成功範例。

## Ambiguity & Contradiction Resolution

較早的原始請求、intent-statement 與可行性文件把圖片／記憶延後，已被使用者全功能 scope-document 取代。team-practices 已承接必要持久記憶及全功能驗證；本階段依最新範圍，不沿用舊刪減。

具體套件、外部憑證、模型成效與手機呈現尚未決定或實測，記為設計／驗證依賴，不填成已通過。所有新增細節均連回既有程式、草圖、範圍或已核准慣例；沒有阻擋需求產出的未解產品方向。

## Assumptions & Open Questions

None. 本機與外部證據、工具落地及新整合成效保留為明示待驗證工作，不假設會成功。

## Consolidated Summary Confirmation

- 為全部 CAP1–CAP10 建立永久 FR／NFR 識別與可判定通過／失敗的驗收條件，需求來源連回最新範圍與慣例。
- 主旅程包含真實生日驗證、原規則生命靈數、三張不同卡、對應選卡介紹與追問；生日與生命靈數 Quick Reply 捷徑保留。
- 保留 Echo、文字／圖片、持久記憶、三追問、四角色、雙選單、指南與等待提示；補齊 A／B 操作、重啟回憶與四角色示例。
- 本機不需金鑰的教學模式清楚標示，真實 LINE／模型／記憶串接保留；外部未驗證不冒稱通過，失敗有復原。
- 只納入已核准的最小安全、可用性及測試要求；一日時限、十分鐘停損與最少設計維持，不新增正式部署或營運承諾。

Does this all look correct before I generate the requirements artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
