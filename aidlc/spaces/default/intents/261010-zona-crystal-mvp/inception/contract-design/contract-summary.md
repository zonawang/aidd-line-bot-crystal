# Zona Crystal — 最小介面契約

## Sources

- [unit-of-work.md](../units-generation/unit-of-work.md)、[unit-of-work-dependency.md](../units-generation/unit-of-work-dependency.md)：唯一Unit U1／u1-zona-crystal-bot，kind為service，沒有跨Unit依賴。
- [components.md](../domain-design/components.md)：四元件、六實體與唯一記憶擁有權。
- [requirements.md](../requirements-analysis/requirements.md)：全部FR／NFR及證據界線。
- [contract-design-questions.md](contract-design-questions.md)：已確認五項契約、大小／等待與版本預設。
- [interaction-spec.md](../refined-mockups/interaction-spec.md)：C1–C7介面與原選單／快捷動作。
- 原line-datetime-picker/index.js，提交cc1f1938f11012a6518b7ecb2fab840984d9f478：LINE SDK、Gemini／Vertex AI與Firestore crystal_memories。舊程式作相容來源，不代表新版實作已通過。

## Contracts Table

| # | Provider Unit | Consumer | Mechanism | Owner |
|---|---|---|---|---|
| C1 | U1 | External: 本機教學瀏覽器 | 同步HTTP／JSON；OpenAPI | U1／BotExperience |
| C2 | U1 | External: LINE webhook平台 | 原始HTTP body＋簽章；OpenAPI | U1／BotExperience |
| C3 | U1的LINE適配器 | External: LINE Messaging API | SDK非同步呼叫；適配器shared-schema | U1／BotExperience |
| C4 | U1的模型適配器 | External: Google Gemini API／Vertex AI | SDK非同步呼叫；適配器shared-schema | U1／Consultation |
| C5 | U1的持久適配器 | External: 本機檔案儲存／Firestore | 非同步持久讀寫；適配器shared-schema | U1／ConversationMemory |

C3–C5的Provider Unit指應用的適配器契約提供者，Consumer列是外送操作的目的地；第三方wire API仍由供應商擁有。以下shared-schema定義U1與適配器間的可測交接，沒有另建服務或冒充供應商完整規格。C5本機檔案及Firestore為可替換實作，不需同時雙寫。

## C1 — Local Teaching API

