import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// 導出標準的 HTTP 方法處理函數
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };