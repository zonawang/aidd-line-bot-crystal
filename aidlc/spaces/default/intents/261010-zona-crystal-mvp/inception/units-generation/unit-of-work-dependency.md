# Zona Crystal — 工作單位依賴拓撲

## Sources

- [unit-of-work.md](unit-of-work.md)：U1的service身分與四元件邊界。
- [components.md](../domain-design/components.md)、[decisions.md](../domain-design/decisions.md)：無循環元件呼叫與唯一記憶擁有權。
- [units-generation-questions.md](units-generation-questions.md)：已確認單一應用、單節點DAG。

## Dependency DAG

```yaml
units:
  - name: u1-zona-crystal-bot
    kind: service
    depends_on: []
```

文字圖替代：`U1 (u1-zona-crystal-bot)`，唯一節點、零條邊，沒有其他前置Unit或循環。所有故事整合參照都發生在U1內，不轉成跨Unit依賴。

U1本身具備入口、內容規則、諮詢、記憶與呈現，可獨立啟動並完成端到端旅程；它不需等其他Unit才有可展示結果。這項可執行邊界不宣告任何功能已完成。若後續政策啟用walking-skeleton，唯一Unit就是首個解析節點；是否啟用及人工檢查仍依適用政策，不猜測缺省欄位。

## Integration Points & Contracts

沒有跨Unit API、事件或共享可變資料。四元件的內部交接維持已核准責任圖：

| Caller | Callee | Interaction | Ownership constraint |
|---|---|---|---|
| BotExperience | CrystalKnowledge | 同步日期／生命靈數與內容規則 | 不直接寫記憶 |
| BotExperience | Consultation | 非同步文字／圖片諮詢及三追問 | 僅接收目前身分必要上下文 |
| BotExperience | ConversationMemory | 非同步先讀後寫及結果交接 | 唯一持久資料擁有者 |

外部LINE事件／回覆／圖片／選單／等待、模型及持久服務交接在Contract Design定義；具體資料schema與實作策略留適用Construction設計。外部依賴不是DAG中的Unit，也不能以本機替身通過冒稱外部成功。

## Parallel Development Opportunities

只有一個Unit，沒有兩個互相獨立Unit可供跨Unit並行，也沒有多種不同Unit排列。內部規則、適配器與視圖可按責任測試；本次不增加並行開發或獨立部署。

## Topology Scope

此文件只給出依賴拓撲，不推薦跨Unit實作順序、不指定關鍵路徑。Unit內故事次序見[story map](unit-of-work-story-map.md)，Bolt與展示驗證由Delivery Planning定義。

## Assumptions & Open Questions

None. 單節點完整交付與一天限制沿用已確認方案；原功能不因分組而延期。