預設本機服務只綁loopback。公開LINE模式必須停用/api/demo/*，回404；不能只靠瀏覽器隱藏按鈕。A／B是固定教學身分，伺服器映射內部userKey，不採用客戶端userKey、mode、source或provider設定來取得別人資料／切真實模式。切身分時清空前一人的視圖，GET失敗不沿用他人歷史。

圖片以JSON base64暫時傳送，後端驗證格式、解碼大小及內容，不把原檔持久保存。text上限4000字元、decoded圖片5MiB、整個JSON body8MiB；超過body上限回413。LINE輸入另外依C2，不能把本機A／B規格套在平台身分。

```yaml
openapi: 3.1.0
info: {title: Zona Crystal Local Teaching API, version: 1.0.0}
servers:
  - url: http://127.0.0.1:8080
paths:
  /api/demo/state:
    get:
      operationId: getDemoState
      parameters:
        - name: user
          in: query
          required: true
          schema: {type: string, enum: [A, B]}
      responses:
        '200':
          description: 只回指定教學身分的必要顯示狀態
          content:
            application/json:
              schema: {$ref: '#/components/schemas/StateResponse'}
        '400': {$ref: '#/components/responses/Error'}
        '404': {description: 公開LINE模式停用此路徑}
        '502': {$ref: '#/components/responses/Error'}
        '504': {$ref: '#/components/responses/Error'}
  /api/demo/interactions:
    post:
      operationId: submitDemoInteraction
      requestBody:
        required: true
        content:
          application/json:
            schema: {$ref: '#/components/schemas/ActionRequest'}
      responses:
        '200':
          description: 動作完成；答案交付與保存狀態分開判定
          content:
            application/json:
              schema: {$ref: '#/components/schemas/InteractionResponse'}
        '400': {$ref: '#/components/responses/Error'}
        '404': {description: 公開LINE模式停用此路徑}
        '413': {$ref: '#/components/responses/Error'}
        '415': {$ref: '#/components/responses/Error'}
        '502': {$ref: '#/components/responses/Error'}
        '503': {$ref: '#/components/responses/Error'}
        '504': {$ref: '#/components/responses/Error'}
components:
  responses:
    Error:
      description: 安全的可辨認錯誤；不含秘密、堆疊或完整對話
      content:
        application/json:
          schema: {$ref: '#/components/schemas/ErrorEnvelope'}
  schemas:
    ActionRequest:
      type: object
      required: [user, action]
      additionalProperties: false
      properties:
        user: {type: string, enum: [A, B]}
        action:
          type: string
          enum: [text, image, birthday, select-crystal, guide, set-mode, set-menu, recall, recommend, follow-up, life-path]
        payload:
          type: object
          additionalProperties: false
          properties:
            text: {type: string, minLength: 1, maxLength: 4000}
            dateText: {type: string, minLength: 1, maxLength: 4000}
            crystalId: {type: string, minLength: 1}
            guide: {type: string, enum: [使用指南, 使用說明, 閱讀指南, 認識水晶, 淨化方法, 功效與佩戴]}
            mode: {type: string, enum: [consult, echo]}
            menu: {type: string, enum: [main, five]}
            mimeType: {type: string, enum: [image/jpeg, image/png, image/webp]}
            base64: {type: string, minLength: 1, contentEncoding: base64}
      allOf:
        - if: {properties: {action: {enum: [text, follow-up]}}}
          then: {required: [payload], properties: {payload: {required: [text]}}}
        - if: {properties: {action: {const: birthday}}}
          then: {required: [payload], properties: {payload: {required: [dateText]}}}
        - if: {properties: {action: {const: image}}}
          then: {required: [payload], properties: {payload: {required: [mimeType, base64]}}}
        - if: {properties: {action: {const: select-crystal}}}
          then: {required: [payload], properties: {payload: {required: [crystalId]}}}
        - if: {properties: {action: {const: guide}}}
          then: {required: [payload], properties: {payload: {required: [guide]}}}
        - if: {properties: {action: {const: set-mode}}}
          then: {required: [payload], properties: {payload: {required: [mode]}}}
        - if: {properties: {action: {const: set-menu}}}
          then: {required: [payload], properties: {payload: {required: [menu]}}}
    State:
      type: object
      required: [user, mode, menu, birthday, recommendationIds, selectedCrystalId]
      properties:
        user: {type: string, enum: [A, B]}
        mode: {type: string, enum: [consult, echo]}
        menu: {type: string, enum: [main, five]}
        birthday: {type: [string, 'null'], format: date}
        recommendationIds: {type: array, items: {type: string}, uniqueItems: true}
        selectedCrystalId: {type: [string, 'null']}
    MemoryStatus:
      type: object
      required: [read, write]
      properties:
        read: {type: string, enum: [empty, loaded, read-failed]}
        write: {type: string, enum: [not-attempted, saved, write-failed, outcome-unknown]}
        message: {type: string}
    Card:
      type: object
      required: [crystalId, name, summary, imageUrl]
      properties:
        crystalId: {type: string}
        name: {type: string}
        summary: {type: string}
        imageUrl: {type: string, format: uri}
    Result:
      type: object
      required: [kind, text, evidenceLabels]
      properties:
        kind: {type: string, enum: [consultation, birthday, cards, crystal, guide, echo, mode, menu, memory, notice]}
        text: {type: string}
        evidenceLabels: {type: array, items: {type: string}}
        birthday: {type: string, format: date}
        lifePath: {type: integer, minimum: 1, maximum: 9}
        cards: {type: array, minItems: 3, maxItems: 3, items: {$ref: '#/components/schemas/Card'}}
        crystal: {$ref: '#/components/schemas/Card'}
        introduction: {type: string}
        sender:
          type: object
          required: [roleKey, name, iconUrl]
          properties:
            roleKey: {type: string, enum: [ATHENA, VENUS, FORTUNE, COSMOS]}
            name: {type: string}
            iconUrl: {type: string, format: uri}
        followUps: {type: array, minItems: 3, maxItems: 3, uniqueItems: true, items: {type: string, minLength: 1}}
        quickActions:
          type: array
          items:
            type: object
            required: [action, label]
            properties:
              action: {type: string, enum: [birthday, life-path]}
              label: {type: string}
      allOf:
        - if: {properties: {kind: {enum: [consultation, crystal]}}}
          then: {required: [sender, followUps]}
        - if: {properties: {kind: {const: birthday}}}
          then: {required: [birthday, lifePath, cards]}
        - if: {properties: {kind: {const: cards}}}
          then: {required: [cards]}
        - if: {properties: {kind: {const: crystal}}}
          then: {required: [crystal, introduction]}
    StateResponse:
      type: object
      required: [contractVersion, requestId, state, memoryStatus]
      properties:
        contractVersion: {const: 1.0.0}
        requestId: {type: string}
        state: {$ref: '#/components/schemas/State'}
        memoryStatus: {$ref: '#/components/schemas/MemoryStatus'}
    InteractionResponse:
      allOf:
        - {$ref: '#/components/schemas/StateResponse'}
        - type: object
          required: [result]
          properties:
            result: {$ref: '#/components/schemas/Result'}
    ErrorEnvelope:
      type: object
      required: [contractVersion, requestId, error]
      properties:
        contractVersion: {const: 1.0.0}
        requestId: {type: string}
        error:
          type: object
          required: [code, message, retryable]
          properties:
            code: {type: string, enum: [INVALID_INPUT, INVALID_BIRTHDAY, UNKNOWN_CRYSTAL, PAYLOAD_TOO_LARGE, UNSUPPORTED_IMAGE, CONFIG_UNAVAILABLE, EXTERNAL_FAILED, TIMEOUT, MEMORY_READ_FAILED]}
            message: {type: string}
            retryable: {type: boolean}
```

補充規範：payload必須符合action，不允許多送其他action的欄位；recall／recommend／life-path可省略payload。follow-up送完整題文，不送截短標籤。recommend保留#水晶／今日水晶推薦，生日不是一般諮詢或原推薦入口的先決條件。set-mode及退出文字先處理，Echo不將退出指令原樣回聲；其餘Echo文字維持原樣。

dateText接受原六種形式與嵌入文字，後端驗證真實公曆、不加年齡限制；失敗回400 INVALID_BIRTHDAY且不生成新數字或卡。cards的三個crystalId必須不同，選卡識別須存在並對應本次可選卡；不存在時回400 UNKNOWN_CRYSTAL，不回錯介紹。生命靈數1–9、11／22／33反覆縮減規則維持。

每個Result有證據標示：固定文字「教學範例回覆」、固定圖片「圖片辨識範例，非真實辨識」、本機LINE動作「LINE 操作模擬」、替代追問「教學替代問題」。三追問與quickActions分開，日期捷徑保留，有效生日才帶生命靈數捷徑。原指南、角色與分享連結不被這份schema取代。

## C2 — LINE Webhook

原始body在解析前以channel secret驗HMAC-SHA256及base64簽章；缺失／不符回401，不呼叫模型或記憶。LINE設定不足回503，不用placeholder secret接收事件。有效body缺events／格式錯回400；驗證空events回200，便於平台驗證。

```yaml
openapi: 3.1.0
info: {title: Zona Crystal LINE Webhook, version: 1.0.0}
paths:
  /webhook:
    post:
      operationId: receiveLineEvents
      security: [{LineSignature: []}]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [events]
              properties:
                destination: {type: string}
                events: {type: array, items: {$ref: '#/components/schemas/Event'}}
      responses:
        '200':
          description: events已處理／安全略過，不代表每個第三方動作成功
          content:
            application/json:
              schema:
                type: object
                required: [ok]
                properties: {ok: {const: true}}
        '400': {description: 驗簽後的body格式無效}
        '401': {description: 簽章缺失或無效，無記憶副作用}
        '413': {description: webhook body超過設定上限}
        '500': {description: 處理或回覆交付失敗，可能收到平台重送}
        '503': {description: LINE設定不足}
components:
  securitySchemes:
    LineSignature: {type: apiKey, in: header, name: x-line-signature}
  schemas:
    Event:
      type: object
      required: [type, source]
      properties:
        type: {type: string}
        webhookEventId: {type: string}
        replyToken: {type: string}
        source:
          type: object
          required: [type]
          properties:
            type: {type: string, enum: [user, group, room]}
            userId: {type: string}
            groupId: {type: string}
            roomId: {type: string}
        message:
          type: object
          required: [id, type]
          properties:
            id: {type: string}
            type: {type: string}
            text: {type: string}
        postback:
          type: object
          required: [data]
          properties:
            data: {type: string}
            params:
              type: object
              properties: {date: {type: string, format: date}}
        deliveryContext:
          type: object
          properties: {isRedelivery: {type: boolean}}
```

此為應用接受的LINE事件投影，不重新定義平台完整Event union；未知欄位忽略。type=message的text／image及type=postback的日期／原選單／選卡動作才進功能處理，依分支驗證message、postback、replyToken等必要欄位。不支援事件安全略過，不偽造成功諮詢；缺userId的group／room事件不能以共用群組ID代替個人記憶身分，安全略過且不讀寫記憶。

日期postback使用params.date；保留原switch-to-five-grids／switch-to-main-menu資料及alias。選卡data採既有內容映射與伺服器白名單，不能攜帶任意另一人的userKey。所有接受動作正規化後與C1共用行為。

同步await事件處理及回覆，整份webhook以30秒總預算限制；不在回200後留下需要雲端CPU持續運作的未等待工作。相同程序內以webhookEventId記錄in-flight／delivered：已交付事件不重跑，正在處理的重送不再次寫入／回覆；一批事件採逐項受控處理。預算不足不開始新項，未交付項可回500讓平台重送。跨程序重啟、缺事件ID及供應商結果未知仍可能重送；不承諾exactly-once或正式可用率。

## C3 — LINE Outbound Adapter

```yaml
format: shared-schema
contract: line-outbound-adapter
version: 1.0.0
owner: U1.BotExperience
mechanism: awaited-sdk-call
operations:
  reply:
    sdk: MessagingApiClient.replyMessage
    input:
      required: [replyToken, messages, deadline]
      replyToken: validated-event-token
      messages: native-LINE-text-or-flex-with-sender-and-quickReply
      deadline: absolute-request-deadline
    output: {status: [delivered, failed, outcome-unknown]}
  getImage:
    sdk: MessagingApiBlobClient.getMessageContent
    input: {required: [messageId, deadline], messageId: validated-image-event-id}
    output:
      status: [loaded, failed]
      image: {mimeType: [image/jpeg, image/png, image/webp], maxDecodedBytes: 5242880, persistent: false}
  switchMenu:
    sdk: MessagingApiClient.linkRichMenuIdToUser
    input: {required: [userId, target, deadline], target: [main, five]}
    output: {status: [applied, failed, outcome-unknown]}
  loading:
    sdk: MessagingApiClient.showLoadingAnimation
    input: {required: [userId, deadline], loadingSeconds: 20}
    output: {status: [started, failed, skipped]}
policy:
  automaticRetry: false
  retainAliases: [alias_main_menu, alias_five_grids]
  retainSwitchData: [switch-to-main-menu, switch-to-five-grids]
  credentials: server-environment-only
  userIdentity: verified-LINE-userId-only
```

reply依平台限制組合／分段文字與Flex，訊息數及文字長度須落在LINE SDK/API允許範圍；不把4000字元本機輸入限制作供應商完整規格。所有可點追問action傳完整問題、label依LINE上限顯示；保留三追問之外的datetimepicker與生命靈數message action。角色sender的四組名稱／頭像及未知COSMOS維持，不把[DEITY: ...]技術標記送進一般文字。

原原生Rich Menu richmenuswitch使用alias在LINE客戶端執行；伺服器也保留按已設定richMenuId連結使用者的可測路徑。缺少menu ID／alias或呼叫失敗回明確狀態，指南／返回文字入口仍可用；不刪除alias、不改 live default menu、不執行舊setup腳本。本機只改預覽並標示模擬。

動畫是盡力提示：僅在可用個人userId情境呼叫，失敗／不支援時不阻擋諮詢。LINE沒有本契約新增的停止動畫API；原生提示由平台計時或回覆結束，本機等待在finally／自身35秒上限一定結束。不冒稱API失敗時原生動畫仍成功。

## C4 — Consultation Model Adapter

```yaml
format: shared-schema
contract: consultation-model-adapter
version: 1.0.0
owner: U1.Consultation
mechanism: awaited-Gemini-or-Vertex-AI-sdk-call
input:
  required: [userContext, input, deadline]
  userContext:
    scope: current-verified-user-only
    allowed: [birthday, necessary-text-history, necessary-replies, image-descriptions]
  input:
    oneOf:
      - {kind: text, required: [text]}
      - {kind: image, required: [mimeType, imageBytes]}
  deadline: absolute-request-deadline
output:
  required: [text, roleKey, followUps, evidenceLabels]
  text: display-text-without-technical-role-tag
  roleKey: [ATHENA, VENUS, FORTUNE, COSMOS]
  followUps: {count: 3, distinct: true, relatedToCurrentTopic: true, sendFullTextOnClick: true}
  evidenceLabels: array-of-visible-source-labels
failures:
  - {code: CONFIG_UNAVAILABLE, behavior: no-provider-call}
  - {code: EXTERNAL_FAILED, behavior: no-successful-example-substitution}
  - {code: TIMEOUT, behavior: release-wait-and-ignore-late-display-result}
policy:
  modeOwner: server-configuration
  modes: [example, real]
  realProviders: [Gemini-API, Vertex-AI]
  retainedConfiguration: [GEMINI_API_KEY, GOOGLE_GENAI_API_KEY, GCP_PROJECT, GCP_LOCATION, VERTEX_AI_MODEL]
  automaticRetry: false
  persistRawImage: false
```

example走固定可重現教學內容，明示文字／圖片來源；real沿用Gemini API key或Vertex AI安全存取，不因缺key自動宣稱外部已可用。圖片真實路徑須送實際bytes與MIME，不能只傳固定描述；模型只取得此身分必要上下文，沒有另查／寫記憶的權限。

有效模型角色採原四角色；缺少／未知角色回COSMOS「星曜守護導師 艾蓮」，移除技術標記。主回覆成功但追問缺漏／生成失敗時，保留主回覆並提供三個相關可點替代題，標示「教學替代問題」；主回覆失敗則回失敗，不以固定文字冒稱模型成功。所有主回覆／追問呼叫共用剩餘30秒預算，不能每次重新起算。

## C5 — Conversation Memory Adapter

```yaml
format: shared-schema
contract: conversation-memory-adapter
version: 1.0.0
owner: U1.ConversationMemory
mechanism: awaited-local-persistence-or-Firestore-call
operations:
  read:
    input: {required: [userKey, deadline], userKey: server-derived-current-identity}
    output:
      status: [empty, loaded, read-failed]
      snapshot: current-user-necessary-state-and-turns-or-null
  save:
    input:
      required: [userKey, priorReadStatus, changes, deadline]
      priorReadStatus: [empty, loaded]
      changes: necessary-state-and-new-turn-only
    output: {status: [saved, write-failed, outcome-unknown]}
snapshotProjection:
  UserConversation: [userKey, birthday, mode, menu, recommendationIds, selectedCrystalId, turns]
  ConversationTurn: [turnId, userKey, inputText, replyText, imageDescription, senderRole, evidenceLabels, createdAt]
policy:
  solePersistentOwner: ConversationMemory
  adapters: [local-persistent-store, Firestore]
  legacyFirestoreCollection: crystal_memories
  legacySearchScope: [appName, userId]
  legacyDocumentFields: [appName, userId, sessionId, lastUpdateTime, events]
  normalizedStateSchemaOwner: Functional-Design
  readBeforeWrite: true
  writeAfterReadFailure: forbidden
  automaticRetry: false
  persistRawImageOrSecrets: false
  retention: until-operator-documented-reset
```

本機用實際持久資料位置，公開/static僅素材，不能暴露記憶／設定／秘密；具體檔案或DB選型留後續最小設計。新實例／重啟先讀回原資料，不能空初始狀態覆寫。empty與read-failed分開；read-failed允許未讀回／未保存的諮詢，但不寫入未知原狀態，也不呈現另一身分的歷史。

Firestore適配保留原collection與appName／userId查詢界線，以及必要的原事件文字讀回能力；完整正規化狀態與原session事件的映射在Functional Design落地。沒有授權遷移或刪除既有資料，不能直接拿新版空snapshot覆寫舊events。

save只有明確確認成功才回saved；已知拒絕回write-failed；已提交但逾時／連線中斷無法確認結果回outcome-unknown。超時不等於供應商取消寫入，不能宣稱已回滾或自動重送。下一次先重新讀取；回覆可交付並明示「未能確認保存」，讀寫競爭與晚到結果處理交Functional Design。operator reset不是公開API，本次復原不能自動刪資料。

## Error, Timeout & Retry Rules

| Boundary | 有限等待／失敗行為 | 重試界線 |
|---|---|---|
| C1 | 後端互動總預算30秒，前端35秒釋放等待；驗證錯誤留可修正輸入 | 使用者可修改後送新動作；前端不自動重送POST |
| C2 | 整批處理共30秒；401無副作用，格式錯400，未能交付500 | 僅平台可能重送；同程序事件ID盡力防重 |
| C3 | 每次呼叫不超出當前剩餘預算；動畫失敗不阻擋主回覆 | 不自動重試reply／選單；結果未知如實記錄 |
| C4 | 主模型與追問共享剩餘預算；遲到答案不更改已結束UI | 真實失敗提示新操作重試，不換成範例成功 |
| C5 | 讀寫不超出剩餘預算；讀取失敗不寫、提交未知不宣稱成功 | 下一操作先重新讀回，不自動重送未知寫入 |

每個外部步驟開始前檢查剩餘deadline，過期就不開始，實作使用供應商可用的timeout／abort並防止晚到結果被當新回覆。不能只在UI藏等待而讓應用繼續接受過期結果；具體取消及序列化策略在最小Functional／NFR Design落地。這是展示限制，不是正式可靠性／延遲SLA。

錯誤code、safe requestId與繁體中文message可供畫面及最小診斷使用。retryable只指使用者可再發新互動，不代表能重播replyToken或未知寫入。200只表示答案／動作已交付，保存／動畫／外部結果獨立標示；不能以HTTP成功當全部第三方成功。日誌不包含token、secret、imageBytes或完整對話。

## Contract Ownership & Versioning

- U1擁有全部應用契約；BotExperience擁有C1–C3，Consultation擁有C4，ConversationMemory擁有C5，維持唯一實體擁有權。
- 教學API回覆contractVersion=1.0.0；供應商原wire payload不加自訂版本欄位。
- 新增可選回覆欄位可相容，消費者忽略未知欄位；新輸入欄位須先更新伺服器允許規則，不能由客戶端擅自注入。
- 改必填、刪欄位、改語義或身分規則為破壞性修改：同步更新版本、UI／LINE適配、文件及契約測試後核准；本次不維護多個API版本或引入服務註冊。
- 不新增跨UnitAPI、shared mutable globals、事件bus、公開登入平台或正式exactly-once基礎設施。

## Requirement Coverage & Verification Handoff

| Requirement group | Contract |
|---|---|
| FR1／FR1.1／FR1.2：入口及Echo | C1、C2、C3 |
| FR2／FR2.1／FR2.2：文字與圖片 | C1、C2、C3、C4 |
| FR3／FR3.1／FR3.2：持久與身分 | C1、C2、C5 |
| FR4／FR4.1／FR4.2：三追問＋捷徑 | C1、C2、C3、C4 |
| FR5／FR5.1：四角色 | C1、C3、C4 |
| FR6／FR6.1／FR6.2：雙選單、六指南 | C1、C2、C3 |
| FR7／FR7.1：等待 | C1、C3、C4 |
| FR8／FR8.1／FR8.2：生日／1–9 | C1、C2、C3 |
| FR9／FR9.1：三卡與介紹 | C1、C2、C3、C4 |
| FR10／FR10.1／FR10.2：教學與交付 | C1–C5 |
| NFR1–NFR5 | 身分／秘密界線、有限等待、契約與需求測試、原生介面交接、證據與安全診斷 |

後續以有效／無效請求、簽章、A／B隔離、真實圖片bytes、deadline及晚到結果、三卡／三追問／四角色、實際持久重啟與受限檔案存取作契約及整合檢查。保留52個AC；不只驗欄位或按鈕存在，不以生日主旅程取代全功能。供應商替身只證明分支與呼叫；沒有憑證或手機實測時分列外部待驗證。

## Open Questions

| Contract | Question | Blocks |
|---|---|---|
| None | 無未解契約方向；完整實體schema、儲存選型／映射、讀寫序列化及具體timeout／abort屬後續適用設計 | 不阻擋本階段；實作前須由所屬設計落地 |

## Assumptions & Open Questions

None. 五項契約承接已確認方向；外部憑證、Gemini／Vertex AI成效、Firestore與LINE手機結果仍待驗證。此文件是契約，不是已實作或已通過應用測試的證據。跨程序防重、背景佇列、正式雲端／可靠性整備延後，不延長一天或刪除原功能。
