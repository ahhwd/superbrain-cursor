import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { prisma } from "../../../../lib/prisma";
import { JWT } from "next-auth/jwt";

// 強制設置 baseUrl 為本地環境
const BASE_URL = "http://localhost:3000";

// 強制覆蓋環境變數
process.env.NEXTAUTH_URL = BASE_URL;

// 擴展 Session 類型
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
  }
}

// 擴展 JWT 類型
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("authorize 函數被調用，憑證:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("缺少電子郵件或密碼");
          throw new Error("請輸入電子郵件和密碼");
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          console.log("查詢到的用戶:", user ? "存在" : "不存在");

          if (!user || !user.hashedPassword) {
            console.log("找不到用戶或用戶沒有密碼");
            throw new Error("找不到此用戶");
          }

          const isValid = await compare(credentials.password, user.hashedPassword);
          console.log("密碼驗證結果:", isValid ? "正確" : "錯誤");

          if (!isValid) {
            throw new Error("密碼錯誤");
          }

          console.log("認證成功，返回用戶:", user.id);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error("認證過程中發生錯誤:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT 回調被調用", { user: user ? "有用戶數據" : "無用戶數據", token });
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session 回調被調用", { session, token });
      if (token && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // 忽略傳入的 baseUrl，強制使用本地 URL
      console.log("重定向回調被調用", { url, 忽略baseUrl: baseUrl, 強制使用: BASE_URL });
      
      // 強制使用本地 URL
      if (url.startsWith("/")) {
        return `${BASE_URL}${url}`;
      }
      return BASE_URL;
    }
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
