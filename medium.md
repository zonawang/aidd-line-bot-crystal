# 我把原有的 LINE Bot 交給 AIDD，這次先說清楚哪些功能要留下來

上一篇，我分享了用 AIDD 做 LINE 午餐 Bot 的過程。從「今天中午吃什麼」，走到真正收到餐廳推薦，也碰到了需求膨脹、環境調查和反覆核准的問題。

寫完之後，我想再試一次。

但這次，起點換了。

**我已經有一個做過的 LINE Bot，叫做 Zona Crystal。這次是把原有專案交給 AI，請它讀懂、重新整理 spec，再透過 AIDD 推進成可以展示、教學與分享的版本。**

原本的程式、互動設計和素材都存在，也分散在幾個 repo 裡。我要確認的是：當 AI 接手一個已經有東西的專案，它能不能理解哪些值得沿用、哪些功能必須保留，以及這次做到哪裡就可以交付？

這篇想記錄的，除了最後做出了什麼，更是我這次實際下了哪些指令，以及這些指令怎麼影響開發方向。

用詞沿用上一篇：AIDD 是 AI 驅動開發的概念；這次實際使用的框架是 **AI-DLC**，執行工具是 Codex CLI。

## 第一道指令：先讀我做過的東西，重新寫 spec

我一開始是這樣問的：

> 我曾經有做過一個 LINE Bot，叫做 Zona Crystal，你能讀到我先前已經做過的東西，重新寫 spec 並為我規劃怎麼能做得更完善嗎？

接著，我補上這些 repo：

```text
zonawang/line-echo-bot
zonawang/line-memory-bot
zonawang/line-quick-reply
zonawang/line-icon-switch
zonawang/line-rich-menu-switch
zonawang/line-loading-animation
zonawang/line-datetime-picker
```

這些是我過去逐步做出來的功能版本：Echo、記憶、追問、角色頭像、選單切換、等待動畫，以及生日日期選擇。後續盤點也納入了 `line-flex-message` 的三張水晶卡功能。

所以，這次不能只看最後一個 repo，然後把前面累積的功能當成可有可無。

**在既有專案上跑 AIDD，第一步是建立「現在已經有什麼」的共同理解。**

新版有新增與整合的程式，也有本機教學介面；這不代表完全沒有寫新東西。但產品功能、指南、圖片和原有互動都有來源，不能把整個成果寫成 AI 從零創造出來。

這也是重新寫 spec 的價值：把散在不同版本裡的功能，整理成同一份能實作、能驗收的需求。

## 第二道指令：這次的目的，只是展示、教學與分享

上一篇做到一半，我才把優先級拉回 Time-to-MVP。這次，我在開始時就先說明：

> 我這次這產品的目的只是——可展示、教學與分享的 bot。

然後給了一段比較完整的英文指令。以下是原始指令的部分節錄，並非全文：

```text
Build this project using an MVP-first, time-boxed AIDLC workflow.

Primary Goal:
Complete the entire AIDLC workflow and deliver a working,
demonstrable MVP within ONE working day.

The highest priority is Time-to-MVP,
not architectural completeness or production readiness.
```

我也把完成條件講清楚：核心旅程能端到端操作、能在本機或最簡單的環境 Demo、關鍵測試通過，並且留下已知限制與延後項目。

對 Zona Crystal 來說，主展示旅程是：

**輸入生日 → 生命靈數與三張水晶卡 → 選卡看介紹 → 點追問 → 延續記憶。**

例如輸入 `2000-01-01`，會得到生命靈數 4 和三張不同的水晶卡，再從其中一張繼續互動。

「做得更完善」很容易讓 AI 往更多功能、更完整架構的方向走。加上用途與完成條件之後，才比較容易判斷：現在的工作，是否真的有助於這次展示？

### 十分鐘停損，也在一開始就說

上一篇，我後來訂下約十五分鐘的非核心診斷上限。這次改成十分鐘，而且直接放進最初的指令：

```text
If an architecture, infrastructure, dependency, environment,
or design issue cannot be resolved within 10 minutes,
stop investigating it.

Choose the simplest viable workaround,
simplify the requirement, or remove that part from the MVP.

Record the issue as a deferred item and continue.
```

我還指定，若一天時限有風險，先縮減範圍，不延長時程來保住所有工程工作。

我沒有替每次調查計時，所以十分鐘是這次訂下的工作規則。它的作用，是讓 AI 遇到問題時，知道什麼時候該換條路，先找能讓 MVP 繼續的簡單方案。

## 第三道指令：「我原有的功能都要留著」

這次最重要的一次修正，其實只有一句話：

> 2我原有的功能都要留著

當時流程為了縮小 MVP，曾把圖片辨識、永久記憶等功能列為延後。

如果是新題目，這種取捨可能合理。但對我來說，它們是原本已經做過的功能，也是這個 Bot 可以拿來教學的內容。

**我希望縮小的是這次新增的工程負擔，原有的功能則要整合進新版。**

後來，範圍文件修正成完整保留：文字與圖片諮詢、持久記憶與回憶、三個後續問題、四個角色、Echo、雙選單、指南、等待提示、生日與生命靈數，以及三卡推薦。

生日三卡仍然是主展示旅程，但走完這條路，不能就當成其他功能也完成了。

這裡有一個很實際的提醒：**「MVP-first」本身不會告訴 AI 哪些可以刪、哪些必須留下。**

兩個指令一起看，最後的工作邊界才完整：原有功能都保留；省下來的時間，從額外裝飾、大幅重構、正式雲端部署和目前不需要的維運平台取得。

這也不代表要求原封不動保留每一行舊程式。保留的重點是功能與使用者能觀察到的行為，既有缺陷仍然要如實記錄。

## 第四道指令：一般決策讓 AI 自己往前走

上一篇已經讓我感受到，反覆確認也會消耗時間。這次在核准 Intent Capture 之後，我直接要求更高的自主程度。

以下同樣是原始指令節錄：

```text
From this point forward, run the AI-DLC workflow
in maximum autonomous / YOLO mode.

Treat my default decision as
"Looks correct / Approve / Continue" for routine checkpoints.

Do not pause merely to present options when you can safely
choose the simplest MVP-first option yourself.

Otherwise:
DECIDE → EXECUTE → VALIDATE → CONTINUE.
```

我也保留了必須停下來的情況：框架明確要求且不能自動回答的人工作答、需要憑證、不可逆或破壞性操作，以及核心產品方向真的不清楚。

這裡的 YOLO，是我希望 AI 減少例行詢問、選擇最簡單可行方案的說法。**它不等於框架的所有核准機制都會消失。**

實際對話裡，我仍然回了很多次 `1`，後來也用了 `Looks correct`、`Nothing to add` 和 `Approve`。

有些關卡需要能被正式記錄的人工作答，數字回答也曾沒有被辨識成有效確認。重新確認摘要，再使用明確的回答，流程才繼續。

所以這次沒有做到「下一段 prompt，後面完全不用管」。自主指令讓 AI 知道一般決策怎麼選；框架要求的人工作答，仍然是另一件事。

這和上一篇的體會很接近：對話裡說了同意，還要確認工作紀錄真的接受了。

## 第五道指令：恢復流程，保留已經做好的 MVP

當已經有實作，流程與審查狀態卻需要恢復時，我特別不希望它重新開始寫。

我給了這段指令，以下為原始節錄：

```text
Restart stage.

Preserve all existing MVP implementation and accepted answers.

Do NOT redesign or rebuild working functionality unless
strictly required to recover the workflow state.

This is a workflow/review-state recovery only.

After recovery:
- validate the existing MVP using the minimum required
  critical-path checks,
- obtain the required valid review verdict,
- continue immediately to the next stage.

Do not restart implementation from scratch.
```

我也再次要求，不要藉這次恢復去改善架構、重構、增加選配功能或擴大測試覆蓋。

因為「重啟階段」很容易被理解成「這個階段的東西全部重做」。但當時需要處理的是流程和審查紀錄，已經可以操作的 MVP 應該留下來。

最後這輪恢復沒有修改應用程式，而是重新檢查既有成果、取得有效審查結果，再完成測試與本機交付紀錄。

恢復時，有四個設計階段在主流程裡被標成 skipped，原先的文件、答案和審查都還在。對我來說，重要的是能接著已有的成果往下走，也留下這次怎麼恢復的紀錄。

**這段指令對接手既有專案很有用：先講清楚，這次要恢復的是什麼，又有哪些成果已經不需要重做。**

## 和上一篇放在一起看，差別在哪裡？

上一篇的午餐 Bot，也有我過去做咖啡 Bot 的經驗作為基礎。這次更進一步：我直接把原有 Zona Crystal 的程式與功能版本交給 AI，讓它從這些成果開始整理。

| 比較項目 | 上一篇：LINE 午餐 Bot                 | 這一篇：Zona Crystal                          |
| -------- | ------------------------------------- | --------------------------------------------- |
| 開發起點 | 從新的午餐推薦需求展開                | 讀既有 Bot 與多個功能版本，重新整理 spec      |
| 範圍取捨 | 新增的一年歷史保存後來延後            | 既有記憶等功能明確要求保留                    |
| 時間規則 | 卡住之後補上 MVP 優先與約十五分鐘上限 | 一開始就指定一天目標與十分鐘停損              |
| 自主程度 | 後來逐步說明可直接處理的範圍          | 早期就給自主推進指令，但仍有人工作答關卡      |
| 展示證據 | 有一次真實 LINE 餐廳推薦成功紀錄      | 本機教學 MVP 已驗證，外部 LINE 與模型尚未實測 |

上次我比較常問：「這個需求要不要先放到下一版？」

這次我需要多問一件事：「它是新需求，還是原本就有、這次應該留下的功能？」

這個差別會影響 AI 怎麼縮小範圍。對已有使用情境的專案，縮減工作不能只看哪條路最短，也要看哪些行為是原本產品的一部分。

## 現在的 Zona Crystal，可以怎麼拿來分享？

回到我一開始的目的：這個版本，要能拿來展示、教學與分享。

最直觀的成果，是現在可以在電腦上啟動 Zona Crystal，打開教學頁，從生日開始走完一段互動。輸入 `2000-01-01`，看到生命靈數和三張水晶卡，選一張看介紹，再點下面的問題繼續聊。這樣就有了一條可以跟著操作、也方便說明的展示路線。

接著，可以把話題帶回我之前做過的功能：怎麼用 Quick Reply 接下一個問題？切換角色後，名稱和頭像怎麼呈現？怎麼進出 Echo 模式、切換兩組選單，或打開原本的指南？這些功能都整理進同一個版本，分享時有一個共同的入口。

記憶功能也有留下來。本機提供 A、B 兩個示範身分，可以用來說明不同使用者的內容如何分開保存。既有檢查也確認了：服務重新啟動後，仍然能讀到保存的記憶。這正是我說「原有功能都要留著」時，在意的事情。

為了讓別人容易開始，本機教學模式不需要先準備金鑰。文字回覆、圖片辨識範例與 LINE 操作模擬，都會在畫面上標示清楚。**拿它教互動流程很方便；要看真實模型怎麼回答，或手機上的 LINE 怎麼呈現，還需要另外串接和實測。** 水晶與星座內容也維持教學情境。

這次既有的 64 個測試全部通過，格式與 lint 檢查也通過。除了生日和卡片，檢查還涵蓋了記憶、使用者隔離、重啟與並行請求。這些結果讓本機展示有了驗證依據。

不過，收尾時仍然有沒解完的問題。例如 LINE 一次送來多個事件，前一個處理太久，後面的事件可能卡在失敗狀態，即使平台重送也無法恢復。這個缺陷仍在；真實 LINE、Gemini／Vertex 和 Firestore 的外部實測，以及部分畫面、鍵盤操作與回退檢查，也還沒完成。

我選擇先接受測試階段留下的未達標項目，完成這次本機 MVP 的交付。審查雖然得到 `READY`，仍然保留一項未解決的 Major。完整結果放在交接文件裡，後續可以接著處理。

