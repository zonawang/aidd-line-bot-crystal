# Zona Crystal — 最小功能設計問答與產出計畫

## Sources

- [requirements.md](../../../inception/requirements-analysis/requirements.md)：全部 FR1–FR10、NFR1–NFR5 與原行為。
- [stories.md](../../../inception/user-stories/stories.md)、[unit-of-work-story-map.md](../../../inception/units-generation/unit-of-work-story-map.md)：U1 全部17故事、52個AC。
- [unit-of-work.md](../../../inception/units-generation/unit-of-work.md)、[components.md](../../../inception/domain-design/components.md)：同一服務、四元件、六實體與唯一資料擁有權。
- [contract-summary.md](../../../inception/contract-design/contract-summary.md)：C1–C5、身分、大小／等待、保存狀態與原記憶欄位。
- [interaction-spec.md](../../../inception/refined-mockups/interaction-spec.md)：既有 C1–C7 視圖、375／1280、原生控制與切身分。
- [bolt-plan.md](../../../inception/delivery-planning/bolt-plan.md)：一個B1、全功能完成及一日時限。
- 原 line-datetime-picker/index.js，提交 cc1f1938f11012a6518b7ecb2fab840984d9f478，第29–47、63–113行：原持久資料的 appName、userId、sessionId、lastUpdateTime、events 與 content.parts.text／author／timestamp。
- 使用者本次選擇 Continue automatically，已記錄 Construction autonomy=autonomous；更早明確授權推薦／預設的 MVP-first 技術決策。以下 A 是依授權採用的設計預設，不冒稱使用者逐題回答；摘要仍須獨立人工作答。

## Applicability & Prior Decision Check

U1 有生日計算、選卡、狀態切換、持久資料與錯誤復原，適用 Functional Design。已檢視15份既有 questions 與 audit 問答；不重問全功能、本機範例、四角色、六指南、日期形式、30／35秒、5／8MiB或單一Unit。原始歷史中刪減功能的方向已由較新的全功能核准取代。

## Authorized Defaults

### Q1 — 如何整理訊息分流與生日／水晶規則？

需要讓本機與LINE共用相同行為，並避免Echo、指南或無效日期誤觸發諮詢。

- A. 使用明確動作；一般文字先辨識模式指令，Echo中的其他文字原樣回覆；諮詢模式才辨識指南、選單、推薦、完整生日，再進文字諮詢。日期若有明確但無效的生日候選，要求修正，不當作有效生日。三卡從原七款池均勻不放回選取，選卡只接受目前三卡中的ID。（推薦）
- B. 每個舊repo保留獨立路由與狀態，再由教學頁串接。
- X. Other (please specify)

[Answer]: A

日期只正規化已核准形式，以公曆驗證四位年份0001–9999，不加年齡／未來日期限制；不使用會容忍溢位的日期結果。多個不同生日候選要求重新輸入單一日期。生命靈數反覆縮減至1–9，保留11／22／33的變體不採用。獨立推薦文字不要求先有生日；無效日期不改舊有效生日或舊卡，但畫面清楚表示本次輸入失敗，不將舊結果當作新結果。

### Q2 — 如何保存必要記憶、相容舊資料並避免更新競爭？

先前契約已要求先讀後寫、A／B隔離與保存結果分開；本題補完整資料形狀及序列。

- A. 保留六實體，由ConversationMemory唯一保存依伺服器身分隔離的完整必要狀態與文字回合；同一使用者依序讀取、處理、提交。原資料只讀投影，新增版本化狀態存入不撞原session的記錄，保留原欄位／文字事件，不遷移或覆寫原events。提交未知時標示outcome-unknown並阻止後續寫入，直到原操作結束及重新讀回。（推薦）
- B. 每次請求由記憶體初值覆蓋完整持久記錄，忽略舊session。
- X. Other (please specify)

[Answer]: A

UserConversation記錄userKey、birthday、mode、menu、recommendationIds、selectedCrystalId、turns及schemaVersion／revision；ConversationTurn保存必要inputText、replyText、imageDescription、senderRole、evidenceLabels及createdAt，不保存圖片原檔、秘密或平台replyToken。模型只取得目前身分必要上下文，持久歷史不因模型上下文截短而刪除。

