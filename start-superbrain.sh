#!/bin/bash
cd /Users/alexho/Library/CloudStorage/GoogleDrive-lavitanien@gmail.com/我的雲端硬碟/Projects/superbrain\ -\ cursor/superbrain
pkill -f "node.*next" || true
rm -rf .next
npx prisma generate
npm run dev -- -p 3002
