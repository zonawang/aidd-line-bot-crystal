# Zona Crystal — 無障礙與操作驗證清單

## Sources

- [wireframes.md](../../ideation/rough-mockups/wireframes.md)、[user-flow.md](../../ideation/rough-mockups/user-flow.md)：S1–S8 與完整旅程。
- [stories.md](../user-stories/stories.md)：17 個已核准故事及 52 個 AC。
- [requirements.md](../requirements-analysis/requirements.md)：全部 FR／NFR 與原有行為；最新 spec 優先於草圖簡稱及舊延後項目。
- [team-practices.md](../practices-discovery/team-practices.md)、[refined-mockups-questions.md](refined-mockups-questions.md)：最小深度、重用、test-after 與已確認設計方向。

## Target & Evidence Boundary

承接 NFR4／AC10.1.2，以 WCAG AA 常用標籤、對比、鍵盤與狀態原則指導最小設計，不承諾認證。本階段只核對設計與指定色對；下面「應用程式檢查」全部待實作，不能把設計示意當正常 Bot。

## Design Checks

- [x] 定義 375／1280 CSS px；單欄／雙欄及卡片、追問換行規則。
- [x] S1–S8 包含空、等待、成功、錯誤與部分可用；可回主入口與修正。
- [x] 七個設計元件都有可讀名稱、原生控制、鍵盤與焦點約定。
- [x] 素材失敗仍有文字／動作，模式、身分、等待與錯誤不只靠顏色。
- [x] 三個追問之外保留日期／生命靈數捷徑；故事及全功能不刪。
- [x] 範例／模擬就近標示，COSMOS 正式名稱與四角色原輸入已承接。

## Application Checks — Pending

| 檢查 | 操作／可判定結果 | 關聯 | 狀態 |
|---|---|---|---|
| 手機與桌面 | 375、1280 寬度各操作生日、三卡逐卡、三追問逐題、選單、圖片、A／B、Echo；無整頁水平溢出、主要動作可用 | AC10.1.2；全部功能 | 待實作 |
| 鍵盤 | Tab 到身分、文字、日期、圖片、送出、選卡、追問、額外捷徑、選單／指南與 Echo 退出；Enter／Space 啟動，焦點可見且不困住 | NFR4、C1–C7 | 待實作 |
| 標籤／語意 | lang=zh-Hant、h1→h2→h3、header/main/nav/aside；input label、button／a 可讀名稱，非裝飾圖有文字替代 | NFR4、AC5.1.3、AC9.1.3 | 待實作 |
| 動態狀態 | 普通更新 polite，錯誤 alert／欄位描述；不每回合重播全部歷史或搶焦點；等待、逾時與復原可讀 | AC7.1.1–AC7.1.3、NFR2 | 待實作 |
| 錯誤修正 | 無效生日、圖片／模型／記憶失敗、未知卡、圖載入失敗都有文字與下一步；下一次正常操作成功 | 各失敗 AC | 待實作 |
| 視圖隔離 | A／B 切換之後清除另一身分畫面，錯誤讀取不留下他人內容；目前身分常駐 | AC3.2.1–AC3.2.3 | 待實作 |
| 長文／縮放 | 長問題與回覆不遮擋操作；200% 縮放做一次必要 smoke，不新增多裝置矩陣 | NFR4 | 待實作 |
| 色／動態 | 實際色對符合設計值，錯誤及成功有文字；無閃爍／非必要動畫，reduced-motion 可用 | NFR4、樣式 tokens | 待實作 |
| 如實標示 | 每次固定文字／圖片、LINE 動作與替代問題都近結果標示；真實錯誤不變範例成功 | AC2.2.2、AC4.1.3、AC10.1.1 | 待實作 |

檢查由後續最小測試／本機操作取得具體結果與證據。安全、外部等待、逐需求檢查命令及診斷另依 NFR1–NFR3／NFR5 驗證，不能只用此 UX 清單替代。LINE 手機原生日期／卡片／Quick Reply／頭像／選單／動畫另列實測，缺憑證時記未驗證。

## Assumptions & Open Questions

None. 沒有廣泛相容性或認證承諾；所有待實作列項需在最終交付如實更新結果，不能無證據打勾。

