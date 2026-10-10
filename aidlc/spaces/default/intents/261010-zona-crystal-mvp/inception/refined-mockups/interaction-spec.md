# Zona Crystal — 互動與元件規格

## Sources

- [wireframes.md](../../ideation/rough-mockups/wireframes.md)、[user-flow.md](../../ideation/rough-mockups/user-flow.md)：S1–S8 與完整旅程。
- [stories.md](../user-stories/stories.md)：17 個已核准故事及 52 個 AC。
- [requirements.md](../requirements-analysis/requirements.md)：全部 FR／NFR 與原有行為；最新 spec 優先於草圖簡稱及舊延後項目。
- [team-practices.md](../practices-discovery/team-practices.md)、[refined-mockups-questions.md](refined-mockups-questions.md)：最小深度、重用、test-after 與已確認設計方向。

## Shared UI Contract

單頁使用 header、main、nav、aside 與合理 h1/h2/h3。輸入有 label，動作用原生 button／a；預覽採 SVG 靜態示意，應用程式稍後實作。設計元件欄位按 component-spec-template：名稱／類別、狀態、輸入、響應式、鍵盤／可讀標籤與焦點。不新增元件框架。

下面的 input 是 UI 行為契約，不在此建立公共 API 或鎖定儲存／套件。資料不得以 innerHTML 呈現任意使用者／模型文字；素材只走公開區，不輸出秘密。

## Component Specifications

### C1 — ModeIdentity（導覽／顯示）

| 欄位 | 規格 |
|---|---|
| 說明 | 教學模式、諮詢／Echo 與目前 A 或 B；A／B 是本機身分，真實 LINE 用驗證事件身分 |
| Inputs | mode：必填，consult／echo；identity：教學模式必填，A／B；busy：boolean，預設 false |
| States | default 顯示目前值；hover／focus 可見；busy 時身分切換 disabled 並說明等待；沒有身分時提示選擇，不查另一人 |
| Action | 明確選身分後切換對話視圖；清掉另一身分的視圖，讀取新身分必要歷史。選擇不自動送出諮詢；目前請求完成／失敗後才可切換 |
| Responsive | 375 可換行，1280 同列；可讀文字常駐 |
| Accessibility | 原生 select＋label；Tab／方向鍵選、標準選擇操作；polite 狀態提示現在身分，保持選擇器焦點 |

### C2 — MessageComposer（輸入／動作）

| 欄位 | 規格 |
|---|---|
| 說明 | 文字／圖片詢問與明確送出；不要求先有生日 |
| Inputs | text：string，預設空；file：選擇的圖片或無；busy：boolean；實際格式／大小限制來自後續設計設定 |
| States | empty 有歡迎與提示；default 可輸入；hover／focus 可見；loading 同一請求的送出 disabled；error 保留輸入及重試／改文字；success 恢復操作 |
| Action | 文字表單明確送出；textarea 可換行，不綁 Enter 為唯一送出。圖片原生 file 選擇後明確提交，不靠拖拉。Echo 收到圖片只顯示文字模式提示 |
| Responsive | 控制不超過內寬，375 分行，1280 可同列 |
| Accessibility | label 與欄位關聯，Tab 到送出、Enter／Space 啟動；錯誤用 aria-describedby／alert，不搶焦點；輸入標籤清楚 |

### C3 — BirthdayInput（輸入／動作）

| 欄位 | 規格 |
|---|---|
| Inputs | date：日期值或無；birthdayText：string；validationError：string 或無；不加 min/max 年齡限制 |
| States | empty 提示 2000-01-01；focus／hover 可見；error 保留生日與修正提示；success 已選生日及生命靈數／三卡；處理中暫停同一提交 |
| Action | 原生日期＋文字替代，使用者明確提交；LINE date postback 保留。真實曆日、閏日與原形式後端驗證；錯誤不產生數字／新卡。有效生日之後加入生命靈數捷徑 |
| Responsive | 單欄手機，桌面可並列，標籤在上 |
| Accessibility | label／說明／錯誤關聯；Tab 到欄位及提交，修正仍可用；錯誤不只變紅 |

### C4 — CrystalCards（顯示／動作）

| 欄位 | 規格 |
|---|---|
| Inputs | cards：有效日期後恰三筆不同的 id/name/summary/image/action；selectedId：可選；設計示例不是固定推薦資料 |
| States | empty 尚未推薦；success 三卡可操作；hover／focus 選卡動作可見；partial 圖片失敗但文字／按鈕可用；error 未知識別提示重選 |
| Action | 「選擇〈水晶名〉」傳對應卡識別，回對應介紹；返回三卡保留本次三卡。另保留既有 #水晶／今日水晶推薦入口；原卡池不是只剩示例三款 |
| Responsive | 375 直向三卡；1280 三等欄，不要求手勢輪播 |
| Accessibility | h2 推薦水晶、h3 卡名；圖片 alt 水晶名，按鈕可讀名稱關聯；Tab 每卡、Enter／Space 選；圖片失敗不移除動作 |

