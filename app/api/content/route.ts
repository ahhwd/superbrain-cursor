import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

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

export async function GET() {
  try {
    const token = await getUserToken();
    
    if (!token) {
      console.log('GET 請求：用戶未登入');
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    console.log('GET 請求：用戶已登入，ID:', token.sub);
    const contents = await prisma.content.findMany({
      where: {
        userId: token.sub as string,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(contents);
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
    const { url, title, content } = await req.json();

    // 儲存擷取的內容
    const savedContent = await prisma.content.create({
      data: {
        url,
        title,
        content,
        userId: token.sub as string,
      },
    });

    console.log('內容已成功儲存，ID:', savedContent.id);
    return NextResponse.json({
      message: "內容已成功儲存",
      contentId: savedContent.id,
    });
  } catch (error) {
    console.error("儲存內容時發生錯誤:", error);
    return NextResponse.json(
      { error: "儲存內容時發生錯誤" },
      { status: 500 }
    );
  }
} 