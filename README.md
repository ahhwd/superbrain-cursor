# SuperBrain

產品定位：
1. 自動持續幫用戶整理吸收到的資訊，成為知識

產品功能：
1. 用戶使用瀏覽器看網頁時，可以用 Chrome Extension 把網頁文章內容擷取下來 存到 SuperBrain 系統。可以運用 LLM 整理 Notion 裡面文件的內容，自動分類歸檔。SuperBrain 系統會通過 Notion API  在用戶的 Notion Database 中建立並且維護多篇「精華筆記」。
2. 用戶只要不定期自己去閱讀各篇「精華筆記」，就能持續熟悉、掌握重要的知識。

## 技術架構

本專案使用以下技術：
- [Next.js](https://nextjs.org) - React 框架
- Chrome Extension - 瀏覽器擴充功能
- NextAuth.js - 身份驗證
- Prisma - 資料庫 ORM
- Tailwind CSS - 樣式框架

## 開始使用

1. 安裝依賴：

```bash
npm install
```

2. 啟動開發伺服器：

```bash
npm run dev
```

3. 在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

4. 安裝 Chrome 擴充功能：
   - 打開 Chrome 擴充功能頁面 (chrome://extensions/)
   - 開啟開發者模式
   - 點擊「載入未封裝項目」
   - 選擇專案中的 `extension` 資料夾

## 部署

本專案可以部署到 [Vercel Platform](https://vercel.com) 上。詳細部署說明請參考 [Next.js 部署文檔](https://nextjs.org/docs/app/building-your-application/deploying)。
