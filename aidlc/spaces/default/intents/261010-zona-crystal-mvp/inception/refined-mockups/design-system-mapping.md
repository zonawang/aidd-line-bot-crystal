# Zona Crystal — 素材與設計映射

## Sources

- [wireframes.md](../../ideation/rough-mockups/wireframes.md)、[user-flow.md](../../ideation/rough-mockups/user-flow.md)：S1–S8 與完整旅程。
- [stories.md](../user-stories/stories.md)：17 個已核准故事及 52 個 AC。
- [requirements.md](../requirements-analysis/requirements.md)：全部 FR／NFR 與原有行為；最新 spec 優先於草圖簡稱及舊延後項目。
- [team-practices.md](../practices-discovery/team-practices.md)、[refined-mockups-questions.md](refined-mockups-questions.md)：最小深度、重用、test-after 與已確認設計方向。

## Existing System & Mapping

沒有已提供的正式網頁設計系統；以原生 HTML 控制及少量樣式對應既有 LINE 功能。不新增套件庫、品牌重設或另建 frontend service。

| 原功能／素材 | LINE 呈現 | 本機對應／元件 |
|---|---|---|
| 日期／文字 | Datetime Picker／文字訊息 | C3 date＋文字輸入＋提交 |
| 水晶卡池／圖片 | Flex 三卡與選卡動作 | C4 三卡、文字替代、原圖片來源；七款卡池與 #水晶 入口保留 |
| 三個追問及額外捷徑 | Quick Reply | C5 完整題目 button＋另外日期／生命靈數動作 |
| 四角色 | sender name／iconUrl | C5 角色名與頭像；ATHENA/VENUS/FORTUNE/COSMOS 依 spec 映射 |
| richmenu_resized.jpg／五宮格_resized.jpg | 原 Rich Menu／切換動作 | C6 等比圖片與具名原生文字動作，主第二格保留教學分享 URL |
| Loading Animation | LINE loading 呼叫 | C7 行內狀態＋模擬標示，不宣稱真的手機動畫 |
| 記憶／Echo | 文字與模式訊息 | C1 固定 A／B、目前模式；C7 記憶狀態與重啟教學 |
| 既有指南 | 原內容與文字入口 | C6 行內可讀內容；六個原文字入口不變 |

既有來源是 /private/tmp/zona-crystal-review/line-datetime-picker/index.js、setup-rich-menus.js 與已盤點 line-flex-message/index.js。來源路徑用於本次核對，不要求讀者日後在同一路徑取得應用程式。公開素材最終位置由 Code Generation 明定，不能再暴露整個專案根目錄。

## Minimal Style Tokens

| token | 值／用途 |
|---|---|
| canvas | #F7F6FA 淺底；surface #FFFFFF |
| text | #242033；文字主色；muted #5C566B，用於次要文字 |
| accent | #4B0082，沿用原紫水晶色作本機主要動作；白字 |
| boundary／focus | #756B85 邊界；accent 2 px focus outline、2 px offset，保留原生控制焦點 |
| error | #8F1D35，搭配錯誤文字，不能只靠色 |
| type | system sans-serif，正文至少 16 px；h1 24、h2 20、h3 18；行高 1.5 |
| spacing | 8、16、24 px；44 px 最小控制目標；8 px 相鄰動作間距 |
| radius | 8 px 控制／12 px 卡片；無裝飾性陰影或非必要動畫 |
| width | 375／1280 驗證；1024 分欄；1120 最大桌面內容寬度 |

這些是小量 CSS 值，不是新設計系統／認證。本機示意的水晶色與幾何區塊是素材佔位，不替換正式既有圖片；不得把原卡池的較淺晶體色直接當小字主色而造成低對比。

## Contrast Verification & Implementation Handoff

文字設計目標為 4.5:1、控制邊界／焦點至少 3:1；以 sRGB relative luminance 公式核對 text/muted/error 對白與 canvas，以及白字對 accent，結果見 [design-validation.md](design-validation.md)。此驗證僅對指定色對，不是整個產品可用性／WCAG 通過。

實作仍須有 label、button/a、欄位錯誤及文字替代，不能因色對通過而省略鍵盤與畫面檢查。手機三卡直向、教學說明可收合；桌面並列與側欄如 mockups，長文字完整折行。

## Assumptions & Open Questions

None. 實際素材載入及手機呈現待實作；沒有創建外部選單／alias 或改預設選單。
