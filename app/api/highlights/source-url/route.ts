import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

// 輔助函數：檢查並獲取用戶 token
async function getUserToken(req?: NextRequest) {
  try {
    const headersList = req ? req.headers : headers();
    
    const token = await getToken({ 
      req: req || {
        headers: headersList,
        cookies: Object.fromEntries(
          Array.from(headersList.entries())
            .filter(([key]) => key.toLowerCase() === 'cookie')
            .flatMap(([_, value]) => 
              value.split(';')
                .map(cookie => cookie.trim().split('='))
                .map(([key, value]) => [key, decodeURIComponent(value)])
            )
        ),
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });
    
    return token;
  } catch (error) {
    console.error('獲取 token 時發生錯誤:', error);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getUserToken();
    
    if (!token) {
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    // 獲取查詢參數
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    if (!category) {
      return NextResponse.json(
        { error: "缺少分類參數" },
        { status: 400 }
      );
    }

    // 查找該分類下的所有內容
    const contents = await prisma.content.findMany({
      where: {
        userId: token.sub as string,
        category: category,
      },
      select: {
        url: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // 限制返回數量，避免數據過大
    });

    return NextResponse.json({
      sourceUrls: contents
    });
  } catch (error) {
    console.error("獲取來源 URL 時發生錯誤:", error);
    return NextResponse.json(
      { error: "獲取來源 URL 時發生錯誤" },
      { status: 500 }
    );
  }
} 