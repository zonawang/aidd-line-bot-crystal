# Zona Crystal — 優先工作清單

## Sources

- [intent-statement.md](../intent-capture/intent-statement.md)：產品用途與一天時限。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)、[constraint-register.md](../feasibility/constraint-register.md)：可行性與限制；範圍更新的取代關係見下列範圍文件。
- [scope-definition-questions.md](scope-definition-questions.md)：使用者已確認全部整合到新版。
- [scope-document.md](scope-document.md)：CAP1–CAP10、完成條件與外部驗證邊界。

## Prioritization

採 MoSCoW。CAP1–CAP10 全部為 Must Have，因為使用者明確要求保留全部既有功能。順序表示先建立信心與解開依賴，不代表後面的功能可取消。沒有新增 Should／Could 功能。

## Intent Backlog

| 順序／ID | 項目 | 優先 | 功能對應 | 依賴與最小完成證據 |
|---|---|---|---|---|
| 1／IB1 | 串起主展示旅程 | Must | CAP8、CAP9 | 可輸入／選擇生日、取得生命靈數與三卡、選卡看對應介紹；錯誤日期可修正 |
| 2／IB2 | 保留訊息入口及 Echo 模式 | Must | CAP1 | 可操作文字 Echo；真實 LINE 入口實作保留，本機可驗證事件處理 |
| 3／IB3 | 接入 AI 文字與圖片諮詢 | Must | CAP2 | 依賴訊息入口；文字與圖片的真實模型呼叫實作與測試保留；教學範例明確標示 |
| 4／IB4 | 整合持久記憶與回憶 | Must | CAP3 | 依賴使用者與對話識別；後續回合及重啟後能讀回必要內容，不互相混用使用者記憶 |
| 5／IB5 | 串起角色、追問與載入提示 | Must | CAP4、CAP5、CAP7 | 依賴諮詢流程；等待狀態、四個角色及三個可操作追問有驗證路徑 |
| 6／IB6 | 整合雙選單及既有指南 | Must | CAP6 | 各入口能操作，主選單／五宮格可互相切換；既有指南可閱讀 |
| 7／IB7 | 全功能驗證與教學交付 | Must | CAP1–CAP10 | 前述功能全數完成；關鍵測試通過，啟動與示範可重現，外部未驗證項目明列 |

## Proto-Units & Dependencies

建議以一個完整的使用者旅程整合工作群組涵蓋 IB1–IB7，降低重複服務與交接。這是工作分組建議，不是正式 Unit 或架構決策；後續需求、Units Generation 與 Delivery Planning 會決定正式邊界與順序。

功能依賴：訊息入口 → AI 諮詢 → 記憶延續、角色／追問／動畫。生日與三卡先建立可示範旅程；選單與指南可沿用素材補入。最終驗證依賴所有功能完成，不能只驗主旅程。

## Evidence Checklist

每個 IB 項目後續需追蹤需求、實作與測試證據。外部服務及 LINE 手機驗證另記依賴、結果或未驗證原因；固定範例和本機替代不能冒稱真實 AI 辨識、Firestore 或 LINE 平台通過。

目前狀態：IB1–IB7 均待實作／驗證。只有產品範圍已確認，不記為功能完成。

## Won't Have & Timebox Response

本次不做新增採購、正式雲端部署、營運容量承諾、大幅重構或新增精確天象計算。時程有風險時先削減這些工作、裝飾與額外素材。既有功能本身不移出範圍；每個阻礙十分鐘停損，選擇保留功能的簡單替代方式，並記錄實測限制。

## Assumptions & Open Questions

None.
