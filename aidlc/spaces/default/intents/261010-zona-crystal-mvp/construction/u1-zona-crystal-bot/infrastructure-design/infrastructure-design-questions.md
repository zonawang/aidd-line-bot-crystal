# Zona Crystal — Infrastructure Design Questions（U1）

## Decision Basis

依本階段 autonomous 政策與已確認本機展示方向選以下預設；不是使用者逐題回答。保留全部原功能與真實外部 adapter，不新增正式部署採購。來源：同 Unit nfr-design 六份設計、functional-design/functional-spec.md；共享 inception/domain-design/components.md、contract-design/contract-summary.md。

## Q1 — Runtime, Storage & Access

如何映射既有設計到最小運行環境？

- A. 直接在本機執行一個 Node.js 24／Express 程序，PORT=8080、預設 HOST=127.0.0.1；public 為允許素材，MEMORY_DIR 預設私有 .zona-data、單 writer、實際 JSON 持久。APP_MODE=demo（本機）或 line（公開LINE，停用demo），BOT_MODE=example 或 real、MEMORY_ADAPTER=local 或 firestore；伺服器環境配置，原LINE／Google／角色設定保留。無Docker、AWS、VPC、load balancer或新DB。
- B. 新增正式雲端及多環境部署。
- X. Other (please specify)

[Answer]: A. 單程序本機運行，私有持久及伺服器配置。

SDK 經 HTTPS 向既有 LINE／Google 服務外送；真實 webhook 必須另外可用的 HTTPS endpoint 且 APP_MODE=line，並完成界線檢查才接公開流量。本階段只設計，不啟動 tunnel／發布、不讀取或揭露秘密、不執行舊 live rich-menu setup。沒有憑證不影響範例展示，但不能宣稱 real 已通過。MEMORY_DIR 不得在 public 內、資料Git ignored、目錄0700檔0600；无自動刪除或遷移legacy資料。新AWS／雲端增量資源費為0，Google／LINE既有real使用可能依供應商計費，不新增採購或估算未實測用量。

## Q2 — Checks, Delivery & Diagnostics

如何完成最小交付與恢復？

- A. lockfile＋npm ci 可重現、npm start 本機啟動；同一 npm run check 在本機及最小 GitHub Actions（Node24、npm ci、check）驗證 lint／format／需求測試／HTTP／持久重啟。CI不需真秘密或外部成功。終端結構化安全日誌＋僅程序alive的health，無監控平台；交付README與證據表。版本回退停止程序、改先前通過版本、保留MEMORY_DIR、重啟及smoke。
- B. 新增CI/CD平台、正式blue-green／canary、監控與備份平台。
- X. Other (please specify)

[Answer]: A. 最小共用檢查、本機交付與保留資料的版本回退。

遵循main短期Bolt／worktree、核准計畫後實作、test-after、關鍵check及適用lint/format失敗阻擋合併；沒有HEAD時先安全檢查並建立基準。實際命令／版本／exit code於建构及交付補齊。npm run check 此處是設計名稱，不能替代正式 Construction Verification Command 的另行本人確認；不加新的覆蓋率百分比。不自動push／發布／正式部署，若既有staging可用才遵循合併後部署與smoke。未有前一通過版本時明列回退不可驗，不捏造版本或成功。

## Ambiguity & Contradiction Analysis

- 本機demo綁loopback，公開LINE模式在伺服器停用demo；真實LINE需要HTTPS，不把本機HTTP當手機連通成功。
- 四邏輯元件共用單程序，不新增跨Unit shared infrastructure或跨程序JSON鎖。
- CI只驗可重現的本機及adapter行為，外部與手機實測獨立證據；無正式SLA／流量整備。
- 固定30／35秒、大小、秘密、身分及必要持久界線沿NFR設計；不改已確認門檻。
- 採最少增量資源與依賴；十分鐘技術停損不減原功能／不偽稱完成。
- 無待解環境方向，安裝／啟動／真憑證與HTTPS可用性仍待後續實際執行。

## Consolidated Summary Confirmation

- 本機Node24／Express單程序，loopback8080、public允許素材、私有.zona-data持久；不新建雲端平台。
- 伺服器選demo/line、example/real、local/firestore，原LINE／Google設定保留；公開LINE停用demo且需HTTPS。
- lockfile、npm start、共用npm run check與最小CI；安全日誌／health、交付证據及保留記憶的回退。
- 全部原功能保留，真外部／手機未測分列；正式驗證命令另行本人確認。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
