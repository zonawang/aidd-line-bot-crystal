# Zona Crystal 公開教學網站部署

## 部署結果

2026-10-11 操作者回覆「同意部署」後，已完成容器建置、獨立雲端資源設定與公開 HTTPS 部署。

- 網址：https://zona-crystal-demo-3sv3zqjszq-de.a.run.app/
- 平台：Google Cloud Run，專案 `line-zona`、區域 `asia-east1`。
- 生效版本：`zona-crystal-demo-00001-jpv`，100% 流量，Ready=True。
- 公開權限：僅此新服務新增 `allUsers` 的 `roles/run.invoker`，免登入體驗。
- Cloud Build：`b7b614d1-9160-44d9-b859-1bbbd49d3f82`，Docker 建置與部署成功。
- 新建 Firestore：`zona-crystal-demo`，Native／Standard，`freeTier=false`；採實際用量計費。

新增獨立服務 `zona-crystal-demo`。已比對部署前後的私有唯讀快照：原有 18 個 Cloud Run 服務的名稱、generation、Ready revision、網址與流量設定全部相同，唯一新增服務為 `zona-crystal-demo`。沒有變更 LINE Developers 的 webhook／Rich Menu。

規格：1 CPU、512 MiB、最低 0／最高 1 個實例、concurrency 20、request timeout 40 秒。採請求計費，閒置可縮至零。上限不是費用硬上限；建置、映像儲存、流量、Cloud Run 與 Firestore 均可能計費，公開使用量增加時費用也會增加。不宣稱免費。

網站公開免登入，模型維持 `BOT_MODE=example`。不注入 LINE token、Gemini key 或其他服務的秘密；公開模式拒絕 `BOT_MODE=real` 並關閉 `/webhook`。生日三卡、追問、角色、圖片範例、指南、選單、Echo 與回憶沿用現有 UI 與邏輯。

公開模式使用 Secure／HttpOnly／SameSite Cookie（30 天），為每個瀏覽器建立隨機示範身分；其 A／B 記憶與其他瀏覽器分開。換裝置、Cookie 過期或清除網站資料，會建立新的記憶身分。Cookie 是匿名示範的存取憑證，不是正式登入系統。請使用範例資料；現階段沒有自動資料到期刪除功能。

持久記憶使用新建的獨立 Firestore Native 資料庫 `zona-crystal-demo`，collection `zona_crystal_public_demo`。不使用既有 `(default)` 資料庫，不複製本機 `.zona-data`，不讀寫其他 Bot 的記憶。新的命名資料庫須按讀寫與儲存用量計費，不能假設適用既有免費額度。

建立專用服務帳號 `zona-crystal-demo@line-zona.iam.gserviceaccount.com`，僅新增附資料庫條件的 `roles/datastore.user`，不修改或移除其他角色與成員。瀏覽器不直接連線 Firestore。

## 操作者確認後：一次性資源設定

以下指令只有取得雲端費用、正式部署與公開存取的明確同意後才執行。若資源已存在，先核對其用途，不覆寫其他服務。

```sh
gcloud iam service-accounts create zona-crystal-demo \
  --project=line-zona --display-name='Zona Crystal public demo'

gcloud firestore databases create \
  --project=line-zona --database=zona-crystal-demo \
  --location=asia-east1 --type=firestore-native

gcloud projects add-iam-policy-binding line-zona \
  --member='serviceAccount:zona-crystal-demo@line-zona.iam.gserviceaccount.com' \
  --role='roles/datastore.user' \
  --condition='expression=resource.name=="projects/line-zona/databases/zona-crystal-demo",title=zona-crystal-demo-only,description=Access only the public demo database'
```

