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

export async function POST(req: Request) {
  try {
    console.log('收到更新摘要請求');
    const token = await getUserToken(req);
    
    if (!token) {
      console.log('POST 請求：用戶未登入');
      return NextResponse.json(
        { error: "未登入" },
        { status: 401 }
      );
    }

    console.log('POST 請求：用戶已登入，ID:', token.sub);
    const { contentId } = await req.json();
    console.log('請求的內容 ID:', contentId);

    // 獲取內容
    const content = await prisma.content.findUnique({
      where: {
        id: contentId,
        userId: token.sub as string,
      },
    });

    if (!content) {
      console.log('找不到內容，ID:', contentId);
      return NextResponse.json(
        { error: "找不到內容" },
        { status: 404 }
      );
    }

    console.log('找到內容，ID:', content.id, '標題:', content.title);

    // 檢查 OpenAI API 密鑰是否設置
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API 密鑰未設置');
      return NextResponse.json(
        { error: "OpenAI API 密鑰未設置，請在 .env 文件中設置有效的 API 密鑰" },
        { status: 500 }
      );
    }

    if (process.env.OPENAI_API_KEY.includes('your-openai-api-key')) {
      console.error('OpenAI API 密鑰無效，包含預設值');
      return NextResponse.json(
        { error: "OpenAI API 密鑰無效，請在 .env 文件中設置有效的 API 密鑰" },
        { status: 500 }
      );
    }

    // 使用 LLM 生成摘要和分類
    console.log('正在生成摘要和分類...');
    console.log('使用的 API 密鑰前綴:', process.env.OPENAI_API_KEY.substring(0, 5) + '...');
    
    try {
      const { summary, category } = await generateSummaryAndCategory(
        content.content, 
        content.title, 
        content.url
      );
      console.log('生成完成，摘要長度:', summary.length, '分類:', category);

      // 確保 summary 和 category 不是 undefined 或 null
      const sanitizedSummary = summary || '無法生成摘要';
      const sanitizedCategory = category || '其他';
      
      console.log('準備更新資料庫，ID:', contentId);
      console.log('摘要:', sanitizedSummary);
      console.log('分類:', sanitizedCategory);

      // 更新內容
      const updatedContent = await prisma.content.update({
        where: {
          id: contentId,
        },
        data: {
          summary: sanitizedSummary,
          category: sanitizedCategory,
        },
      });

      console.log('內容已成功更新，ID:', updatedContent.id);
      console.log('更新後的摘要:', updatedContent.summary);
      console.log('更新後的分類:', updatedContent.category);
      
      return NextResponse.json({
        message: "內容已成功更新",
        contentId: updatedContent.id,
        summary: updatedContent.summary,
        category: updatedContent.category
      });
    } catch (error) {
      console.error('OpenAI API 調用失敗:', error);
      return NextResponse.json(
        { error: "OpenAI API 調用失敗，請檢查 API 密鑰是否有效" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("更新內容時發生錯誤:", error);
    return NextResponse.json(
      { error: "更新內容時發生錯誤" },
      { status: 500 }
    );
  }
} 