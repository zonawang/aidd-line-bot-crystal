# Zona Crystal — 功能實體模型

## Sources

- [已確認問答](functional-design-questions.md)、[元件與擁有權](../../../inception/domain-design/components.md)、[介面契約](../../../inception/contract-design/contract-summary.md)。
- [全部需求](../../../inception/requirements-analysis/requirements.md)、[全部故事](../../../inception/user-stories/stories.md)。

## Entity Model

以下YAML是資料形狀與關聯的來源；邏輯型別不綁定程式語言、資料庫或框架。nullable以required=false及default=null表示；時間採可跨入口解讀的絕對時間。

```yaml
{
  "schemaVersion": 1,
  "entities": [
    {
      "name": "Interaction",
      "owner": "BotExperience",
      "description": "一次短期處理；不持久保存原輸入圖片或平台秘密。",
      "attributes": [
        {
          "name": "interactionId",
          "type": "identifier",
          "required": true,
          "unique": true
        },
        {
          "name": "source",
          "type": "enum",
          "required": true,
          "allowedValues": [
            "demo",
            "line"
          ]
        },
        {
          "name": "userKey",
          "type": "identifier",
          "required": true,
          "references": "UserConversation.userKey",
          "constraints": "入口可信映射；空記憶仍有身分，讀取失敗時不取得其他身分的上下文。"
        },
        {
          "name": "action",
          "type": "enum",
          "required": true,
          "allowedValues": [
            "text",
            "image",
            "birthday",
            "select-crystal",
            "guide",
            "set-mode",
            "set-menu",
            "recall",
            "recommend",
            "follow-up",
            "life-path"
          ]
        },
        {
          "name": "input",
          "type": "validated input",
          "required": true,
          "constraints": "依動作的必要欄位；圖片僅短期bytes／MIME，文字4000字元、圖片5MiB、入口body8MiB上限。"
        },
        {
          "name": "result",
          "type": "result projection",
          "required": false,
          "constraints": "答案、sender、追問、卡片、memoryStatus與evidenceLabels依契約；失敗不偽造成功。"
        },
        {
          "name": "status",
          "type": "enum",
          "required": true,
          "default": "accepted",
          "allowedValues": [
            "accepted",
            "loading-memory",
            "processing",
            "saving",
            "delivering",
            "completed",
            "failed",
            "timed-out"
          ]
        },
        {
          "name": "evidenceLabels",
          "type": "distinct text list",
          "required": true,
          "default": []
        },
        {
          "name": "deadline",
          "type": "instant",
          "required": true,
          "constraints": "同一次互動／webhook共用的絕對期限；不是各步重新起算。"
        },
        {
          "name": "memoryStatus",
          "type": "read/write status",
          "required": true,
          "constraints": "read=empty|loaded|read-failed；write=not-attempted|saved|write-failed|outcome-unknown。"
        },
        {
          "name": "displayGeneration",
          "type": "nonnegative integer",
          "required": false,
          "constraints": "教學頁身分／請求世代；舊世代不可更新新畫面。"
        }
      ],
      "constraints": [
        "Interaction生命週期不等於UserConversation的持久狀態；requestId可安全診斷，不存入模型輸入。",
        "completed只表示動作／答案已處理，保存／LINE交付狀態另判定。"
      ]
    },
    {
      "name": "Crystal",
      "owner": "CrystalKnowledge",
      "description": "原七款水晶的唯讀教學內容。",
      "attributes": [
        {
          "name": "crystalId",
          "type": "identifier",
          "required": true,
          "unique": true
        },
        {
          "name": "name",
          "type": "text",
          "required": true
        },
        {
          "name": "summary",
          "type": "text",
          "required": true
        },
        {
          "name": "imageUrl",
          "type": "public URI",
          "required": true
        },
        {
          "name": "introduction",
          "type": "text",
          "required": true
        },
        {
          "name": "labels",
          "type": "text list",
          "required": true,
          "default": []
        }
      ],
      "constraints": [
        "七款原名稱與介紹／圖片來源沿用；無管理後台。",
        "卡片視圖不複製擁有權；圖片載入失敗仍有名稱與動作。"
      ]
    },
    {
      "name": "Guide",
      "owner": "CrystalKnowledge",
      "description": "原文字指南與可操作入口。",
      "attributes": [
        {
          "name": "guideKey",
          "type": "identifier",
          "required": true,
          "unique": true
        },
        {
          "name": "label",
          "type": "text",
          "required": true
        },
        {
          "name": "aliases",
          "type": "distinct text list",
          "required": true,
          "constraints": "合計涵蓋使用指南、使用說明、閱讀指南、認識水晶、淨化方法、功效與佩戴。"
        },
        {
          "name": "content",
          "type": "text",
          "required": true
        },
        {
          "name": "actions",
          "type": "action list",
          "required": true,
          "constraints": "日期、卡片、Echo與返回入口可發現，不強制每篇都提供同一組。"
        }
      ],
      "constraints": [
        "同一別名只能指向一個指南；沿用原內容。"
      ]
    },
    {
      "name": "DeityProfile",
      "owner": "Consultation",
      "description": "原四角色的唯讀sender與主題規則。",
      "attributes": [
        {
          "name": "roleKey",
          "type": "enum",
          "required": true,
          "unique": true,
          "allowedValues": [
            "ATHENA",
            "VENUS",
            "FORTUNE",
            "COSMOS"
          ]
        },
        {
          "name": "senderName",
          "type": "text",
          "required": true
        },
        {
          "name": "iconUrl",
          "type": "public URI",
          "required": true
        },
        {
          "name": "topics",
          "type": "distinct text list",
          "required": true
        }
      ],
      "constraints": [
        "名稱依已核准需求原文；無效role回COSMOS。",
        "文字回覆不可顯示技術角色標記；頭像失敗名稱仍可讀。"
      ]
    },
    {
      "name": "UserConversation",
      "owner": "ConversationMemory",
      "description": "目前可信身分的必要持久狀態。",
      "attributes": [
        {
          "name": "userKey",
          "type": "identifier",
          "required": true,
          "unique": true,
          "constraints": "appName＋identity namespace＋可信identity；demo A/B與LINE userId有分開namespace。"
        },
        {
          "name": "schemaVersion",
          "type": "positive integer",
          "required": true,
          "default": 1
        },
        {
          "name": "revision",
          "type": "nonnegative integer",
          "required": true,
          "default": 0,
          "constraints": "本程序成功提交後增加；不是多程序比較交換保證。"
        },
        {
          "name": "birthday",
          "type": "calendar date",
          "required": false,
          "default": null,
          "constraints": "正規YYYY-MM-DD，0001–9999有效公曆；不加年齡條件。"
        },
        {
          "name": "mode",
          "type": "enum",
          "required": true,
          "default": "consult",
          "allowedValues": [
            "consult",
            "echo"
          ]
        },
        {
          "name": "menu",
          "type": "enum",
          "required": true,
          "default": "main",
          "allowedValues": [
            "main",
            "five"
          ]
        },
        {
          "name": "recommendationIds",
          "type": "distinct identifier list",
          "required": true,
          "default": [],
          "references": "Crystal.crystalId",
          "constraints": "只允許0或3個；三卡產生後每個ID都來自原池。"
        },
        {
          "name": "selectedCrystalId",
          "type": "identifier",
          "required": false,
          "default": null,
          "references": "Crystal.crystalId",
          "constraints": "有值時須包含於recommendationIds；產生新三卡時清除舊選卡。"
        },
        {
          "name": "turns",
          "type": "ordered owned turn list",
          "required": true,
          "default": [],
          "references": "ConversationTurn.turnId",
          "constraints": "只含同userKey；必要歷史保留到operator reset，不為模型上下文上限刪除持久資料。"
        }
      ],
      "constraints": [
        "empty才可用初值；read-failed不得用初值覆寫未知原記憶。",
        "沒有公開重設／任意userKey輸入；原資料唯讀投影，不做破壞性遷移。"
      ]
    },
    {
      "name": "ConversationTurn",
      "owner": "ConversationMemory",
      "description": "必要文字／圖片描述與答案；由所屬使用者聚合持有。",
      "attributes": [
        {
          "name": "turnId",
          "type": "identifier",
          "required": true,
          "unique": true,
          "constraints": "新版穩定turnId；舊資料以原doc ID及event index形成穩定來源ID，不因重讀重複加入。"
        },
        {
          "name": "userKey",
          "type": "identifier",
          "required": true,
          "references": "UserConversation.userKey"
        },
        {
          "name": "inputText",
          "type": "text",
          "required": false,
          "default": null,
          "constraints": "必要文字／生日輸入；圖片原檔及平台token不保存。"
        },
        {
          "name": "replyText",
          "type": "text",
          "required": false,
          "default": null
        },
        {
          "name": "imageDescription",
          "type": "text",
          "required": false,
          "default": null,
          "constraints": "只保存已產生文字描述，本機範例保留證據標示。"
        },
        {
          "name": "senderRole",
          "type": "enum",
          "required": true,
          "default": "COSMOS",
          "references": "DeityProfile.roleKey",
          "allowedValues": [
            "ATHENA",
            "VENUS",
            "FORTUNE",
            "COSMOS"
          ]
        },
        {
          "name": "evidenceLabels",
          "type": "distinct text list",
          "required": true,
          "default": []
        },
        {
          "name": "createdAt",
          "type": "instant",
          "required": false,
          "constraints": "新回合必填；舊事件使用有效timestamp或lastUpdateTime，兩者均無效時保留null，不捏造時間。"
        },
        {
          "name": "sourceRef",
          "type": "identifier",
          "required": false,
          "constraints": "舊來源身分＋doc ID＋index；只供去重及順序，不顯示供應商技術資訊。"
        }
      ],
      "constraints": [
        "至少inputText、replyText或imageDescription之一有必要文字內容；recall不把全部歷史再次加入造成增長。",
        "新回合完整提交一次；保存未知不自動重送。"
      ]
    }
  ],
  "relationships": [
    {
      "from": "UserConversation",
      "to": "ConversationTurn",
      "cardinality": "1 -> 0..many",
      "direction": "owns",
      "constraint": "每個Turn恰屬於同userKey的一個Conversation。"
    },
    {
      "from": "Interaction",
      "to": "UserConversation",
      "cardinality": "many -> 0..1",
      "direction": "reads projection",
      "constraint": "短期Interaction讀當前身分；empty/read-failed時沒有已讀持久實體。"
    },
    {
      "from": "UserConversation",
      "to": "Crystal",
      "cardinality": "many -> 0..3",
      "direction": "references",
      "constraint": "推薦ID；selectedCrystalId是這組的0..1引用。"
    },
    {
      "from": "ConversationTurn",
      "to": "DeityProfile",
      "cardinality": "many -> 1",
      "direction": "references",
      "constraint": "senderRole有效，未知回COSMOS。"
    }
  ]
}
```

