# Time Desk · 24H 時間計數機

一個可直接放到 GitHub Pages 的純 HTML／CSS／JavaScript 工具，支援：

- 時間加／減分鐘（24 小時制）
- 兩個時間之間的分鐘差
- 跨午夜計算，例如 `23:50 → 00:15 = 25 分鐘`
- 手機及桌面版面
- 個別及全部重設

## 部署到 GitHub Pages

1. 解壓此 ZIP，將所有檔案上載到 GitHub repository 根目錄。
2. 在 repository 的 **Settings → Pages**，選擇從 `main` branch 的 `/(root)` 部署。
3. 儲存後等待 GitHub 提供網址。

不需安裝套件、資料庫或伺服器。

## 已驗證的時間解析

核心程式不使用 regex 驗證時間；它直接把 `HH:MM` 分段後轉成數值並逐一檢查時、分範圍。已以 `10:30`、`14:20`、`00:15`、`23:50` 驗證解析與運算。