所以，現在可以拿來分享的，是**一個保留原有功能、能在本機操作的教學版本**。要走到正式上線，還有下一段工作。

AI-DLC 最後也完成了流程收尾。不需要為這次展示新建的雲端與維運工作，則依條件略過。程式、spec、示範步驟和交付紀錄都放到了 GitHub，讓有興趣的人可以自己跑起來，也看得到這次做到哪裡。

## 如果你也要拿既有專案跑 AIDD，可以先講這些

下面是根據這次經驗整理的中文提示範本，**不是原始對話全文**：

```text
這是一個既有專案，請先讀取現有程式、文件與各功能版本。
列出已存在的功能、可沿用的素材，以及目前的限制，
再重新整理 spec。不要預設從零重建。

目標是展示、教學與分享，一個工作天內完成可操作的 MVP。
原有功能全部保留並整合；新增功能、大幅重構、裝飾，
以及正式營運架構優先延後。

先定義一條完整展示旅程，再為其他既有功能列出驗證路徑。
若採教學範例或模擬，請在結果旁明確標示。
本機通過不能當成真實 LINE 或外部模型已驗證。

一般可逆決策採最簡單可行方案，自主執行、驗證並繼續。
需要憑證、不可逆操作、核心方向不清楚，
或框架明確要求人工作答時再停下來。

非核心技術調查最多十分鐘；無法解決就記錄並採替代方案。
如果簡化會刪掉必要的既有功能，請明確回報衝突。

如果只是流程或審查狀態需要恢復，保留已接受的答案、
既有實作、資料與失敗紀錄，只做必要驗證，不從頭重寫。

交付時分開列出：已實作、已測試、模擬、未驗證、已知缺陷。
不要把 workflow 完成當成正式上線就緒。
```

這次我更能感受到，給 AI 的指令除了描述「我想要什麼」，也需要交代「我已經有什麼」。

上一篇，午餐 Bot 幫我看見：AI 可以把一個想法往前推，但人要決定終點。

這次，Zona Crystal 讓我多學到一件事：**接手既有專案時，人還要說清楚哪些成果要被帶到終點。**

這次仍然需要我在幾個地方介入：補充功能範圍、確認必要關卡，以及決定哪些問題先留待後續。最後留下來的，是一個可以接著展示的版本，連同原本累積的功能、做過的決策和還沒解完的問題。

下次拿出 Zona Crystal 教學時，除了展示卡片與追問，我也可以分享：這些功能原本在哪裡、這次怎麼整理，以及為什麼有些地方先做到這裡。

---

### 專案與延伸閱讀

本文整理於 2026-10-10，依據本次對話、規格、審查與交付紀錄撰寫。

- [上一篇：我用 AIDD 做了一個 LINE 午餐 Bot，才發現 AI 開發最難的不是寫程式](https://medium.com/p/d5973d6f4d41)
- [Zona Crystal 專案程式與 README](https://github.com/zonawang/aidd-line-bot-crystal)
- [這次的全功能範圍：保留什麼、如何驗收](https://github.com/zonawang/aidd-line-bot-crystal/blob/main/aidlc/spaces/default/intents/261010-zona-crystal-mvp/ideation/scope-definition/scope-document.md)
- [新版需求規格](https://github.com/zonawang/aidd-line-bot-crystal/blob/main/aidlc/spaces/default/intents/261010-zona-crystal-mvp/inception/requirements-analysis/requirements.md)
- [無金鑰教學與 Demo 清單](https://github.com/zonawang/aidd-line-bot-crystal/blob/main/docs/zona-crystal-demo.md)
- [MVP 交接：驗證結果、限制與後續工作](https://github.com/zonawang/aidd-line-bot-crystal/blob/main/aidlc/spaces/default/intents/261010-zona-crystal-mvp/mvp-handoff.md)

已有 Node.js 24 與 npm 環境時，可依 README 執行：

```sh
npm ci --no-fund --no-audit
npm start
```

再開啟 `http://127.0.0.1:8080`，操作不需金鑰的本機教學模式。真實 LINE 與外部服務仍須另外配置與驗證。
