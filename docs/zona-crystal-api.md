# Zona Crystal API 1.0.0

同程序 BotExperience 單向呼叫 CrystalKnowledge、Consultation、ConversationMemory。API 不接受任意 userKey／外部模型模式／儲存設定。

## 本機入口

僅 APP_MODE=demo 開放；Host 必須 loopback，Origin（如有）必須同源，POST 必須 JSON，body 最多 8 MiB。A／B 是教學身分，不能作公開認證。

GET /api/demo/state?user=A（或 B）回傳 state 與 memoryStatus。

POST /api/demo/interactions：

```json
{ "user": "A", "action": "birthday", "payload": { "dateText": "2000-01-01" } }
```

| action                       | payload 必要欄位                                            |
| ---------------------------- | ----------------------------------------------------------- |
| text、follow-up              | text（完整內容，最多 4000 字）                              |
| image                        | mimeType、base64（JPEG／PNG／WebP，解碼最多 5 MiB，驗檔頭） |
| birthday                     | dateText（單一有效公曆日期）                                |
| select-crystal               | crystalId（目前三卡之一）                                   |
| guide                        | guide（六個原指南名稱）                                     |
| set-mode                     | mode：consult／echo                                         |
| set-menu                     | menu：main／five                                            |
| recall、recommend、life-path | 空物件                                                      |

額外欄位、未知動作及任意身分均拒絕。正常回應包含 contractVersion、requestId、state、memoryStatus 和 result。生日有 birthday／lifePath／cards；選卡有 crystal／introduction；諮詢有 sender／followUps／evidenceLabels，图片另有 imageDescription。三追問每題最多 300 字以保留完整 LINE 訊息動作；不足時用相關教學替代題並明示來源。

memoryStatus.read 為 loaded／empty／read-failed；write 為 saved／not-attempted／write-failed／outcome-unknown。答案成功與保存、選單套用狀態分開。讀失敗可進行暫時諮詢預覽但不寫回、不猜生日或卡。

錯誤包含安全 code、message、retryable：INVALID_INPUT／INVALID_BIRTHDAY／UNKNOWN_CRYSTAL（400）、INVALID_SIGNATURE（401）、PAYLOAD_TOO_LARGE（413）、UNSUPPORTED_IMAGE（415）、CONFIG_UNAVAILABLE（503）、TIMEOUT（504）、EXTERNAL_FAILED／MEMORY_READ_FAILED（502）。原 SDK 錯誤、秘密及完整對話不出現在錯誤診斷。

## LINE

POST /webhook 先使用原始 body 的 HMAC-SHA256／timingSafeEqual 驗證 x-line-signature，再 JSON parse。缺設定 503，簽章缺／錯 401，不呼叫記憶或模型；有效空 events 200。支援文字、圖片及原日期／卡／切換 postback；不支援事件或沒有 userId 的來源跳過。

日期原 data：action=select_birthday、params.date。卡：action=select_crystal&crystalId=1～7，仍二次驗證目前推薦清單。雙選單原 data：switch-to-main-menu／switch-to-five-grids；原 alias 保留，不發出建立／刪除／default API。

同批共 30 秒。事件有 webhookEventId 時，in-flight／未知交付不重播，已 delivered 重送直接確認；reply 已知拒絕回 500，平台重送時使用保存的計算結果及新的 replyToken 再交付，不重复模型、保存、圖片取得或選單副作用。單一請求內不自動 retry。合法支援事件缺 ID 仍處理，但無穩定防重保證，不產生共用或偽造 ID。程序內 latch 在底層 reply settled 時更新，跨程序去重未實作。圖片下載實際 bounded stream、限制 5 MiB／檔頭，不把圖片 URL 當模型輸入。Loading Animation 20 秒 best effort，不阻止回答。

reply 提供文字、三卡 Flex、原 sender、三題完整訊息動作、Datetime Picker，以及有效生日的原生命靈數完整問題。LINE 最多五個訊息，每段最多 4900 字；先預留必要 evidenceLabels、保存訊息與外部／選單狀態的文字預算，再分段正文，三卡另占一訊息。正文超出可用預算時明示「回覆正文過長，已截短」，不靜默刪除必要標示；本機仍呈完整答案。必要標示本身超出可呈現長度時明確拒絕 payload，不以刪除標示產生假成功。

## 公開素材與 health

GET /health 僅 {"ok":true}。static 僅允許 index、CSS、JS 與五個原素材，realpath 防 symlink 越界；.env、記憶、原碼不公開。CSP 限同源 script／style／connect 與允許 HTTPS 圖片 origin；DOM 以 textContent 呈現內容。
