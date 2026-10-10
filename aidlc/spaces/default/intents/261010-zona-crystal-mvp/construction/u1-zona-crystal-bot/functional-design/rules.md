# Zona Crystal — 最小業務規則

## Sources

- [已確認問答](functional-design-questions.md)、[entities.md](entities.md)。
- [全部需求](../../../inception/requirements-analysis/requirements.md)、[全部故事](../../../inception/user-stories/stories.md)、[C1–C5契約](../../../inception/contract-design/contract-summary.md)。

## Business Rules

下列YAML是規則來源；編號供全部AC與後續測試追溯，category保留固定分類。流程先後與狀態轉移由functional-spec規定。

```yaml
{
  "rules": [
    {
      "id": "BR1.1",
      "statement": "入口可信身分與共用行為",
      "category": "authorization",
      "appliesTo": "Interaction",
      "trigger": "接收本機／平台動作",
      "logic": "IF本機教學入口，THEN只接受A/B並伺服器映射；IF真實平台，THEN原始body驗簽後取userId及驗分支欄位，所有接受動作走同一流程。",
      "violationBehaviour": "無效簽章401且無模型／記憶副作用；不支援或缺userId安全略過；公開模式教學API404。",
      "source": [
        "FR1",
        "FR1.1",
        "NFR1"
      ]
    },
    {
      "id": "BR1.2",
      "statement": "Echo與退出的優先序",
      "category": "policy",
      "appliesTo": "UserConversation.mode",
      "trigger": "模式動作或文字／圖片",
      "logic": "IF明確進出模式動作或文字，THEN先更新模式；IF其餘文字且echo，THEN原樣回聲；IFecho圖片，THEN文字模式提示。",
      "violationBehaviour": "退出不回聲；圖片不宣稱AI辨識；下一次consult仍可用。",
      "source": [
        "FR1.2"
      ]
    },
    {
      "id": "BR2.1",
      "statement": "文字諮詢、例子與真實失敗",
      "category": "policy",
      "appliesTo": "Interaction.result",
      "trigger": "一般諮詢文字",
      "logic": "IFexample，THEN可重現固定內容且就近標教學範例回覆；IFreal，THEN傳本次文字與此身分必要上下文至模型並保留角色／三追問／必要回合。",
      "violationBehaviour": "真實設定不足或主模型失敗回明確錯誤，絕不換成功範例；下一操作可恢復。",
      "source": [
        "FR2",
        "FR2.1",
        "NFR2"
      ]
    },
    {
      "id": "BR2.2",
      "statement": "圖片格式、真實bytes與描述",
      "category": "validation",
      "appliesTo": "Interaction.input",
      "trigger": "圖片輸入",
      "logic": "IFMIME及內容同為JPEG/PNG/WebP且解碼不超5MiB、入口body不超8MiB，THEN真實分支送取得的bytes／MIME；example固定描述就近標圖片辨識範例，非真實辨識。",
      "violationBehaviour": "格式／內容不符、解碼錯／過大或取得／模型失敗，提示重傳、改文字或重試；不持久存bytes。",
      "source": [
        "FR2.2",
        "NFR2"
      ]
    },
    {
      "id": "BR3.1",
      "statement": "必要記憶先讀再更新及重啟",
      "category": "constraint",
      "appliesTo": "UserConversation、ConversationTurn",
      "trigger": "任何持久變化",
      "logic": "IFread=empty/loaded，THEN以實際讀回狀態及必要增量保存；重啟先讀，不以空初值覆寫；保存必要文字、有效生日、回覆／圖片描述與模式／選單／卡ID直到operator reset。",
      "violationBehaviour": "read-failed不得寫；不保存原圖片、秘密、平台token，不以模型context限制刪歷史。",
      "source": [
        "FR3",
        "FR3.1"
      ]
    },
    {
      "id": "BR3.2",
      "statement": "身分與A/B畫面隔離",
      "category": "authorization",
      "appliesTo": "userKey、displayGeneration",
      "trigger": "讀記憶或切身分",
      "logic": "IF切A/B，THEN先清空舊視圖並以新身分讀回；只當身分及世代仍匹配才顯示結果。LINE只採可信userId，本機與LINE namespace不同。",
      "violationBehaviour": "B不得讀A；新身分讀失敗不得沿用舊歷史；外來userKey／mode／provider不可變更授權。",
      "source": [
        "FR3.2",
        "NFR1"
      ]
    },
    {
      "id": "BR3.3",
      "statement": "保存狀態與答案分開",
      "category": "policy",
      "appliesTo": "Interaction.memoryStatus",
      "trigger": "讀寫完成或逾時",
      "logic": "IFread空／成功／失敗，THEN分別empty/loaded/read-failed；IFsave已確認／已知拒絕／提交後未知，THENsaved/write-failed/outcome-unknown。未提交則not-attempted。",
      "violationBehaviour": "讀取失敗仍可明示無歷史／不保存的諮詢；不能稱已保存，未知提交不稱回滾，不自動重試寫入。",
      "source": [
        "FR3.1",
        "NFR2"
      ]
    },
    {
      "id": "BR3.4",
      "statement": "舊資料唯讀投影與單程序序列",
      "category": "constraint",
      "appliesTo": "UserConversation、ConversationTurn",
      "trigger": "讀舊歷史、並行請求、晚到保存",
      "logic": "IF同身分操作，THEN依序讀／處理／提交並共用期限；原session唯讀，新版版本化session避撞原記錄，以穩定來源ID投影文字。IF保存未知未結束，THEN阻止後續持久更新；結束後先重讀。",
      "violationBehaviour": "排隊過期不開始，read-failed不覆寫；未結束有界回讀失敗／未保存；不承諾多程序一致性或跨重啟防重。",
      "source": [
        "FR3.1",
        "NFR2"
      ]
    },
    {
      "id": "BR4.1",
      "statement": "三個追問及完整題文",
      "category": "constraint",
      "appliesTo": "Interaction.result.followUps",
      "trigger": "諮詢或選卡回答完成",
      "logic": "IF產生結果，THEN恰三個非空、不同、相關可點問題；點任一題送完整題文至下一諮詢。主答成功但追問缺漏時補相關教學替代題並標來源。",
      "violationBehaviour": "主答失敗不冒稱追問成功；不可用問題不能留下無行為按鈕。",
      "source": [
        "FR4",
        "FR4.1"
      ]
    },
    {
      "id": "BR4.2",
      "statement": "額外日期與生命靈數捷徑",
      "category": "policy",
      "appliesTo": "Interaction.result.quickActions",
      "trigger": "呈現快捷動作",
      "logic": "IF有效生日已取得，THEN另提供了解我的生命靈數及日期入口；捷徑送原完整問題『老師，請幫我解析我的生命靈數是 N』至文字諮詢。本機life-path由已讀生日形成該題；三追問不限制整組總數。LINE日期事件params.date及本機日期控制都走生日規則。",
      "violationBehaviour": "無有效生日不產生基於錯誤生日的內容；life-path提示先提供生日，不產生新卡。",
      "source": [
        "FR4.2",
        "FR8.1",
        "FR8.2"
      ]
    },
    {
      "id": "BR5.1",
      "statement": "四角色與COSMOS預設",
      "category": "policy",
      "appliesTo": "DeityProfile",
      "trigger": "模型／教學答案呈現",
      "logic": "IF角色有效，THEN採原名稱／頭像與主題；教學四組原輸入可重現。IF未知／缺角色，THENCOSMOS。移除技術角色標記。",
      "violationBehaviour": "頭像載入失敗仍有名稱／答案；不將本機固定角色推論為真實模型成效。",
      "source": [
        "FR5",
        "FR5.1"
      ]
    },
    {
      "id": "BR6.1",
      "statement": "雙選單與非破壞切換",
      "category": "policy",
      "appliesTo": "UserConversation.menu",
      "trigger": "set-menu或原switch資料",
      "logic": "IFmain/five，THEN保留原素材、格子及返回／分享動作；本機改預覽標LINE操作模擬，真實路徑採已設定ID／alias。",
      "violationBehaviour": "切換失敗提供文字返回／指南與如實狀態，不宣稱applied；不刪alias、不改live default、不跑舊setup。",
      "source": [
        "FR6",
        "FR6.1"
      ]
    },
    {
      "id": "BR6.2",
      "statement": "六指南與可發現入口",
      "category": "policy",
      "appliesTo": "Guide",
      "trigger": "指南別名或選單入口",
      "logic": "IF六個既有文字入口，THEN回對應原內容；使用指南中可發現日期、卡片與Echo，閱讀後可返回或諮詢。",
      "violationBehaviour": "素材失敗保留同名文字／返回；未知指南不回錯內容。",
      "source": [
        "FR6.2"
      ]
    },
    {
      "id": "BR7.1",
      "statement": "共用期限及等待復原",
      "category": "constraint",
      "appliesTo": "Interaction.status",
      "trigger": "諮詢／外部I/O開始與結束",
      "logic": "IF互動開始，THEN後端30秒共用deadline，前端35秒上限；可用個人情境盡力呼叫LINE動畫。成功／失敗／逾時均釋放本機等待；過期不開始新步驟，晚到結果不改新畫面。",
      "violationBehaviour": "動畫失敗不阻擋主答；真實動畫由平台計時／回覆結束，不假造停止API；下一請求仍可處理。",
      "source": [
        "FR7",
        "FR7.1",
        "NFR2"
      ]
    },
    {
      "id": "BR8.1",
      "statement": "原日期形式與有效公曆",
      "category": "validation",
      "appliesTo": "UserConversation.birthday",
      "trigger": "生日動作／文字候選",
      "logic": "IFYYYY-MM-DD、YYYY/MM/DD、YYYY年M月D日、空白年月日、YYYYMMDD或嵌入文字找到單一日期，THEN驗0001–9999、公曆月日與閏年並正規化，不新增年齡／未來限制。",
      "violationBehaviour": "無效、缺資料或多個不同日期要求單一修正，不產生新數字／新卡，不改舊生日；普通非日期文字仍可諮詢。",
      "source": [
        "FR8",
        "FR8.1"
      ]
    },
    {
      "id": "BR8.2",
      "statement": "生命靈數反覆縮減1–9",
      "category": "calculation",
      "appliesTo": "birthday-derived lifePath",
      "trigger": "有效生日／生命靈數詢問",
      "logic": "IFbirthday有效，THEN相加YYYYMMDD各位數並反覆相加直到1–9；2000-01-01=4，2000-01-08=2，2000-09-29=4，1999-11-12=6。生日提交帶三卡與捷徑；單獨life-path讀現有生日。",
      "violationBehaviour": "不保留11/22/33；無有效生日不計算或產生新卡；教學不宣稱命運驗證。",
      "source": [
        "FR8.2"
      ]
    },
    {
      "id": "BR9.1",
      "statement": "原七款池三卡不放回",
      "category": "constraint",
      "appliesTo": "Crystal、recommendationIds",
      "trigger": "有效生日或獨立推薦",
      "logic": "IF產生推薦，THEN從原七款池均勻不放回選三個ID；每卡原名稱、簡介、圖片／文字替代與可選動作，清除舊selected。#水晶／今日水晶推薦不用生日先決條件。",
      "violationBehaviour": "不得重複或偏差隨機排序；不要求固定順序／同生日固定結果；圖片失敗保留動作。",
      "source": [
        "FR9",
        "FR9.1"
      ]
    },
    {
      "id": "BR9.2",
      "statement": "選卡與當前三卡一致",
      "category": "validation",
      "appliesTo": "selectedCrystalId",
      "trigger": "select-crystal",
      "logic": "IFID在原池且屬目前三卡，THEN回該卡原介紹、有效sender與三追問，保存必要選卡狀態。",
      "violationBehaviour": "未知／非本次ID拒絕並提示重選；讀失敗不能猜卡、不能回另一卡介紹。",
      "source": [
        "FR9.1"
      ]
    },
    {
      "id": "BR10.1",
      "statement": "教學頁完整操作與易用性",
      "category": "constraint",
      "appliesTo": "frontend views",
      "trigger": "初始、結果、失敗畫面",
      "logic": "IF本機無key，THENFR1–FR9均有入口，顯示模式／身分；375/1280主要動作可用、鍵盤可達、標籤／焦點／圖片替代／等待錯誤文字可讀。",
      "violationBehaviour": "動態結果就近標範例／模擬；技術細節不妨礙一般使用者決策。",
      "source": [
        "FR10",
        "FR10.1",
        "NFR4"
      ]
    },
    {
      "id": "BR10.2",
      "statement": "可重現交付及資料復原",
      "category": "policy",
      "appliesTo": "delivery instructions",
      "trigger": "展示／重啟／reset／rollback",
      "logic": "IF交付，THEN列啟動、全部功能、四角色原輸入、A/B隔離、重啟再選A及關鍵檢查；reset明列受影響資料，rollback保留記憶。",
      "violationBehaviour": "無外部設定列缺失與本機途徑；不自動刪資料、不為正式部署延長時限。",
      "source": [
        "FR10.2"
      ]
    },
    {
      "id": "BR10.3",
      "statement": "公開資料與秘密界線",
      "category": "authorization",
      "appliesTo": "public routes、diagnostics",
      "trigger": "靜態請求／記錄／回覆",
      "logic": "IF公開素材請求，THEN只允許公開清單；設定、記憶／秘密無公開路徑。秘密只由安全設定載入，不進版本、結果、模型context或日誌。",
      "violationBehaviour": "禁止root全目錄靜態暴露；拒絕路徑穿越及受限檔案請求，不輸出原錯誤堆疊／完整對話。",
      "source": [
        "NFR1",
        "FR10.1",
        "FR10.2"
      ]
    },
    {
      "id": "BR10.4",
      "statement": "需求與元件關鍵驗證",
      "category": "policy",
      "appliesTo": "verification evidence",
      "trigger": "檢查／合併",
      "logic": "IF驗證，THEN每項可測需求有相應測試、每個可測元件有正常路徑，沿用suite及適用lint/format／底線通過；本機CI同命令，記環境、exit code與AC對照。",
      "violationBehaviour": "失敗阻擋合併；不以文件對照當應用測試，不新增無來源覆蓋率承諾。",
      "source": [
        "NFR3",
        "FR10.2"
      ]
    },
    {
      "id": "BR10.5",
      "statement": "證據分列與最小診斷",
      "category": "policy",
      "appliesTo": "evidenceLabels、safe logs",
      "trigger": "操作結果／交付",
      "logic": "IF固定文字、固定圖片、LINE模擬或追問替代，THEN就近標原定標籤；交付分已實作、本機已測、模擬、外部已測、待驗證；診斷可判啟動／成功／失敗。",
      "violationBehaviour": "未實測不稱真實LINE／模型／Firestore通過；不記秘密或完整對話、不承諾正式SLA。",
      "source": [
        "NFR5",
        "FR10.2"
      ]
    }
  ]
}
```