### C5 — ReplyFollowUps（顯示／動作）

| 欄位 | 規格 |
|---|---|
| Inputs | sender：有效角色或預設 COSMOS；text：回答；questions：三個相關題目；birthday：有效日期或無；evidenceLabel：有範例／替代時必填 |
| States | waiting 行內狀態；success 角色／回答／三問題；partial 頭像失敗仍名稱、追問失敗用標示替代；error 真實錯誤如實提示，不變成功範例 |
| Action | 每題以完整題文繼續；另顯示日期選擇和有效生日後生命靈數捷徑；不把三追問當整組上限。回覆文字安全呈現，技術角色標記不顯示 |
| Responsive | 手機／桌面均完整換行；不截斷題文作唯一標籤 |
| Accessibility | 角色名與回答可讀，普通新增回覆 polite 提示；不讓整段歷史每次重播。button 用完整問題，焦點留觸發控制；選卡／追問結果可透過標題與狀態找到 |

### C6 — MenuGuides（導覽／顯示）

| 欄位 | 規格 |
|---|---|
| Inputs | currentMenu：main／five；guideKey：既有入口之一或無；assets：原素材；switchError：可選 |
| States | default 主素材／兩動作；five 五宮格／五動作；guide 行內內容；partial 圖載入失敗文字動作仍在；error 切換失敗如實提示、返回仍可用 |
| Action | 主 → 五 → 主；指南別名沿用；主第二格開原教學分享 URL。LINE 保留原 alias／switch data 路徑，不執行破壞性資源重設。使用指南含日期、卡、Echo 入口；閱讀可繼續諮詢 |
| Responsive | 素材等比縮放，文字動作可換行；沒有靠座標圖片才可點的唯一路徑 |
| Accessibility | nav 具名、主／五狀態有文字；原生 button／a＋可讀標籤；Tab 全部入口，返回不失去操作來源 |

### C7 — StatusTeaching（回饋／說明）

| 欄位 | 規格 |
|---|---|
| Inputs | status：empty／loading／success／error／partial；memoryNotice：可選；localExample／lineSimulation：適用時文字標示 |
| States | loading「正在整理回覆」；success 清除等待；error 重試／改文字；空記憶與讀寫失敗分開；partial 不隱藏可用功能 |
| Action | 逾時上限、格式大小限制與命令引用後續實際值，不能編造成功。教學 steps 包含 A／B、重啟再選 A、四角色原輸入、證據與限制；重設不放無警示刪除按鈕 |
| Responsive | 375 在主要操作後可收合；1280 右欄；操作不因折疊說明被隱藏 |
| Accessibility | loading／普通完成 role=status、aria-live=polite；重大輸入錯誤 alert／欄位說明。details／summary 原生鍵盤；不新增非必要動畫，尊重 reduced motion |

## Interaction Transitions & Recovery

| 觸發 | 轉移 | 等待／失敗／焦點 |
|---|---|---|
| 有效生日提交 | S2 → S3 → 可選 S4 | 顯示日期／數字／卡；只更改目前身分。錯誤留 S2、可修正，不生成新卡 |
| 選卡／點追問 | S3 → S4 → S5 | 對應卡／完整題文；若有非同步等待，完成或失敗都恢復動作，保持觸發焦點 |
| 文字／圖片提交 | S1／S4／S7 → S5 → S6 | 同一請求避免重送；上限有限，讀寫／模型／圖片失敗明示，下一次可重試 |
| 身分切換 | S1／S6 A ↔ B | 請求在途先保持目前身分／顯示等待；切換後移除他人視圖，新讀取失敗不顯示舊人的歷史 |
| 雙選單／指南 | S1 ↔ S7 | 文字入口／返回永遠可達，切換失敗不冒稱外部成功 |
| Echo 進出 | S1／S7 ↔ S8 | 進出先處理命令；不把退出回聲，模式變更可讀，非文字提示 |

## Example Labels & Evidence

固定文字：「教學範例回覆」；固定圖片：「圖片辨識範例，非真實辨識」；本機 LINE 動作：「LINE 操作模擬」；替代追問：「教學替代問題」。適用標示位於對應結果附近，不只頁首。真實串接的替身／實機證據放文件，不把密鑰／例外堆疊塞一般對話。

## Assumptions & Open Questions

None. 等待上限、圖片大小／格式與儲存／公開入口邊界由後續最小設計落地；有金鑰的真實模式和沒有金鑰的本機模式如實區分。規格不是測試結果。

