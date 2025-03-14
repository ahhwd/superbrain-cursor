#!/bin/bash

# 停止所有 Next.js 進程
pkill -f "node.*next" || true

# 切換到 superbrain 目錄
cd "$(dirname "$0")/superbrain"

# 清除 Next.js 的緩存
rm -rf .next

# 重新生成 Prisma 客戶端
npx prisma generate

# 啟動開發服務器
npm run dev