## Rules Summary

|規則|摘要|來源|
|---|---|---|
|BR1.1|入口可信身分與共用行為|FR1、FR1.1、NFR1|
|BR1.2|Echo與退出的優先序|FR1.2|
|BR2.1|文字諮詢、例子與真實失敗|FR2、FR2.1、NFR2|
|BR2.2|圖片格式、真實bytes與描述|FR2.2、NFR2|
|BR3.1|必要記憶先讀再更新及重啟|FR3、FR3.1|
|BR3.2|身分與A/B畫面隔離|FR3.2、NFR1|
|BR3.3|保存狀態與答案分開|FR3.1、NFR2|
|BR3.4|舊資料唯讀投影與單程序序列|FR3.1、NFR2|
|BR4.1|三個追問及完整題文|FR4、FR4.1|
|BR4.2|額外日期與生命靈數捷徑|FR4.2、FR8.1、FR8.2|
|BR5.1|四角色與COSMOS預設|FR5、FR5.1|
|BR6.1|雙選單與非破壞切換|FR6、FR6.1|
|BR6.2|六指南與可發現入口|FR6.2|
|BR7.1|共用期限及等待復原|FR7、FR7.1、NFR2|
|BR8.1|原日期形式與有效公曆|FR8、FR8.1|
|BR8.2|生命靈數反覆縮減1–9|FR8.2|
|BR9.1|原七款池三卡不放回|FR9、FR9.1|
|BR9.2|選卡與當前三卡一致|FR9.1|
|BR10.1|教學頁完整操作與易用性|FR10、FR10.1、NFR4|
|BR10.2|可重現交付及資料復原|FR10.2|
|BR10.3|公開資料與秘密界線|NFR1、FR10.1、FR10.2|
|BR10.4|需求與元件關鍵驗證|NFR3、FR10.2|
|BR10.5|證據分列與最小診斷|NFR5、FR10.2|

## Boundaries

birthday-derived lifePath與各回覆projection不是新增實體；資料擁有權仍為既有六實體。圖片／文字格式、簽章與安全路徑屬入口必要驗證，不新增正式認證／合規承諾。保存／切換／動畫成功各自判定；HTTP成功不代表全部外部成功。需要實作後的證據才可稱應用驗證通過。
