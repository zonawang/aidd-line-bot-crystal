# Zona Crystal — 一日交付分工

## Sources

- [delivery-planning-questions.md](delivery-planning-questions.md)：單一工作階段、unit-major／serial。
- [team-assessment.md](../../ideation/team-formation/team-assessment.md)、[mob-composition.md](../../ideation/team-formation/mob-composition.md)：已核准一個產品工作群組、Codex主責與必要人工作答。
- [bolt-plan.md](bolt-plan.md)：B1完整交付與U1邊界。

## Allocation

Bolt是一次交付可運作成果的建置批次；mob在此指共同完成一個產品的工作群組，不代表本次已有多名真人。

| Bolt | Unit | Assigned group | Responsible execution | Accountable integration |
|---|---|---|---|---|
| B1 / zona-crystal-full-demo | U1 / u1-zona-crystal-bot | Team Formation已核准的單一產品工作群組 | Codex；Code Generation依流程交aidlc-developer-agent，測試／交付由適用角色執行 | Codex |

沒有第二團隊、跨Unit並行或新增真人容量；因此不建立Program Board（多團隊依賴與交付看板）。不推定外包、人日時數、利用率或另有值班人員。

## Responsibilities

| Work | Owner | Boundary |
|---|---|---|
| 四元件、五契約及最小設計交接 | Codex依stage指定角色 | 按inline／指定委派方式工作，不任意新增代理 |
| 全部原功能與素材整合 | 指定開發角色，Codex主責整合 | 不回復他人變更，程式放應用根目錄，維持唯一記憶擁有權 |
| 逐需求／AC關鍵驗證、安全／375／1280／重啟 | 指定品質角色，Codex | 依test-after及適用底線；保存命令、環境、exit code與證據層級 |
| 本機交付、CI／最小Operation與文件 | Codex依適用交付／營運角色 | 不新增正式雲端或監控平台，不冒稱外部驗證 |
| 明文不可代答的核准及驗證命令 | 使用者 | routine預設沿用既有授權；保留明文必要人工checkpoint |
| 外部安全存取 | 擁有服務存取權者，尚未指定 | 安全配置後由Codex驗證；未提供就列待驗證，不在聊天／文件記秘密 |

## Handoff & Coordination

同一工作階段按unit-major／serial完成U1適用設計與程式，再進關鍵檢查。正式委派只帶必要來源與限制，審查角色獨立判斷；不新增例會、跨團隊管理或平行代理計畫。使用者不被安排為日常程式或測試執行者。

main作共同主線，短期Bolt worktree完成後驗證與squash；基準提交及具體路徑留Construction實際建立。問題十分鐘停損，期限受威脅先簡化非核心工作，不能自行省掉原功能或必要品質底線。

## Assumptions & Open Questions

None. 本分工不代表應用、測試或外部服務已完成。