## Entity Summary

|實體|唯一擁有者|生命週期|
|---|---|---|
|Interaction|BotExperience|單次短期互動，不持久存原圖片或平台token|
|Crystal、Guide|CrystalKnowledge|原內容唯讀|
|DeityProfile|Consultation|四角色唯讀設定|
|UserConversation、ConversationTurn|ConversationMemory|依可信身分隔離的必要狀態／文字，保留到文件重設|

一個Conversation擁有零至多個同身分Turn；推薦是零或三個Crystal引用，選卡為其中一個；Turn引用有效角色。Interaction只取得目前身分的資料投影，不取得持久寫入擁有權。Guide無新增實體關聯，actions是入口動作值。

## Persistence Projection

新版聚合的schemaVersion=1，revision與來源ID是必要序列／去重中介資料，不是新領域服務。持久形狀和wire API投影分開：本機State保留契約user=A/B，不暴露內部userKey或歷史來源ID。一般文字／生日／諮詢成功才形成必要回合；模式、選單與推薦保存狀態，recall是讀取操作。只存必要文字／描述，不保存原圖片、replyToken或secret。

舊資料的文字保留唯讀，不能以新版初值覆寫。具體舊欄位投影與保存序列見[functional-spec.md](functional-spec.md)；任何無法確認的舊時間／生日不捏造。這是設計，尚非持久測試通過證據。

