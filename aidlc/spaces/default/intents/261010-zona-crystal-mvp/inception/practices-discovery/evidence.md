# Zona Crystal — 慣例探索證據

## Sources

| 來源 | 本次讀取／觀察 | 可支持的結論 |
|---|---|---|
| [aidlc-state.md](../../aidlc-state.md) | Greenfield、自訂 zona-crystal-one-day、Minimal 深度／測試、practices-discovery Running | 以 Greenfield 初稿處理；不是從舊 repo 推定團隊慣例 |
| [org.md](../../../../memory/org.md) 五項章節 | 主線／squash、scope-dependent skeleton、test-after、staging／正式人工部署、設定優先程式風格 | 是訪談建議來源及適用規則，不是團隊已確認現況 |
| [team.md](../../../../memory/team.md)、[project.md](../../../../memory/project.md) | 匹配章節皆只有模板註解 | 沒有既有已確認慣例；不採用註解範例作事實 |
| [inception.md](../../../../memory/phases/inception.md) | 可驗證需求、取捨、故事驗收與追溯規則 | 後續需求可追溯；BDD 驗收格式不等於已選 BDD 實作方法 |
| [scope 檔](../../../../../../../.codex/scopes/aidlc-zona-crystal-one-day.md) | Minimal 深度／測試，未明列 skeleton 欄位；較早文字仍把圖片與記憶列延後 | 深度／測試採引擎設定；功能採最新人工核准範圍，不沿用過時刪減 |
| [scope-document.md](../../ideation/scope-definition/scope-document.md) | CAP1–CAP10、一天、十分鐘停損及舊範圍取代 | 全功能同一新版、真實串接保留、本機模擬明示 |
| [initiative-brief.md](../../ideation/approval-handoff/initiative-brief.md) | 已核准交接；A／B 身分、四角色示例待補入需求 | 不新增管理頁；後續納入可重現驗證 |
| [team-assessment.md](../../ideation/team-formation/team-assessment.md) | Codex 主責、使用者必要決策、只做流程要求協作 | 不虛構人力、時數、例會或成熟 CI 能力 |
| 唯讀 git 檢查 | git branch --show-current 回傳 main；git rev-parse --verify HEAD 回傳 Needed a single revision | 尚無可用基準提交；不是已完成合併或 CI 證據 |
| [本階段訪談](practices-discovery-questions.md) | [Answer]: A；另一次摘要 [Answer]: Looks correct | 使用者採用五項整組建議，允許產出整合文件；不是公開部署授權 |

## Lead Inspection & Inference

Pipeline & Deploy lead 已讀 persona、全部共享及本角色知識、active-space 規則和列出的上游文件；space-level shared／本角色知識目錄不存在。未讀寫 memory.md，未重新掃描 legacy repo，未打印 remote 或秘密，未執行生命周期命令或 git 寫入。

初稿以 org 五項預設提出 main／squash、薄端到端、test-after、本機交付及既有風格優先。三位協作者獨立盲審後，使用者透過本階段訪談 A 採用五項，另以 Looks correct 確認產出摘要；本次 lead 整合所有貢獻。這是新選定慣例，不是已存在工具／習慣的證據。一般知識的 80% 範例、雲端多環境及掃描平台未自動成為此自訂範圍承諾，所有適用 org 底線仍保留。

state 描述與 scope 檔中的舊功能延後訊號，依最新 scope-document／initiative-brief 的人工範圍修正取代；不直接修改上游歷史文件。是否啟用正式 skeleton 儀式交由引擎，不從 scope 缺省猜測。

## Independent Contributions

| 參與者 | 目前證據 |
|---|---|
| aidlc-pipeline-deploy-agent | 讀取初稿、三份貢獻及已完成訪談；只整合四個宣告輸出 |
| [aidlc-quality-agent](contributions/aidlc-quality-agent.md) | 獨立讀初稿、state、規則及上游；OBJECT 要求逐需求／元件正常路徑底線、實際本機持久記憶重啟、A／B 步驟及四角色示例。已納入 Testing Posture，Resolved |
| [aidlc-developer-agent](contributions/aidlc-developer-agent.md) | 獨立讀初稿、規則及上游；AGREE，建議共用功能邏輯、可辨認串接／記憶、日曆驗證、錯誤恢復及公開素材邊界。已納入 Code Style，沒有未解異議 |
| [aidlc-devsecops-agent](contributions/aidlc-devsecops-agent.md) | 獨立讀初稿、規則及上游；OBJECT 要求驗簽、素材範圍、秘密處理及教學身分界線。已納入 Testing Posture／Code Style；鎖定檔與簡單套件檢查採最小做法，Resolved |

## Interview Decisions

使用者回覆「1」選擇 A「採用五項建議」，以一次整組選擇確認五列；之後另回覆「1」對應摘要 Looks correct。採用 main 短分支／squash、薄端到端先行、明確 test-after 順序與 Minimal 底線、本機交付／保留記憶的復原、既有風格與少量必要安全驗證。三份貢獻納入訪談提案後才整合，未代答或改寫問題檔。

兩項 OBJECT 的最低補充均已整合，沒有未解工作慣例分歧。安全及開發補充為本次選定團隊做法，沒有追加到 discovered-rules 的先前人工硬性約束。全功能／一天與十分鐘停損沿用已核准上游，不重開產品方向。

## Uncertainty & Follow-up

- 五項慣例已訪談選定、摘要已確認；仍待階段核准及工具推送，尚未改動 active-space memory。
- Construction worktree 需要 main 基準提交；尚無 HEAD。此處只記錄依賴，不越權建立提交。
- 自訂 scope 未明列 skeleton，正式儀式遵循引擎解析；薄切片優先是建議，不是已完成驗證。
- 應用程式尚未實作，測試命令、formatter／linter 設定、CI 執行與復原步驟均沒有通過證據。
- 外部憑證、LINE 手機與公開連線待實測；先做本機功能及明示模擬，不宣告外部成功。
- 時間戳的 commit UNBORN 明確表示此 repo 尚無 HEAD，並非 Git hash。未為此捏造提交或執行 commit；後續 Construction 基準建立屬落地工作。

## Assumptions & Open Questions

None. 沒有臆測團隊成熟度、實際部署頻率或覆蓋率；待落地與未驗證項目保持明示，不當作慣例分歧或已完成產品證據。
