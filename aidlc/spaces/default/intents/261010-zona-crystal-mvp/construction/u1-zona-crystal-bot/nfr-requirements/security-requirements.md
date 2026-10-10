# Zona Crystal — Security Requirements（U1）

## Sources

- [requirements.md](../../../inception/requirements-analysis/requirements.md)：NFR1–NFR5，全部原功能保留。
- [contract-summary.md](../../../inception/contract-design/contract-summary.md)：C1–C5、大小／期限／身分／證據界線。
- [functional-spec.md](../functional-design/functional-spec.md)、[rules.md](../functional-design/rules.md)：同身分序列化、未知寫入、legacy 唯讀及 UI 世代。
- [nfr-requirements-questions.md](nfr-requirements-questions.md)：本階段自主採用預設，摘要已獲本人確認。

## Requirements & Verification

| ID | 要求 | 最小驗證 |
|---|---|---|
| NFR1.1 | /webhook 對原始 body 驗 HMAC-SHA256 base64 簽章，常數時間比對；缺／不符 401，設定不足 503，不接收 placeholder secret。拒絕時沒有模型／記憶副作用。 | 真有效、缺失、錯誤簽章與修改 body；spy 證明不呼叫 adapter。 |
| NFR1.2 | LINE 身分只由已驗事件 userId 導出；缺 userId 安全略過，不能以共用 group／room 代替。示範只固定 A／B，拒絕客戶端 userKey／provider／mode 設定注入。 | A／B 與兩 LINE 身分隔離、額外欄位／偽造身分／無 userId；模型上下文只含當前身分。 |
| NFR1.3 | 預設服務綁 loopback；公開 LINE 模式服務端停用 /api/demo/*（404）。靜態檔案只服務允許 public 素材，不能暴露環境、設定、私有記憶或任意路徑。 | 在兩模式實際 HTTP 請求、路徑穿越、隱藏檔、私有檔案請求，沒有秘密／記憶內容。 |
| NFR1.4 | 秘密只從伺服器環境讀取，不進 Git、HTTP 回覆或診斷；輸出錯誤使用安全代碼／requestId，無原始 provider body／stack。使用者及模型內容以文字安全渲染，不注入 HTML／script。 | 虛構秘密 sentinel、provider error、script 字串回覆；查日誌／HTTP／rendered DOM 無洩漏或執行。 |
| NFR1.6 | 只持久必要生日／模式／選單／卡識別、文字、回覆及圖片描述，保存至操作者依文件重設；不保存原圖 bytes、replyToken／secret。模型只取必要當前身分上下文，不能自查他人。 | 檢查實際私有 JSON／Firestore payload；图片請求不留原圖，重啟及 A／B 讀回。 |
| NFR1.7 | 原 Firestore session 文件唯讀，不能遷移／刪除／空覆寫；新版 session 與 legacy 不同。不得執行原 setup-rich-menus.js 或修改 live default／alias。 | adapter spy 檢查 query scope／讀 legacy／寫新 ID；教材明示設定與重設須由操作者處理。 |

## Threats & Data Protection

主要威脅：偽造 webhook／跨人記憶、公開教學身分被冒用、靜態檔案洩密、惡意文字 HTML、超大／偽格式圖片、未知寫入造成錯誤覆寫。以上以驗簽／固定路由／白名單與可信身分／大小驗證／read-before-write 處理。日誌不要生日、完整對話、LINE userId、原始圖片或供應商密鑰。必要上下文可能傳送至已配置 Gemini／Vertex AI，README 說明，教學優先虛構資料。

## Compliance & Operational Boundary

本次不聲稱醫療／命運效果、正式合規／WCAG 認證；無新增管理平台或登入。記憶是私有資料，不以靜態入口分享；記錄保存位置／清除步驟，由操作者在停止程序後操作，不新增公開 reset API。未授權刪除舊資料／外部發布；無真憑證時仍保留 real adapter，但外部驗證另列，不能假稱成功。

## Assumptions & Open Questions

None. 正式 IAM／加密金鑰管理／安全掃描平台延後；以上必要界線與真實 webhook 驗簽必須實作及驗證。
