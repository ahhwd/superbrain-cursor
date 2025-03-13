import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { generateSummaryAndCategory } from "@/lib/openai";

// 輔助函數：檢查並獲取用戶 token
async function getUserToken(req?: Request) {
  try {
    const headersList = req ? req.headers : headers();
    
    console.log('API 請求頭:', JSON.stringify(Array.from(headersList.entries())));
    
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
    
    console.log('獲取到的 token:', token ? '有效' : '無效');
    return token;
  } catch (error) {
    console.error('獲取 token 時發生錯誤:', error);
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const token = await getUserToken();
    
    if (!token) {
      console.log('GET 請求：用戶未登入');
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    // 獲取分頁參數
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // 計算跳過的記錄數
    const skip = (page - 1) * limit;

    console.log('GET 請求：用戶已登入，ID:', token.sub, '頁碼:', page, '每頁數量:', limit);
    
    // 獲取總記錄數
    const totalCount = await prisma.content.count({
      where: {
        userId: token.sub as string,
      }
    });
    
    // 獲取分頁後的內容
    const contents = await prisma.content.findMany({
      where: {
        userId: token.sub as string,
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    return NextResponse.json({
      contents,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("獲取內容時發生錯誤:", error);
    return NextResponse.json(
      { error: "獲取內容時發生錯誤" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('收到 POST 請求');
    const token = await getUserToken(req);
    
    if (!token) {
      console.log('POST 請求：用戶未登入');
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    console.log('POST 請求：用戶已登入，ID:', token.sub);
    
    // 檢查用戶是否存在
    const user = await prisma.user.findUnique({
      where: { id: token.sub as string }
    });

    if (!user) {
      console.log('找不到用戶，ID:', token.sub);
      return NextResponse.json(
        { error: "找不到用戶" },
        { status: 404 }
      );
    }

    const { url, title, content } = await req.json();

    // 使用 LLM 生成摘要和分類
    console.log('正在生成摘要和分類...');
    const { summary, category } = await generateSummaryAndCategory(content, title, url);
    console.log('生成完成，摘要長度:', summary?.length, '分類:', category);

    // 儲存擷取的內容，包括摘要和分類
    const savedContent = await prisma.content.create({
      data: {
        url,
        title,
        content,
        summary,
        category,
        userId: user.id,
      },
    });

    console.log('內容已成功儲存，ID:', savedContent.id);
    return NextResponse.json({
      message: "內容已成功儲存",
      contentId: savedContent.id,
      summary,
      category
    });
  } catch (error) {
    console.error("儲存內容時發生錯誤:", error);
    return NextResponse.json(
      { error: "儲存內容時發生錯誤" },
      { status: 500 }
    );
  }
} 