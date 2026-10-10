# Zona Crystal — 互動草圖方向

## Sources

- [intent-statement.md](../intent-capture/intent-statement.md)：展示、教學、分享用途與一天時限。
- [scope-document.md](../scope-definition/scope-document.md)：最新已核准 CAP1–CAP10 全功能整合範圍；取代較早將圖片與記憶延後的邊界。
- [intent-backlog.md](../scope-definition/intent-backlog.md)：IB1–IB7 的主旅程、延伸功能及驗證順序。
- 使用者已授權後續階段採最簡單 MVP-first 建議；本文件的設計預設為依此授權提出的方向，並非新增人工作答。

## Design Questions & Recommended Defaults

| 設計問題 | 最簡單可行方向 | 依據 |
|---|---|---|
| 使用者從哪裡開始？ | LINE 對話與原有雙選單；本機教學頁提供相同互動入口與 Echo 模式入口 | CAP1、CAP6、CAP10 |
| 主操作路徑？ | 選日期或輸入生日 → 生命靈數與三張不同水晶卡 → 選卡介紹 → 三個可點選追問 → 記憶延續 | CAP3、CAP4、CAP8、CAP9；IB1 |
| 資訊如何排序？ | 最新回覆優先；角色名稱與頭像、主要動作、後續追問隨回覆呈現；指南從選單進入 | CAP4–CAP6；IB5、IB6 |
| 沿用哪些視覺？ | 沿用既有水晶圖片、四角色頭像、主選單與五宮格素材；草圖僅描述結構，不另做高擬真裝飾 | 已核准沿用方向與一天時限 |
| 支援哪些裝置？ | LINE 手機對話優先；本機教學頁能在手機寬度與桌面瀏覽器操作，桌面增加展示說明區 | CAP10；本機優先 |
| 無障礙如何處理？ | 每個畫面標註標題層級、主要區域與鍵盤起點；本機提供可讀標籤、可見焦點及日期文字替代；LINE 原生控制依平台能力 | 本階段要求；不是 WCAG 合規認證 |

## Additional Required Journeys

- 文字／圖片諮詢 → 可見等待狀態 → 依主題呈現四角色之一 → 三個追問 → 下一回合讀取使用者記憶；既有水晶及星座諮詢保留。
- 主選單 ↔ 五宮格；使用指南、認識水晶、淨化方法、功效與佩戴各有可操作入口與返回路徑。
- Echo 模式可辨識、可退出並回到諮詢；不讓使用者誤以為 Echo 是 AI 回覆。
- 本機教學頁清楚標示教學模式；固定 AI／圖片範例與模擬 LINE 操作各自標示。真實服務和手機端驗證狀態另列於教學說明，不塞入一般對話操作。

## State & Recovery Requirements

- 初始狀態提示可選生日、文字諮詢、圖片諮詢或指南；不要求首次先輸入生日才能使用其他功能。
- 等待狀態提示正在處理；成功回覆提供下一步。
- 無效生日指出日期問題並讓使用者重新輸入／選擇；保留其他入口。
- 諮詢失敗、圖片無法處理或服務暫不可用時，給重試或改用文字的操作；不將失敗標成辨識成功。
- 記憶為空時正常開始新對話；有記憶時能回憶，重新啟動後仍延續。記憶無法讀寫時如實提示，不宣稱已保存。
- 三卡或選單部分未載入時提供文字替代或返回入口；草圖涵蓋初始、等待、成功、錯誤及部分可用狀態。

## Contradiction Analysis

全部既有功能必須整合；生日三卡只是主展示路徑，不取代其他功能。一天內以沿用素材、結構描述與低擬真草圖完成，壓縮裝飾及重構，不自行刪除 CAP1–CAP9。本機互動預覽與真實 LINE 手機表現不冒稱相同驗證證據。

## Assumptions & Open Questions

None. 以上為已核准範圍下的設計預設；本次不額外承諾品牌重設或無障礙認證。

## Consolidated Summary Confirmation

將依上述方向產出 wireframes.md 與 user-flow.md：沿用全部既有功能，以生日三卡為主旅程，另外描述諮詢、記憶、角色、追問、動畫、雙選單、指南與 Echo；包含本機教學呈現、無障礙註記及錯誤復原。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
