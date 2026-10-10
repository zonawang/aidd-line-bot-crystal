# Zona Crystal — 精簡分工與協作

## Sources

- [scope-document.md](../scope-definition/scope-document.md)：全功能整合及一天時限。
- [intent-backlog.md](../scope-definition/intent-backlog.md)：IB1–IB7 工作順序。
- [feasibility-assessment.md](../feasibility/feasibility-assessment.md)：本機優先及外部證據限制；功能邊界以最新版範圍為準。
- [team-formation-questions.md](team-formation-questions.md)：已確認 Codex 主責與最小協作方式。

## Composition

採一個產品工作群組：Codex 主責執行與整合，使用者負責產品範圍決策。這不是宣稱已有多名真人開發團隊。依流程明定使用開發、設計、品質及審查角色，角色產出由主責整合；不另外建立組織、例會或人力調度。

## RACI

R＝實際執行；A＝結果主責；C＝必要時提供意見；I＝接收結果。

| 工作 | R | A | C | I |
|---|---|---|---|---|
| 產品範圍及不可代答的必要決策 | 使用者 | 使用者 | Codex | Codex |
| IB1–IB6 全功能整合 | Codex／指定開發角色 | Codex | 流程要求的設計、架構角色 | 使用者 |
| IB7 測試、證據與教學文件 | Codex／指定品質與交付角色 | Codex | 流程要求的審查角色 | 使用者 |
| 外部存取設定 | 具備該服務存取權者提供安全設定，Codex 完成驗證 | Codex 對驗證結果主責 | 使用者（需要時） | 使用者 |

外部存取權者尚未指定，沒有可用設定就將實機標為未驗證；不假設使用者已提供秘密或有額外值班人員。

## Coordination

按 IB1–IB7 的依賴完成工作，優先沿用既有功能與資產。一般選項採已授權的 MVP-first 決策；必要的技能明文人工作答仍保留。協作交接只帶必要功能清單、上下文、限制與驗證結果，不增加管理流程。

若技術問題超過十分鐘，採保留功能的簡單替代方案並紀錄。不能以刪除已核准的原功能代替簡化；若一天時限與完整功能確實衝突，回報具體項目。

## Onboarding Checklist

- 執行者讀取最新版全功能範圍、工作清單及本階段分工。
- 專業協作者只接收其階段需要的上下文，遵循適用的協作或審查規則。
- 明確區分本機操作、固定教學範例、真實服務測試與手機端結果。
- 確認每項既有功能有關鍵驗證路徑，文件與輸出不包含秘密。

## Assumptions & Open Questions

None.
