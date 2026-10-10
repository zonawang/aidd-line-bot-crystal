# Zona Crystal — Infrastructure Specification（U1）

## Sources

- [infrastructure-design-questions.md](infrastructure-design-questions.md)：已確認本機／最小CI方案。
- [performance-design.md](../nfr-design/performance-design.md)、[security-design.md](../nfr-design/security-design.md)、[scalability-design.md](../nfr-design/scalability-design.md)、[reliability-design.md](../nfr-design/reliability-design.md)、[observability-design.md](../nfr-design/observability-design.md)、[logical-components.md](../nfr-design/logical-components.md)：25項NFR的具體機制及同程序界線。
- [components.md](../../../inception/domain-design/components.md)、[functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)：四元件、全部功能與C1–C5。

## Deployment

| Facet | Choice | Rationale |
|---|---|---|
| INF-01 Compute model | 本機單 Node.js24/Express 程序，npm start；無容器／serverless／VM新資源 | 一天教學MVP；四邏輯元件在同Unit，單writer，無HA承諾。 |
| INF-02 Networking | PORT=8080、HOST=127.0.0.1預設；APP_MODE=demo有本機同源接口，line則/api/demo/*404。真實webhook另需HTTPS入口，SDK向LINE／Google走HTTPS | demo不能公開登入；沒有VPC/subnet／公網服務採購。POST原始簽章／Host/Origin界線遵SEC-01–SEC-03。 |
| INF-03 Storage | MEMORY_DIR預設workspace/.zona-data，私有每身分JSON／唯一.tmp＋rename；directory0700/file0600；不得位於public；Gitignored | 重啟真實讀回、單writer；不刪舊資料、不把資料放公開素材。MEMORY_ADAPTER=local或firestore其一。 |
| INF-04 Environments | 本機教學＋無真秘密的CI；APP_MODE=demo/line、BOT_MODE=example/real、MEMORY_ADAPTER=local/firestore由server環境選 | 未新增staging/prod。若已有staging可用，依既定合併後部署及smoke；本次不替未建立環境編造證據。 |
| INF-05 IaC | 不需雲端IaC；package/lock、.env.example無真值、README運行步驟、GitHub Actions版本控制 | 配置簡單可重現，不引入CDK/Terraform。 |
| INF-06 Resource sizing | 沿用現有開發機，Node v24.18.0已確認；body8MiB、decode圖片5MiB、文字4000、backend30s／UI35s | 不猜CPU/RAM或正式QPS；安裝／啟動及本機10次≤2s、5並行在實作後驗。 |
| INF-07 Assets | 僅public允許路徑及既有素材，CSP/realpath/dotfiles界線；圖失敗有文字 | 當前配置／記憶不由靜態root提供；沿用角色／選單／水晶素材，無新CDN。 |

## Infrastructure Services

| Service | Role | Configuration | Notes |
|---|---|---|---|
| Local JSON files | database | INF-03每身分私有JSON、schemaVersion1、revision；同人序列化、read-before-write及pending-write latch由Memory實作 | 單writer、無replication／RPO承諾；重啟實測必須保留。 |
| Existing Firestore | database | crystal_memories、appName=CrystalAstrology＋可信userId；legacy唯讀、新zona_v1_文件 | 可選真實adapter，不新建GCP資源／雙寫；ADC／project等server設定。 |
| None | cache / queue / search | 無Redis／背景worker／搜尋服務 | 每身分Promise queue是應用機制，非新infra服務。 |
| Existing asset hosts | cdn | 既有允許HTTPS圖片及本機public | 不新增CDN/DNS；沿NFR圖片白名單及alt。 |
| None | dns / load-balancer | loopback:8080；公開HTTPS endpoint只有可用時後續配置 | 不自動啟動tunnel／發布；真LINE未驗分列。 |
| Existing LINE / Google APIs | external integration | LINE SDK9、Gemini薄SDK／原Vertex1、Firestore8；server原env配置 | 真實功能保留、無憑證時real操作明示失敗，固定範例另標示。 |

## Shared Infrastructure & Cost

| 項目 | 決策／界線 |
|---|---|
| 跨Unit shared resource | None. 只有U1，不新增跨Unitowner／consumer；同程序SDK與配置不是shared部署服務。 |
| Incremental cloud resources | 0個；新增AWS／雲端資源費為0，不新增採購。 |
| Real provider usage | 可能依既有LINE／Google方案計費；未實測用量不估算／宣稱免費，不觸發付費採購。 |
| Growth / scaling | 教學小量資料；回合依需求保存至操作者重設。超過本機目标先記錄優化，不啟多writer共享資料。 |
| Stop rule | 任一環境／依賴問題十分鐘停止調查，採可執行最小替代、記限制；不減原功能／延長一天。 |

## Verification & Operations Handoff

Code Generation建立完整可運行檔、lock及安全配置；Build/Test實際HTTP、25NFR/52AC、restart／5並行／10次量測。Environment Provisioning確認本機依賴／private dir及真外部可用性；Deployment Execution實際啟動／health／展示。credentials僅必要時由操作者配置，文件／日誌不帶值；不改live rich menus或原Firestore。

## Assumptions & Open Questions

None. 現在沒有應用程式、lockfile、啟動或公開連線證據；這是運行設計，不宣稱已部署。
