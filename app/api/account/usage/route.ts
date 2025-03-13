import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

// 獲取用戶 token
async function getUserToken(req: Request) {
  return await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
}

export async function GET(req: Request) {
  try {
    const token = await getUserToken(req);
    
    if (!token) {
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    // 獲取當前月份的第一天和最後一天
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // 查詢本月擷取的網頁數量
    const monthlyCaptures = await prisma.content.count({
      where: {
        userId: token.sub as string,
        createdAt: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth
        }
      }
    });

    return NextResponse.json({
      monthlyCaptures
    });
  } catch (error) {
    console.error("獲取使用量數據時發生錯誤:", error);
    return NextResponse.json(
      { error: "獲取使用量數據時發生錯誤" },
      { status: 500 }
    );
  }
}