# Zona Crystal — Security Design（U1）

## Sources

- [nfr-design-questions.md](nfr-design-questions.md)：已確認最小設計。
- [performance-requirements.md](../nfr-requirements/performance-requirements.md)、[security-requirements.md](../nfr-requirements/security-requirements.md)、[scalability-requirements.md](../nfr-requirements/scalability-requirements.md)、[reliability-requirements.md](../nfr-requirements/reliability-requirements.md)、[observability-requirements.md](../nfr-requirements/observability-requirements.md)、[tech-stack-decisions.md](../nfr-requirements/tech-stack-decisions.md)：25 項要求與技術界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[contract-summary.md](../../../inception/contract-design/contract-summary.md)、[components.md](../../../inception/domain-design/components.md)：功能、接口及四元件唯一擁有權。

## Design Solutions

| Solution | Requirement | 決策／驗證 |
|---|---|---|
| SEC-01 | NFR1.1 | /webhook 獨立 raw-body middleware（8 MiB 上限）→檢查 channel secret→計算 HMAC-SHA256→嚴格 base64 解碼／長度檢查後 timingSafeEqual→JSON parse→事件驗證。缺／錯簽章 401、缺設定 503、格式錯 400、超量 413；空 events 200。拒絕不讀記憶／模型。 |
| SEC-02 | NFR1.2 | server 只將已驗證 LINE source.userId 映射 line namespace 的 userKey；無 userId 略過，groupId／roomId 不作個人身分。demo A／B 固定映射 demo namespace，action 按 schema 白名單，禁止客戶端提供 userKey／provider／任意狀態。 |
| SEC-03 | NFR1.3 | 預設 bind 127.0.0.1。PUBLIC_LINE 模式先將 /api/demo/* 全部 404；demo 模式 Host hostname 僅 localhost／127.0.0.1／IPv6 loopback，Origin 若有須匹配本請求 scheme＋host，POST 僅 application/json。未提供跨源 CORS，跨源 preflight 不獲准；不將 demo 身分當公開登入。 |
| SEC-04 | NFR1.3、NFR1.4 | 靜態 root 固定 public，以明確 index／CSS／JS／素材路徑 allowlist，dotfiles deny、正規化及 realpath 在 public 內、不能透過 symlink／穿越讀根目錄。必要 CSP 限 self script／style、connect self、圖片 self及已核准 HTTPS 素材 host、object none、base self、frame ancestors none；nosniff／Referrer-Policy no-referrer。 |
| SEC-05 | NFR1.4 | 文字／模型／追問以 textContent、原生 DOM 建立，禁止 innerHTML 注入；href／src 只能既有／配置可驗 HTTPS 或本機允許路徑，模型不能給任意 URL。adapter error 只轉安全 code，不回原始 body／stack。秘密環境載入、不進 repo；日誌採 OBS-01 投影。 |
| SEC-06 | NFR1.6 | MEMORY_DIR 預設私有 .zona-data（Git ignored），不能位於 public；目錄 0700、JSON／暫存檔 0600，以 server 身分雜湊組檔名，不直接拼使用者路徑。schema 白名單必要狀態／turn，保存至操作者重設；圖片 bytes／token／secret 不寫。 |
| SEC-07 | NFR1.7 | Firestore crystal_memories 以 appName=CrystalAstrology＋可信 userId 查；legacy session 唯讀，新版 zona_v1_＋namespace/user digest 專用文件，原 history sourceRef 防重，不複製回新版 events。LINE 只用設定好的 menu ID／alias；沒有刪除 alias／改 live default 功能，不跑舊 setup。 |

## Trust & Encryption Boundaries

本機 HTTP 只 loopback，非加密網路服務；私有 JSON 使用作業系統檔案權限，未新增應用層加密／KMS，不能宣稱 encrypted at rest。SDK 對 Google／LINE 用供應商 HTTPS；公開 webhook 若需手機展示，操作者以 HTTPS endpoint 接入且公開 LINE 模式停用 demo，實際公開連線由後續環境階段確認。沒有新登入、廣域 CORS 或秘密共享。

## Data Protection & Compliance

ConversationMemory 唯一資料擁有者，Consultation 只取得當前身分必要上下文，無直接查／寫權限。README 說明必要資料、位置、保存與停止程序後由操作者重設；不新增公開 reset API，不自動刪舊資料。無醫療／命運效果、合規或 WCAG 認證。

## Verification Handoff

有效／無效簽章 side-effect spy；demo/public 兩模式真 HTTP、Host／Origin／穿越／symlink／私有檔；惡意文字 DOM、虛構秘密 sentinel、画像超量／偽 MIME；Firestore 查詢與新 ID 寫入、payload 白名單。安全測試使用虛构密鑰，不能讀真秘密。

## Assumptions & Open Questions

None. 公開 HTTPS／手機及供應商憑證未具備時明列未驗證；不以本機測試宣稱外部安全配置已完成。
