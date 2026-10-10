# Zona Crystal — 靜態設計驗證

## Sources

[mockups.md](mockups.md)、[interaction-spec.md](interaction-spec.md)、[design-system-mapping.md](design-system-mapping.md)、[accessibility-checklist.md](accessibility-checklist.md)；本紀錄只驗證設計示意。

## Layout Checks

- mockup-mobile.svg：375 × 2120；mockup-desktop.svg：1280 × 1320。XML 解析成功，矩形與文字基準點沒有超出畫布。
- 使用 @resvg/resvg-js 2.6.2 與本機字型轉為 PNG，逐圖目視確認：標題、三卡、角色、三追問、額外捷徑、輸入與選單沒有可見裁切或重疊。桌面畫布已加高以容納下方選單與限制文案。
- 瀏覽器預覽因登入權杖不可用而未完成；改採靜態轉圖，不調查登入設定。這不是 375／1280 的應用程式操作測試，也不是真實手機測試。
- 四份設計文件與問題紀錄各至少兩個 H2，皆引用五份上游文件；17 個故事全部有畫面落點，52 個 AC 的完整行為以 stories.md 為準，設計表僅引用相關子集。

## Contrast Checks

採 sRGB relative luminance 公式，ratio = (L較亮 + 0.05) / (L較暗 + 0.05)，結果四捨五入至兩位。

| 前景／用途 | 白色 #FFFFFF | canvas #F7F6FA | 設計目標 |
|---|---:|---:|---|
| #242033 主文字 | 15.80:1 | 14.68:1 | ≥4.5:1 |
| #5C566B 次要文字 | 7.00:1 | 6.51:1 | ≥4.5:1 |
| #8F1D35 錯誤文字 | 8.77:1 | 8.15:1 | ≥4.5:1 |
| #756B85 控制邊界 | 5.00:1 | 4.65:1 | ≥3:1 |
| #4B0082 焦點／主要動作 | 12.95:1 | 12.04:1 | ≥3:1 |

白字對 #4B0082 為 12.95:1，達文字設計目標。晶體佔位色不承載必要文字／控制狀態。

## Pending Implementation Checks

所有鍵盤、焦點、長文字換行、200% 縮放、真實素材、錯誤復原及完整功能操作仍待實作後測試。指定色對通過不能當作 WCAG 認證。外部 AI／LINE 手機仍未驗證。
