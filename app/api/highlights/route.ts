import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { mergeContentToHighlight } from "@/lib/openai";

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

// 檢查是否有新的擷取內容需要處理
async function processNewContents(userId: string) {
  try {
    console.log('檢查是否有新的擷取內容需要處理');

    // 由於沒有 lastVisitedHighlights 字段，我們使用一個默認的時間（例如一天前）
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    const lastVisitTime = oneDayAgo;
    console.log('默認查詢一天內的內容，時間:', lastVisitTime);

    // 獲取上次訪問後的新擷取內容（有摘要和分類的內容）
    const newContents = await prisma.content.findMany({
      where: {
        userId,
        summary: { not: null },
        category: { not: null },
        createdAt: { gt: lastVisitTime }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    console.log(`找到 ${newContents.length} 個新的擷取內容需要處理`);
    
    if (newContents.length === 0) {
      console.log('沒有新的擷取內容需要處理');
      return;
    }
    
    // 按分類分組
    const contentsByCategory: Record<string, typeof newContents> = {};
    newContents.forEach(content => {
      if (content.category) {
        if (!contentsByCategory[content.category]) {
          contentsByCategory[content.category] = [];
        }
        contentsByCategory[content.category].push(content);
      }
    });
    
    // 處理每個分類
    for (const category in contentsByCategory) {
      console.log(`處理分類: ${category}`);
      
      // 檢查是否已有該分類的精華筆記
      const existingHighlight = await prisma.highlight.findUnique({
        where: {
          userId_category: {
            userId,
            category
          }
        }
      });
      
      if (existingHighlight) {
        console.log(`找到現有的精華筆記，ID: ${existingHighlight.id}`);
        
        // 將所有該分類的新內容融合到現有的精華筆記中
        for (const content of contentsByCategory[category]) {
          console.log(`融合內容 ID: ${content.id} 到精華筆記中`);
          
          const { content: mergedContent } = await mergeContentToHighlight(
            existingHighlight.content,
            content.summary || content.content,
            category
          );
          
          // 更新精華筆記
          await prisma.highlight.update({
            where: {
              id: existingHighlight.id
            },
            data: {
              content: mergedContent,
              updatedAt: new Date()
            }
          });
          
          console.log(`精華筆記已更新，ID: ${existingHighlight.id}`);
        }
      } else {
        console.log(`沒有找到分類 ${category} 的精華筆記，創建新的精華筆記`);
        
        // 創建新的精華筆記
        const firstContent = contentsByCategory[category][0];
        const title = `${category} 精華筆記`;
        
        await prisma.highlight.create({
          data: {
            title,
            content: firstContent.summary || firstContent.content,
            category,
            userId
          }
        });
        
        console.log(`已創建新的精華筆記，分類: ${category}`);
        
        // 如果有多個內容，融合其餘的內容
        if (contentsByCategory[category].length > 1) {
          const newHighlight = await prisma.highlight.findUnique({
            where: {
              userId_category: {
                userId,
                category
              }
            }
          });
          
          if (newHighlight) {
            for (let i = 1; i < contentsByCategory[category].length; i++) {
              const content = contentsByCategory[category][i];
              console.log(`融合額外內容 ID: ${content.id} 到新的精華筆記中`);
              
              const { content: mergedContent } = await mergeContentToHighlight(
                newHighlight.content,
                content.summary || content.content,
                category
              );
              
              // 更新精華筆記
              await prisma.highlight.update({
                where: {
                  id: newHighlight.id
                },
                data: {
                  content: mergedContent,
                  updatedAt: new Date()
                }
              });
              
              console.log(`新的精華筆記已更新，ID: ${newHighlight.id}`);
            }
          }
        }
      }
    }
    
    console.log('所有新的擷取內容已處理完成');
  } catch (error) {
    console.error('處理新的擷取內容時發生錯誤:', error);
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
    
    // 處理新的擷取內容
    await processNewContents(token.sub as string);
    
    // 不再更新不存在的 lastVisitedHighlights 字段
    // 如果需要記錄訪問時間，可以在將來添加這個字段到 Prisma 模型中
    
    // 獲取總記錄數
    const totalCount = await prisma.highlight.count({
      where: {
        userId: token.sub as string,
      }
    });
    
    // 獲取分頁後的精華筆記
    const highlights = await prisma.highlight.findMany({
      where: {
        userId: token.sub as string,
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit
    });

    return NextResponse.json({
      highlights,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error("獲取精華筆記時發生錯誤:", error);
    return NextResponse.json(
      { error: "獲取精華筆記時發生錯誤" },
      { status: 500 }
    );
  }
} 