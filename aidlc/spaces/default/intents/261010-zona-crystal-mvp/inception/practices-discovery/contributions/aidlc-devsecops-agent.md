**Collaborator:** aidlc-devsecops-agent

## Contribution

獨立盲審已讀四份初稿、aidlc-state.md、org／team／project／inception 規則、最新 scope-document.md 及 initiative-brief.md。應用程式尚未實作，team／project 仍為空模板；以下是建議，並非既有工具或通過證據。未讀其他協作者貢獻、未重新掃描舊 repo、未讀寫觀察日誌。

- 同意設定優先的 JavaScript 風格、最小 formatter／linter 腳本與合併前檢查；沒有設定時才補足，不做全面改寫。尚不能宣稱 lint／format 已通過。
- 建議實作時沿用相依套件鎖定檔，以既有套件管理器檢查已知漏洞並記錄結果；不新增付費掃描工具、SBOM 平台或供應鏈架構。可影響此次入口、秘密或記憶隔離的問題優先處理；套件問題超過十分鐘採較簡單替代並記錄，不用全面升級拖延整合。
- 建議把少數必要安全期待補進後續需求與關鍵測試：真實 webhook 拒絕無效簽章，以已驗證 LINE 來源辨識使用者；靜態入口僅公開素材，不公開設定、秘密及記憶檔；秘密由環境載入，範例只留占位符，日誌不輸出金鑰或完整對話。A／B 展示身分僅用於本機教學，不是公開端的身分驗證。
- CAP3 的持久記憶與重啟／使用者隔離保持必須完成。採虛構展示資料與必要內容保存，不能為安全簡化而移除記憶或圖片功能。圖片／文字入口的大小、格式檢查及本機文字呈現安全處理，留待最小設計落地。
- 非核心 SAST／DAST、自動滲透測試、雲端安全平台及正式營運監控延後；後續若需公開連線，先確認本機教學入口的暴露邊界。這些建議不應寫入 discovered-rules 的人工硬性約束，除非確有人工來源。

## Positions

AGREE: team-practices.md 的 Code Style、Deployment 與 Testing Posture 採設定優先、本機交付、Minimal 關鍵路徑及證據分列；符合 scope-document.md 的一天時限、CAP1–CAP10 與非正式營運範圍。

AGREE: discovered-rules.md 僅收錄有人工來源的 ALWAYS／NEVER，沒有把通用安全知識或代理建議冒稱使用者決策。

OBJECT: team-practices.md 的關鍵驗證清單有 A／B 記憶隔離，但尚未明列真實 webhook 簽章、公開素材邊界與秘密處理的最小期待。建議補一條簡短慣例及後續驗證項目，來源標示為本協作者建議：拒絕無效簽章、設定／記憶檔不可經靜態入口讀取、秘密不進版本與日誌。本機 A／B 選擇器須維持教學用途；這不要求新增登入系統或掃描平台。依據為 CAP1 的真實 LINE 入口、CAP3 的使用者隔離及本角色 security-guide.md 的存取控制／秘密處理原則。
