# Build Instructions

## Sources

- ../u1-zona-crystal-bot/code-generation/code-generation-plan.md
- ../u1-zona-crystal-bot/code-generation/unit-test-instructions.md
- ../u1-zona-crystal-bot/code-generation/code-summary.md
- 全部六份 nfr-requirements 與六份 nfr-design 產出；Testing Contract。

## Prerequisites & Environment

Node 24、既有lock與node_modules；預設APP_MODE=demo、BOT_MODE=example、loopback8080，不需金鑰。私有.zona-data不可放public。乾淨環境用npm ci，已安裝環境本次不重裝。

## Build & Verification

JavaScript原生執行，無compile／bundle步驟。必要檢查：

```bash
node scripts/u1-zona-crystal-bot/check.mjs
```

這同時執行Prettier、ESLint、九檔tests及實際HTTP／restart。既有8080示範服務不重啟；測試啟用獨立子程序與臨時資料。

## Troubleshooting

npm cache權限問題採任務專用/tmp cache；8080忙碌先確認既有展示程序。缺外部設定保留demo，不偽造real成功。不得重設記憶或執行舊rich menu setup。
