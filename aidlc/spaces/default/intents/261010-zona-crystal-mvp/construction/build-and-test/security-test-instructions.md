# Security Test Instructions

## Sources

- ../u1-zona-crystal-bot/code-generation/code-generation-plan.md
- ../u1-zona-crystal-bot/code-generation/unit-test-instructions.md
- ../u1-zona-crystal-bot/code-generation/code-summary.md
- 全部六份 nfr-requirements 與六份 nfr-design 產出；Testing Contract。

## Minimal Strategy

本次Minimal不產生額外suite；此檔只交代既有檢查責任。沿用unit-test-instructions.md及build-instructions.md，相同命令只執行一次。測試使用虛構身分／臨時目錄與SDK替身，沒有live資料或金鑰。

## Evidence & Limits

既有九檔包含HTTP／restart／A-B隔離、warm10≤2秒、五並行、deadline、簽章／大小／私有檔案／DOM標示。無新coverage百分比；未執行完整手動375／1280／鍵盤或真服務。R-01未涵蓋的重送路徑仍未修復。後續performance-validation可重用本機量測，但尚未測項目不能現在計為通過。
