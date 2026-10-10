# Zona Crystal — 精簡團隊評估

## Sources

- [scope-document.md](../scope-definition/scope-document.md)：CAP1–CAP10 的全功能範圍。
- [intent-backlog.md](../scope-definition/intent-backlog.md)：IB1–IB7 的優先順序與依賴。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)：本機工具可用，外部驗證仍有依賴；範圍取代關係以最新版 scope-document 為準。
- [team-formation-questions.md](team-formation-questions.md)：使用者已確認 Codex 主責、必要角色協作、不新增人員的分工。

## Availability Assessment

本次由使用者與 Codex 共同完成。Codex 主責規劃、整合、文件及驗證；使用者是產品範圍決策者，參與不能代答的必要關卡，並在需要時提供外部服務存取設定。

沒有其他真人成員、投入時數、利用率或外包可用性資料，因此不編造人力承諾，也不把使用者安排為日常開發或測試人員。

## Required Capacity

以一個產品工作群組處理全功能整合，先完成主展示旅程，再補齊其他既有功能並逐項驗證。只有流程明定的委派或審查才使用相應專業角色；不新增招募、例會或跨團隊管理工作。

## Gaps & Remediation

| 缺口 | 性質 | 處理 |
|---|---|---|
| 新版尚未實作／驗證 | 交付工作 | Codex 沿用既有實作與資產，完成全部功能及關鍵測試 |
| LINE、模型、記憶服務存取未驗證 | 外部依賴 | 先完成本機教學與測試，保留真實串接，依安全設定補實機證據 |
| 沒有真人技能與時數資料 | 證據限制 | 不作熟練度評級或人日估算；本次不依賴新增人員 |

憑證不是招募需求；秘密不寫入文件或聊天。技術問題最多調查十分鐘，採保留功能的簡單替代方案。不得以缺少外部證據宣稱真實服務已通過，也不得自行刪除已核准功能。

## Capacity Allocation Agreement

使用者已確認將可用時間優先投入全功能實作與關鍵驗證。文件保持最低必要深度，重構、裝飾及正式部署延後；一天時限不變。若沿用與簡化仍無法完成，回報具體功能與時限衝突，不延長排程或冒稱完成。

## Assumptions & Open Questions

None.
