import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 添加調試信息
console.log("NextAuth 路由被加載，環境變數:", {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NODE_ENV: process.env.NODE_ENV
});

// 導出標準的 HTTP 方法處理函數
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };