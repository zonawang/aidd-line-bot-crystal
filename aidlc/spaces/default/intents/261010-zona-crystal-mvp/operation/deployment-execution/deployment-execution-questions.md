# Deployment Execution — 本機展示確認

## Sources

- README.md：npm start／loopback8080、保留資料及同版本重啟。
- construction/u1-zona-crystal-bot/infrastructure-design/infrastructure-specification.md：INF-01–INF-06；既有本機，無雲端資源。
- construction/build-and-test/test-results.md：64/64、lint／format，使用者選1接受限制繼續。
- 最新使用者指示：recovery-only、保留全部MVP與既有答案；routine default Approve／Continue。

## Questions

以下沿用既定本機選項，不新增產品決策；答案為授權預設及既有事實，不能解讀為外部驗證完成。

### Q1 — 前置檢查
A. 既有64/64通過；R-01／未驗證與追溯缺口已接受帶限制繼續，只做本機交付
B. 先返回修復
X. Other (please specify)
[Answer]: A

### Q2 — 資料遷移
A. 不需遷移、不重設；保留既有私有JSON與legacy Firestore唯讀界線
B. 新增遷移（超出本次授權）
X. Other (please specify)
[Answer]: A

### Q3 — 依賴與環境
A. 沿用Node24與現有安裝；demo/example/local，不需金鑰，外部未驗
B. 改為真實外部部署（需憑證）
X. Other (please specify)
[Answer]: A

### Q4 — 展示窗口
A. 現在確認既有8080程序及最小smoke，不為重部署中斷工作中的服務
B. 停止並重新部署
X. Other (please specify)
[Answer]: A

## Consolidated Summary Confirmation

確認現有http://127.0.0.1:8080健康及birthday→三卡→選卡主旅程；使用既有測試的獨立tmp子程序證據驗restart／A-B，不修改程式、現有私有資料、live menu、外部服務。輸出本機deployment log、smoke與health紀錄；已接受的R-01、完整尺寸／鍵盤、直接parent追溯與外部未驗保持原狀。工作中的8080只做GET健康／頁面檢查，主旅程重用本輪已有實際HTTP測試證據。

Looks correct / Request changes
[Answer]: Looks correct