IAM 的資料庫條件依 [Firestore 官方說明](https://docs.cloud.google.com/firestore/native/docs/manage-databases#configure_database_access_conditions) 設定。這個角色不能存取其他資料庫；部署後也核對實際授權。

## 部署與後續更新

```sh
npm run check:u1
bash scripts/deploy-cloud-run.sh
```

部署腳本只將 `src/`、`public/`、package manifest、lockfile 與 Docker 設定複製到暫存上傳目錄。`.env`、API Key、service-account JSON、本機記憶、`.git`、`.aidlc` 與工作流程紀錄都不在部署來源中。Docker 以 Node.js 24、非 root 使用者運行，不安裝開發依賴。

`PUBLIC_DEMO_ORIGIN` 必須與公開 HTTPS 網址完全相符，目前腳本預設值已與 Cloud Run 的 `status.url` 核對一致。若日後更換服務網址，設定實際 origin 後重新執行腳本：

```sh
PUBLIC_DEMO_ORIGIN=https://實際服務網址 bash scripts/deploy-cloud-run.sh
node scripts/cloud-run-smoke.mjs https://實際服務網址
```

腳本明確指定新服務名稱、專案與區域，不改 gcloud 的全域預設，不改 LINE Developers 的 webhook／Rich Menu，不部署其他 Bot。

正常更新只需要修改程式、通過檢查後重跑同一腳本。Cloud Run 產生新 revision，HTTPS 網址與 Firestore 資料保留；不要重建資料庫。最高 1 個實例是 MVP 配置，更新交接期間仍可能有短暫的新舊 revision 重疊，尚無跨實例交易鎖保證；公開活動期間避免更新。

## 環境變數

| Name                    | Value                      |
| ----------------------- | -------------------------- |
| `HOST`                  | `0.0.0.0`                  |
| `PORT`                  | Cloud Run 設定為 `8080`    |
| `APP_MODE`              | `public-demo`              |
| `BOT_MODE`              | `example`                  |
| `MEMORY_ADAPTER`        | `firestore`                |
| `GCP_PROJECT`           | `line-zona`                |
| `FIRESTORE_DATABASE_ID` | `zona-crystal-demo`        |
| `FIRESTORE_COLLECTION`  | `zona_crystal_public_demo` |
| `PUBLIC_DEMO_ORIGIN`    | 實際 HTTPS origin          |

Firestore 以 Cloud Run 的服務帳號與 ADC 存取，不生成或上傳私鑰。`APP_MODE=demo` 與 `APP_MODE=line` 的既有預設及本機資料均保留。

## 驗證狀態

- 部署前：67／67 測試通過，格式與 lint 通過。新增三個公開模式檢查涵蓋完整生日／選卡路徑、每個瀏覽器 A／B 隔離、重新啟動讀取、同源限制、關閉 webhook 與隔離 Firestore collection。
- 上傳檔案清單已核對，只有公開應用程式與容器建置必要檔案。
- 公開 HTTPS：`node scripts/cloud-run-smoke.mjs https://zona-crystal-demo-3sv3zqjszq-de.a.run.app` 的 33 項檢查通過，包含 HTML／JS／CSS／素材、生日三卡與選卡、追問、角色、圖片範例、Echo、雙選單、指南、回憶、真 Firestore 保存、新請求讀回、第二個瀏覽器與 A／B 隔離、跨 Origin 拒絕、私有路徑 404 與 webhook 關閉。只使用合成教學資料，未呼叫真 AI 或 LINE。
- 原生 Chrome：公開頁面與控制已載入，生日 `2000-01-01` 顯示生命靈數 4、三張不同卡與「已保存」；點選紫水晶後顯示介紹及三個追問，點擊追問後顯示教學範例回覆並再次保存。此為桌面主流程檢查，不宣稱完整手機或所有尺寸視覺驗收。
- Cloud Run 容器建置與部署成功；新服務環境只有教學模式與資料庫設定，沒有注入 API key／LINE token／private key。
- 其他服務：18／18 的版本、網址與流量設定未變更。專用服務帳號僅有新資料庫的條件式 `datastore.user` 授權，已核對實際 IAM policy。
- UI 的排版與互動控制保留；只將「本機教學入口」改為「教學展示入口」，並加入公開示範資料說明。
- 既有 LINE batch 逾時／重送缺陷不在本次修復範圍；公開網站不提供 LINE webhook，該缺陷不進入公開展示路徑。
- 非阻擋項目：既有教學追問模板以完整輸入產生下一題，多輪追問可能有重複詞句。本次保留原功能，文案改善留待後續。

價格參考：[Cloud Run](https://cloud.google.com/run/pricing)、[Firestore](https://cloud.google.com/firestore/pricing)、[Cloud Build](https://cloud.google.com/build/pricing)。
