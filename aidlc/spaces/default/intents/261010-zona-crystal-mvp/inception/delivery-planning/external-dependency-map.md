# Zona Crystal — 外部依賴與交付界線

## Sources

- [bolt-plan.md](bolt-plan.md)：B1全部原功能及本機交付。
- [contract-summary.md](../contract-design/contract-summary.md)：五契約、既有供應商路徑、模式／資料／deadline。
- [team-assessment.md](../../ideation/team-formation/team-assessment.md)、[team-practices.md](../practices-discovery/team-practices.md)：沒有已指定外部存取權者，不新增人員或正式部署。

## Dependency Map

Bolt是一次交付可運作成果的建置批次，本次只有B1。下列未證實的等待時間不編造天數；每項技術調查最多十分鐘，不把外部等待變成一天排程延期。

| Dependency | Owner | Lead time / current status | Consuming Bolt | Blocks | Workaround / if delayed |
|---|---|---|---|---|---|
| LINE channel secret／access token與可達webhook | 服務存取權者待指定；Codex驗證 | 未提供／未驗證，時間未知 | B1 | 真實LINE事件與回覆／手機證據 | 本機完整操作＋簽章／SDK替身；保留真實webhook與動作，列未驗證 |
| Gemini API key或Vertex AI安全存取 | 服務存取權者待指定；Codex驗證 | 未驗證，時間未知 | B1 | 真實文字／圖片模型品質 | 明示固定教學範例；測實際輸入傳遞與失敗路徑，不冒稱供應商成功 |
| Firestore權限、舊crystal_memories資料映射 | 服務存取權者待指定；ConversationMemory適配 | 未驗證，時間未知 | B1 | 真實持久服務實測／舊資料相容證據 | 實際本機持久儲存與重啟驗證、Firestore替身；保留原查詢／資料路徑，不遷移或刪舊資料 |
| 外部水晶／COSMOS圖片URL | 來源供應者；Codex保留可用文字入口 | URL已盤點，運作未驗證 | B1 | 圖片視覺品質 | 原素材優先、載入失敗文字／動作仍可用，不為裝飾延長調查 |
| npm套件取得與可寫cache | Codex／本機環境 | Node／npm可用，依賴安裝尚待實作 | B1 | 應用啟動或供應商適配 | 最少套件、task tmp cache，十分鐘改簡單替代並記限制 |
| 技能明文人工作答與真實驗證命令授權 | 使用者 | 隨流程；命令選擇已明確延後 | B1 | 保護checkpoint與完成驗證 | 不代答，不用placeholder；實際腳本建立後提完整命令，其他routine預設自治 |

## Delivery Evidence Policy

本機成果可在不取得LINE／模型／Firestore憑證下交付，但真實服務路徑不可刪除。逐項區分已實作、本機已測、固定教學範例／模擬、替身呼叫測試、外部已測與待驗證；不知道就不填成功。

公開連線時停用本機A／B API且保護素材／設定／記憶，不能把本機綁loopback就當任何tunnel情境皆安全。秘密僅由安全環境提供，不出現在文件、版本、聊天或日誌；沒有必要即不要求本次先提供。

## Assumptions & Open Questions

None. 外部存取的Owner與等待時間尚未知，但已確認不阻擋明示本機展示；不假設已取得權限或真實實測通過。