原Firestore範圍仍是crystal_memories與appName=CrystalAstrology／可信userId；原sessionId與events保留唯讀，新版使用專屬版本化sessionId，新增schemaVersion與正規化狀態。舊content.parts中的文字投影為歷史；無法安全解析的舊欄位不推測生日／模式，也不覆寫。舊資料來源與新版回合使用穩定來源ID避免重複投影；新事件只寫必要文字／描述、author及timestamp，與正規化回合對應。

所有排隊及外部操作共享原30秒總預算；期限前未開始的寫入不得啟動。已提交逾時的寫入可能仍生效，不能宣稱取消／回滾；未結束時後續讀寫有界失敗且禁止保存，仍可明示未讀回／未保存的諮詢。操作結束後下一次先重新讀取。單一應用程序是本次競爭控制邊界，不承諾多程序一致性或exactly-once。具體儲存／取消工具由後續最小NFR／Infrastructure Design選型。

### Q3 — 如何處理等待、身分切換與畫面復原？

需避免A請求的晚到結果顯示在B畫面，並維持原功能可操作。

- A. 每次請求綁當前身分與畫面世代；同一畫面一次一個提交。切A／B先清空舊視圖，取消或忽略舊結果，再讀新身分；所有結果與失敗均釋放等待。主回覆、保存、選單／動畫與證據標示各自如實呈現，真實失敗不換成功範例。（推薦）
- B. 共用最後回覆／模式與歷史快取，切身分只更換名稱。
- X. Other (please specify)

[Answer]: A

保留375／1280、鍵盤焦點／標籤、圖片替代文字、三追問及額外日期／生命靈數捷徑；三追問按完整題文提交。兩選單／六指南／Echo／圖片／回憶都有入口。前端35秒有界等待、後端30秒共用deadline；晚到答案不改已結束畫面，不開始新的保存。動畫失敗不阻擋主回覆；選單失敗保留文字返回，原生動畫由平台計時或回覆結束。本機固定文字／圖片及LINE模擬在結果附近標示，四角色／未知COSMOS沿用原規則。

## Analysis & Inline Support

架構觀點：四元件及六實體不再分拆；區分短期Interaction、唯一持久狀態及唯讀內容。開發觀點：確定性規則與共享處理序列可測，真實適配器能以替身驗呼叫；避免沿用重啟覆寫、寬鬆日期與偏差隨機排序。

沒有模糊回答或互相矛盾的新產品方向。上述技術預設在既有授權內；沒有要求採購、刪除記憶、改live menu或新增部署。尚未做應用實作／測試。外部成效待驗證，不把替身當成真實通過。

## Generation Plan

- entities.md：六實體及logical YAML型別、限制、基數／擁有權。
- rules.md：穩定BRx.y規則及原需求來源。
- functional-spec.md：全部功能流程、狀態機、失敗／競爭與舊記憶投影；由entities／rules衍生ER圖及規則摘要。
- traceability.json：U1全部52個AC對應已存在規則，不容許缺口或不明孤立規則。
- frontend-components.md：因U1含教學頁補最小視圖／狀態／互動說明；不是獨立前端服務。
- 檢查文件、YAML／JSON、圖語法及AC覆蓋，再由獨立架構審查檢查可實作性。不把文件檢查當應用測試。

## Assumptions & Open Questions

None. 具體儲存工具、套件與取消方式後續選型；正式多程序一致性、跨重啟防重與正式部署延後。本機全功能仍是完成條件。

## Consolidated Summary Confirmation

- 同一新版保留全部17故事／52AC，沿用四元件、六實體與C1–C5。
- 共用明確分流；生日真實曆日、生命靈數1–9及三張不重複卡；Echo退出優先，原推薦不要求生日。
- 必要記憶按身分隔離、先讀再更新；原session唯讀，新版版本化保存；同使用者序列化，未知提交不自動重送。
- 身分切換清空舊視圖並忽略晚到結果；保留全功能入口、原角色／指南、等待復原及範例／模擬標示。
- 只補最小設計，不新增正式平台；外部結果、應用實作與關鍵測試尚待驗證。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
