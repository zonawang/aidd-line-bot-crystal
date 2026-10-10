# 驗證證據與限制

## 已實作與本機替身

四同程序元件、原七卡／六指南／角色／素材／選單 data 保留。test-files.mjs 明列九個指定 node:test 檔（含 delivery），以實際 assertions 驗證；SDK 注入是隔離替身，未使用真秘密或寫原 Firestore。修復後完整 npm run check:u1：Prettier、ESLint、64 tests／64 pass／0 fail／0 skip，exit0；最後驗證環境 Node.js24.18.0／npm11.16.0／Darwin arm64，APP_MODE=demo、BOT_MODE=example，實際 restart 與 HTTP，SDK 為明示替身。暖機十次每次 ≤2000ms，修復後全檢陣列 [4,4,3,3,3,3,4,6,2,2] ms；測試未宣稱外部成功。

本機資料測試使用獨立臨時目錄與真正 JSON／rename／权限，包含新讀取實例、A／B、壞檔保留、讀寫失敗、未知結果 latch、五並行／慢 A 不阻塞 B；程序重啟與暖機測試見 delivery.test.js。DOM 使用 jsdom 實際 click／FileReader 與本機 HTTP，不等於真正瀏覽器或手機。

LINE 替身檢查 raw HMAC 拒絕、trusted userId、stream 圖片 bytes、Flex／sender／完整追問／date、原 menu IDs、loading 失敗、防重、共用批次期限及未知交付。Gemini／Vertex 替身檢查實際 bytes／MIME／必要情境傳入；真失敗不換範例。

首輪 review-01 判定 NOT-READY 的 R-01／R-02／R-03 已集中修復，未修改上游或核准計畫。新增回歸驗證：第一次 reply 明確拒絕後，平台重送用原計算結果與新 token 交付成功，實際私有 JSON revision 仍1、save／選單各僅一次；在途／未知結果仍不重播。合法缺 event ID 的兩位使用者各自處理，重送無穩定防重，不產生偽 ID。30000字正文（含／不含Flex）仍保留四來源標示、保存未知及外部／選單狀態，明示截短，每則≤5000字、合計≤5訊息。

## 真正瀏覽器

root 操作現有 Chrome／native AX，薄旅程已驗：2000-01-01 → 4；粉晶／鈦晶／白水晶各正確介紹與三追問；2001-02-29 提示並保留輸入，修正 2000-02-29 → 6／三卡成功。可取得頁面與截圖。繼承 iPhone 12 Pro 390×844 preset 的手機排列已看见。

全功能頁 native AX 已確認四組原輸入／原角色名稱／教學標示／三追問、Echo 進入／原樣「<水晶>」／退出、切至五宮格與正確圖片 alt、淨化指南。AX 摘要截斷不代表正文截斷：指南完整676字，HTTP與textContent保留全文。本機 DOM＋HTTP 另驗所有六指南、圖片 FileReader、逐追問、捷徑與回憶。

精確 375／1280 切換尚未驗證：browser extension authentication unavailable、DevTools popup AX 不响应、coordinate API noWindowsAvailable。薄頁曾取得390×844截圖；全功能Chrome截圖為空白而AX文字／互動可用，因此不宣稱全功能視覺通過。原生A／B dropdown及鍵盤工具未能變更選擇，人工A／B／鍵盤尚未驗證；DOM generation／label／focus與子程序A／B重啟證據分列。不能將390×844或DOM證據替代兩個指定寬度／完整人工鍵盤通過，已按技術問題限時停止工具追查。

## 依賴與外部未測

開發環境 Node.js 24.18.0、macOS arm64；lock 固定實際依賴。初次 npm audit 發現 Vertex 下 gaxios6.7.1→uuid9 的兩個 moderate 項，npm audit fix 沒解決；採 scoped override uuid11.1.1，gaxios 僅使用保留的 v4() API。後續 audit exit0／0漏洞；並以 delivery 測试驗真套件載入與 v4 compatibility。未使用 --force／降低門檻。

npm 安裝顯示兩個依賴 install scripts 尚未經 npm allowScripts 批准（@google/genai、protobufjs）；本機載入及替身路徑可运行，真外部服務仍需驗證，沒有擅自開啟全部 scripts。

真 Gemini／Vertex、真 Firestore、LINE webhook HTTPS／手機 sender／loading／Rich Menu、原手機日期元件與外部圖片穩定性均未實測。沒有建雲端資源、隧道、setup-rich-menus 或發布。外部設定不足／錯誤路徑本機可驗，不能宣稱外部已測。

LINE 防重只在目前程序內；跨重啟／多 instance exactly-once 未提供。儲存只有單 writer 邊界；未知 write 在該使用者解鎖前不可再保存。回退舊版本尚不存在，先停止／保留記憶，不冒稱回退已成功。沒有正式 SLA、廣泛相容性／負載或百分比 coverage 承諾。
