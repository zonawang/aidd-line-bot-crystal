# Project-Level Rules

> Project-specific specialisation and corrections. Loaded after `org.md` and
> `team.md` as strict-additive guidance; contradictions with broader policy
> are rejected. Populated by practices-discovery and the self-learning loop.
>
> Use sparingly: most teams don't need a project layer. Reach for it
> only when this specific project needs stable, durable guidance beyond the
> team practice (for example, package-specific release checks or an additional
> regression suite for a legacy component).

## Way of Working

<!-- Project-specific specialisation. Example: -->
<!-- This monorepo requires package-scoped branch names and a package owner -->
<!-- review in addition to the team's normal merge policy. -->

## Walking Skeleton

<!-- Project-specific specialisation. Example: -->
<!-- The walking skeleton must exercise the legacy service adapter as well -->
<!-- as the new service boundary. -->

## Testing Posture

<!-- Project-specific specialisation. -->

## Guard Policy

<!-- Project-specific. Mode: strict, relaxed, or off. Strict here holds for every intent and cannot be changed from chat. A section under the retired Change Control heading, written by an earlier release, is still read. -->

## Deployment

<!-- Project-specific specialisation. -->

## Code Style

<!-- Project-specific specialisation. -->

## Tech Stack

<!-- Technology choices locked for this project. -->

## Decided

<!-- Decisions made in earlier stages that should not be re-asked. -->
<!-- Format: DECIDED: [decision] (Stage [slug], [date]) -->

## Scope Overrides

<!-- Custom scope rules for this project. -->

## Forbidden

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: NEVER [behavior] (affirmed [date]) -->
<!-- Example: NEVER throw exceptions across service layer boundaries (affirmed 2026-05-17) -->

- NEVER 自行刪除已核准既有功能、只留下分開舊 Bot，或以主旅程通過取代全功能整合完成。 (affirmed 2026-10-10)

- NEVER 為保留非核心範圍延長一個工作天時限；保留功能與時限仍衝突時回報具體阻礙，不冒稱完成。 (affirmed 2026-10-10)

- NEVER 將本機模擬或缺少外部依賴的結果宣告為真實服務／LINE 手機已驗證。 (affirmed 2026-10-10)

## Mandated

<!-- Populated by practices-discovery affirmation gate. -->
<!-- Format: ALWAYS [behavior] (affirmed [date]) -->
<!-- Example: ALWAYS use Result<T,E> for fallible operations in service layer (affirmed 2026-05-17) -->

- ALWAYS 以可展示、教學與分享的 Zona Crystal 為本次目標，於一個工作天內以最小足夠深度完成全部適用 AI-DLC 階段。 (affirmed 2026-10-10)

- ALWAYS 保留原有功能，將 CAP1–CAP10 整合於同一新版；生日、生命靈數、三卡及選卡介紹是主展示旅程。 (affirmed 2026-10-10)

- ALWAYS 當單項架構、基礎設施、相依套件、環境或設計問題調查達十分鐘，停止調查並採最簡可行替代方案，記錄限制與延後事項後繼續。 (affirmed 2026-10-10)

- ALWAYS 優先完成可運作的端到端 MVP、關鍵路徑測試及可重現展示；若時限受威脅，先簡化裝飾、重構、正式部署與其他非核心工作。 (affirmed 2026-10-10)

- ALWAYS 在流程允許時依已授權的預設方案自治；技能明定不可自動回答的人工作答、缺少憑證、不可逆／破壞性動作或真正不明確的產品方向仍須停下確認。 (affirmed 2026-10-10)

- ALWAYS 清楚標示本機 AI／圖片範例與模擬 LINE 操作，分列本機功能、外部服務與 LINE 手機驗證，交付已知限制與待驗證項目。 (affirmed 2026-10-10)

## Corrections

<!-- Project-specific corrections from human feedback. -->
<!-- Format: NEVER/ALWAYS [behavior] (learned [date]) -->
