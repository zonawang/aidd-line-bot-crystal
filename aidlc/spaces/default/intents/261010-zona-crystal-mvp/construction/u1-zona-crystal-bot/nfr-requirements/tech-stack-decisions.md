# Zona Crystal — Tech Stack Decisions（U1）

## Sources

- [requirements.md](../../../inception/requirements-analysis/requirements.md)：NFR1–NFR5，全部原功能保留。
- [contract-summary.md](../../../inception/contract-design/contract-summary.md)：C1–C5、大小／期限／身分／證據界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[rules.md](../functional-design/rules.md)：同身分序列化、未知寫入、legacy 唯讀及 UI 世代。
- [nfr-requirements-questions.md](nfr-requirements-questions.md)：本階段自主採用預設，摘要已獲本人確認。

## Technology Decisions

| 項目 | 選擇與理由 | 驗證／限制 |
|---|---|---|
| Runtime | JavaScript／Node.js 24，現場 v24.18.0；不新增 TypeScript build。 | lockfile 與 README 記錄同基準，CI 用 Node 24。 |
| HTTP | 沿用 Express 4；raw body webhook 驗簽、8 MiB JSON parser，loopback 預設。 | npm lock 可重現，靜態白名單／模式停用實際 HTTP 測試。 |
| LINE | 沿用 @line/bot-sdk 9 MessagingApiClient／BlobClient；sender、quickReply、Flex／日期／rich menu／loading 薄適配。 | 保留全部原環境／素材與動作；不跑 live menu setup。 |
| Model | 沿用 Google Gemini／Vertex SDK 接口的薄適配；保留原 @google-cloud/vertexai 1 及 Google 模型存取設定。Gemini 採直接 SDK 呼叫，若原 ADK SDK 層無直接可用路徑，採官方 @google/genai 作薄適配；不建 ADK 多 agent 編排。 | 原 key／project／location／model 規則保留，圖像傳實際 bytes／MIME；十分鐘內選可執行 SDK 呼叫，不改為成功範例。精確版本由安裝 lock 固定。 |
| Memory | 原生 fs 私有每身分 JSON、同人序列化、暫存檔 rename；@google-cloud/firestore 8 保留外部適配。 | legacy 唯讀＋新 session、schemaVersion 1／revision；一個 writer 程序，無雙寫。 |
| UI | 原生 HTML／CSS／JS 與既有角色／卡／選單素材；不用新 UI 框架。 | 375／1280、文字安全渲染與世代綁定；圖片 alt。 |
| Tests | Node 內建 node:test；適用 lint／format 的最小工具隨實作加入，統一 check script。 | test-after、每可測需求／元件正常路徑；命令另行本人核准。 |
| Run / CI | npm start 本機示範，最小 GitHub Actions 重用同一 check；沒有必要雲端 provisioning。 | 真實 LINE HTTPS／供應商憑證有時另列外部證據，local 可完成核心展示。 |

## Requirement Mapping & UI Identity

技術選擇支援 NFR1.1–NFR1.7、NFR2.1–NFR2.9、NFR3.1、NFR4.1–NFR4.2、NFR5.1–NFR5.6；詳細要求由各同層文件擁有，不新增不同語義的重複 ID。

介面視圖採上游 interaction-spec.md：C1 ModeIdentity、C2 MessageComposer、C3 BirthdayInput、C4 CrystalCards、C5 ReplyFollowUps、C6 MenuGuides、C7 StatusTeaching。functional-spec.md 同號視圖以名稱對照到此權威表，後續實作／驗證使用本表；契約 C1–C5 另屬接口編號，引用需寫「契約」或「視圖」，避免混淆。此映射承接 Functional Design Minor R-01，不修改其已結案文件。

## Deferred Work & Stop Rule

僅延後正式雲端／多程序／擴展／SLA／備份／監控／合規整備，不延後原有功能。每項技術問題十分鐘停止調查，採最小可執行薄適配並記錄原因及限制；若外部不可實測，保留可測呼叫路徑並分列證據，不偽造成功。

## Assumptions & Open Questions

None. Node 版本與原 package.json 已讀；新應用依賴尚未安裝、測試尚未執行，選型不表示串接已通過。Model 的明確薄 SDK 路徑在 NFR Design／安裝時依十分鐘停損落地，無新架構調查。
