**Collaborator:** aidlc-quality-agent

## Contribution

本次僅盲審四份 lead 初稿，以及 aidlc-state.md、active-space 的 org／team／project／inception 規則、核准交接摘要與 scope-document.md；未讀其他協作者貢獻，未掃描或執行應用程式。兩個 space-level 本角色／共享知識目錄不存在。team／project 的測試章節為空模板，不構成已確認慣例；目前沒有應用程式、測試結果、覆蓋率或 CI 通過證據。

- **方法與底線**：test-after 的 Methodology／Ordering 明確，符合 org 預設；Given／When／Then 驗收格式不等於改採 BDD 開發。org 的 80% 行覆蓋率與合併前 CI 底線列明適用 mvp／enterprise／feature／infra／classic，未列自訂 zona-crystal-one-day；本次不憑名稱自行套用，也不能降低後續確認為適用的底線。品質知識中的一般 80% 目標不是本次已確認承諾。
- **Minimal 的可驗證定義**：建議明列每項可測需求至少一個對應測試，並保留每個可測元件的正常路徑底線；由後續 FR／AC 決定實際案例，不把 CAP 數量當固定測試數或上限。沿用的測試保持通過。少量本機整合／啟動驗證用來證明已核准的端到端完成條件；不因此擴大成全面 E2E 或效能套件。
- **最低關鍵驗證**：生日文字與日期選擇匯入、真實日曆的無效日期／閏日、生命靈數、三卡互異與選卡內容對應；Echo 進入／退出；文字／圖片分支；三個追問及點擊續談；四角色名稱與頭像；等待與外部失敗後可恢復；雙選單切換／返回及各指南。持久記憶須使用可重建實例／重啟的實際本機儲存驗證 A 回憶與 B 隔離，不能只用同一個記憶體物件證明。測試使用虛構資料、各自獨立資料目錄與固定範例，不依賴執行順序或付費服務。
- **交接審查補充**：IB4 的驗證需明確列出 A／B 身分選擇、目前身分及重啟後沿用 A；CAP5／CAP10 需每個角色的示例輸入、預期名稱／頭像及既有規則來源。這些是已核准補充，不需再次詢問是否保留功能。
- **CI 與證據**：建議本機與 CI 使用同一個可重現命令，失敗的關鍵測試及適用 lint／format 檢查阻擋合併；執行保留的既有測試與已確認覆蓋率底線。記錄命令、環境、exit code 和需求對照。檢查命令仍須後續正式選定，不能在本次盲審宣告已授權或已執行。模型／LINE 測試替身只能證明本機分支與呼叫行為；真實模型、外部記憶服務及手機呈現另列未驗證或實測結果。
- **訪談缺口**：Testing Posture 需人工作答確認 test-after 順序、上述需求導向最低驗證及本機／CI 共用檢查；工具與具體命令可留待實作，不為此新增長時間調查。不要將一日目標解讀成省略 CAP1–CAP10 或以正常生日旅程取代全功能驗證。全量負載、soak、正式可用性與自動擴展驗證維持延後。

## Positions

- AGREE: team-practices.md 的 test-after、Minimal、外部證據分列及不擅自套用 80% 做法；依據 org.md Testing Posture、自訂 scope 的 state 設定與核准 scope-document.md 的驗證邊界。
- AGREE: discovered-rules.md 保留全部功能、一天／十分鐘停損與不冒稱外部成功；依據最新人工範圍及 initiative-brief.md。
- OBJECT: team-practices.md 目前「遵循 Minimal」與功能清單尚未明列每項需求測試／元件正常路徑底線；整合時補上一句即可，並把重啟持久記憶、A／B 操作和四角色示例列為可重現驗證。依據 testing-guide.md 的 requirement-driven Minimal 策略及 initiative-brief.md 的完成證據／已核准審查補充。此異議不要求提高百分比、新增管理頁或全面測試套件。
