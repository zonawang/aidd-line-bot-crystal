# Zona Crystal — 一日交付規劃方向

## Sources

- [requirements.md](../requirements-analysis/requirements.md)、[stories.md](../user-stories/stories.md)：全部原功能、17個Must故事及52個AC。
- [mockups.md](../refined-mockups/mockups.md)、[components.md](../domain-design/components.md)：本機原生教學介面與四元件。
- [unit-of-work.md](../units-generation/unit-of-work.md)、[unit-of-work-dependency.md](../units-generation/unit-of-work-dependency.md)、[unit-of-work-story-map.md](../units-generation/unit-of-work-story-map.md)：U1單一service、零依賴及Unit內故事次序。
- [contract-summary.md](../contract-design/contract-summary.md)：五項契約與有限等待／身分／保存結果。
- [team-practices.md](../practices-discovery/team-practices.md)：test-after、main短期分支／worktree、squash、本機交付及十分鐘停損。
- [team-assessment.md](../../ideation/team-formation/team-assessment.md)、[mob-composition.md](../../ideation/team-formation/mob-composition.md)：一個產品工作群組，Codex主責，使用者處理明文必要決策與存取。
- 活動紀錄：17階段已核准，約141分鐘；專案根目錄沒有package.json、Makefile或pyproject.toml，尚無應用檢查命令。
- 使用者授權預設MVP-first自治；命令選擇、摘要及必要核准仍須遵循明文人工作答。

## Authorized Defaults

### Q1 — 交付批次、順序與完成條件

為一天內完成同一新版，如何安排Bolt（一次完成一組工作、以可運作成果結束的建置批次）？

- A. 一個Bolt B1整合唯一U1；內部先完成生日三卡端到端，再補齊全部功能與關鍵驗證，全部通過才算B1完成（推薦）。
- B. 重拆多個Unit及獨立部署批次，重新定義邊界與依賴。
- X. Other (please specify)

[Answer]: A

採使用者既定主旅程優先的價值排序，不做無必要的加權評分模型。17故事全Must，不能以最薄旅程代替完整交付。沒有跨Unit依賴或並行機會；先做可運作整合，再按test-after補每層測試。

B1的可觀察信心假設：無金鑰啟動同一Node應用後，可操作全部原功能，生日三卡／逐卡介紹正確、三追問可延續、A／B與重啟記憶隔離、文字／圖片範例及LINE模擬如實標示；保留真實服務呼叫路徑，受控失敗後可再操作。這不是市場訪談或真實模型品質證明。

### Q2 — 分工、執行方式與外部等待

這次由同一Codex工作階段整合，還是讓其他真人團隊各自負責Unit？

- A. 由此工作階段主責，沿用unit-major／serial，一個既有產品工作群組；開發、品質及適用階段角色依流程參與，不新增團隊（推薦）。
- B. 多個真人團隊獨立管理Unit與核准，需要新增成員及交接資料。
- X. Other (please specify)

[Answer]: A

已核准團隊形成明定Codex主責，沒有新增真人團隊或人日時數承諾。U1是一個部署／測試邊界；Code Generation按流程交指定開發角色，其他角色按stage mode參與，不另外發起平行代理工作。

預設以8小時作一個工作天的排程上限假設：從本次06:40 UTC開始至14:40 UTC，已用約2小時20分，剩約5小時40分，包含必要人工作答等待。後續規劃／設計保持最小深度，最多約40分；整合實作約150分，關鍵測試／修復約70分，本機交付與Operation最小驗證約50分，其餘作緩衝。這是內部時間分配，不是虛構人力估算或延長承諾；實際剩餘時間持續遞減。

外部LINE／Gemini／Vertex AI／Firestore存取與公開連線不阻擋免金鑰本機展示；保留真實路徑並用替身驗證，沒有實測就明列未驗證。素材或依賴問題十分鐘停損，優先保留文字與功能、簡化非核心工具／裝飾。若仍有原功能與期限衝突，回報具體缺口，不冒稱完成。

正式walking-skeleton（由第一個Unit證明端到端整合的檢查）是否啟用遵循後續實際政策，不推定scope缺省欄位。唯一U1可獨立執行，其預期最薄展示是生日→生命靈數→三張不同卡→逐卡介紹；正式Unit完成仍需全功能。

## Verification Command Selection

目前沒有可執行的應用程式檢查命令。是否等Code Generation產生實際檢查腳本後，再核准用於完成Unit的命令？

- A. Defer selection — 現在不設定命令；第一個完成檢查前再核准實際可執行命令（推薦）。
- B. Provide existing command — 指定目前已存在、能驗證此新版端到端結果的命令。
- X. Other (please specify)

[Answer]: A. Defer selection

不能用文件解析或尚不存在的npm命令作完成驗證，也不把此延後選擇當成授權未來任意命令。先保留Construction Verification Command未設定；實際命令稍後仍須獨立人工作答與正式記錄。

## Phase Handoff & Generation Plan

產出bolt-plan.md、team-allocation.md、risk-and-sequencing-rationale.md、external-dependency-map.md及本問題文件。讀取三個Inception traceability.json，核對32需求、17故事及元件／Unit目標，無GAP／ORPHAN才產出verification/phase-check-inception.md的PASS證據。Contract Design不產生traceability.json，不捏造不存在的資料。

基準提交／worktree在Construction落地，先檢查秘密與忽略規則，再建立可用main基準；本階段不建立分支或提交。文件的完成勾選放獨立validation.md，摘要確認後不改本問題文件。

## Assumptions & Open Questions

8小時為本階段提出的排程預設，將於生成前摘要明確確認。使用者已明確選擇Defer selection，實際命令欄位保持未設定，第一個完成檢查前另提真實命令取得人工作答；外部憑證與手機證據未驗證。沒有新增產品方向或功能刪減。

## Consolidated Summary Confirmation

- 一個建置批次B1執行唯一U1，四元件與全部17故事／52個AC納入；先打通生日三卡，再補齊全部原功能，主旅程不取代完整交付。
- 同一Codex工作階段主責、unit-major／serial及既有產品工作群組；不新增真人團隊或平行代理工作，必要委派依stage規則。
- 以8小時作一個工作天排程上限，從06:40 UTC至14:40 UTC；優先留下實作、關鍵測試與本機交付時間，單項問題十分鐘停損，不延長期限或刪原功能。
- 本機免金鑰範例、實際持久儲存及替身驗證先交付；保留LINE／Gemini／Vertex AI／Firestore路徑，外部與手機結果未實測即明列未驗證。
- 你已選擇Defer selection；不設定尚不存在的驗證命令，第一個完成檢查前再核准實際命令。正式walking-skeleton儀式依適用政策。
- 產出四份交付文件及Inception→Construction追溯完整性檢查；32需求與17故事、元件／Unit目標無缺口才進實作階段。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
