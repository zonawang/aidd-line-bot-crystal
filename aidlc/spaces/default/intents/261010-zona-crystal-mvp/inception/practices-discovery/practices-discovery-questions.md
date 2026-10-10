# Zona Crystal — 五項工作慣例訪談

## Sources

- [team-practices.md](team-practices.md)、[discovered-rules.md](discovered-rules.md)、[evidence.md](evidence.md)：尚未確認的初稿。
- [品質貢獻](contributions/aidlc-quality-agent.md)、[開發貢獻](contributions/aidlc-developer-agent.md)、[安全貢獻](contributions/aidlc-devsecops-agent.md)：三份獨立檢查均已取得。
- [org.md](../../../../memory/org.md)：五項建議來源及適用底線；不是已存在的團隊習慣。
- [scope-document.md](../../ideation/scope-definition/scope-document.md)、[initiative-brief.md](../../ideation/approval-handoff/initiative-brief.md)：全功能、一日時限及本機／外部證據邊界。

## Five-Area Interview

為減少重複作答，下列五個領域以一個整組選擇收集決策；選「採用五項建議」即確認五列，選調整則先釐清要改的領域。不假設使用者已採納這些新慣例。

| 領域／問題 | 建議做法 |
|---|---|
| Way of Working：如何管理程式變更？ | main 作主線，短期工作分支，完成驗證後 squash 合併；Codex 主責。實作前建立目前缺少的 Git 基準提交，不新增長期分支。 |
| Walking Skeleton：先做最薄端到端版本嗎？Walking skeleton 是先跑完整條路徑的最小版本，用來確認各部分接得起來。 | 先串起啟動、生日、生命靈數／三卡、選卡介紹，再補齊全部功能。這只是實作順序，不取代 CAP1–CAP10 完成條件；正式檢查儀式依既有流程政策決定。 |
| Testing Posture：採哪種測試順序與最低驗證？ | test-after：各適用可測層先實作，再寫及執行該層測試。Minimal 至少每項可測需求有對應測試、每個可測元件有正常路徑；另驗本機端到端、真實本機持久儲存的重啟／A-B 隔離及四角色示例。保留所有適用底線，不另承諾新的覆蓋率百分比；本機與 CI 共用可重現檢查。 |
| Deployment：在哪裡交付及如何恢復？ | 本機可操作展示優先，不新增採購或正式部署；如有 staging 則遵循合併後部署，正式環境仍需另行核准。復原回到已通過版本並重啟檢查，保留記憶資料；真實 LINE／模型／記憶服務證據另列。 |
| Code Style：沿用什麼風格與最小邊界？ | 沿用既有 JavaScript／Node 與實際格式、lint 設定，缺少時補最小檢查；camelCase，不大幅重構。共用功能邏輯與外部串接可辨認，公開素材與設定／記憶分開。真實 webhook 驗簽、秘密不進版本／回覆／日誌，納入少量關鍵驗證；非核心掃描平台延後。 |

A. 採用五項建議 — 確認上述整組慣例
B. 調整部分慣例 — 指定要修改的領域
X. Other (please specify)

[Answer]: A

使用者回覆：「1」，對應「採用五項建議」；以上五列由同一次整組選擇確認，並非自動代答。

## Support Positions & Integration Plan

品質檢查要求明列逐需求／元件正常路徑最低測試與真實本機持久儲存重啟；安全檢查要求補上 webhook 簽章、素材範圍及秘密處理；開發檢查同意沿用風格並建議清楚的共用邏輯、串接和復原邊界。上述建議已納入整組提案，不當作使用者先前已明示的硬性 ALWAYS／NEVER。

確認後另呈現產出前摘要；摘要核准後，由原主責整合四份文件與三份貢獻。本訪談不授權執行公開部署，也不宣稱任何程式或外部測試已通過。

## Assumptions & Open Questions

None. 上述五項慣例已由本次訪談選定；具體命令、工具與外部依賴在後續實作驗證，不為此延長探索。正式慣例確認仍依後續階段核准紀錄。

## Consolidated Summary Confirmation

將依本次訪談選擇，整合 team-practices.md、discovered-rules.md、evidence.md 與 practices-discovery-timestamp.md，採用：

- main 主線、短期分支、驗證後 squash 合併；實作前補 Git 基準。
- 先建立生日／生命靈數／三卡／選卡的最薄端到端版本，再補齊全部 CAP1–CAP10；正式首版檢查依流程政策。
- test-after、Minimal 逐需求及元件正常路徑測試、本機整合啟動、實際本機持久儲存重啟／A-B 隔離、四角色示例；保留適用底線，本機與 CI 共用檢查。
- 本機交付優先；有 staging 時遵循既有合併部署規則，正式部署另行核准；復原保留記憶資料。
- 沿用 JavaScript／Node 與實際格式／lint 設定，補最小檢查與清楚的共用邏輯／外部串接邊界；驗簽、素材範圍及秘密處理納入關鍵驗證。

三份協作貢獻一併納入；不新增掃描平台、不刪既有功能、不宣告外部測試通過。文件分清使用者已明示的硬性約束與本次選定的工作慣例，未實測項目保留限制。

Does this all look correct before I generate the artifact?

- Looks correct
- Request changes

[Answer]: Looks correct
