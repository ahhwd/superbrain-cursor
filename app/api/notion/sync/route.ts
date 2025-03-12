import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: '未授權訪問' },
        { status: 401 }
      );
    }
    
    // 確保 session.user 有 id 屬性
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: '用戶 ID 不存在' },
        { status: 400 }
      );
    }
    
    // 解析請求體
    const { contentId } = await req.json();
    
    if (!contentId) {
      return NextResponse.json(
        { error: '缺少內容 ID' },
        { status: 400 }
      );
    }
    
    // 獲取內容
    const content = await prisma.savedContent.findUnique({
      where: {
        id: contentId,
        userId: userId
      }
    });
    
    if (!content) {
      return NextResponse.json(
        { error: '找不到指定的內容' },
        { status: 404 }
      );
    }
    
    // 獲取用戶的 Notion 整合信息
    const notionIntegration = await prisma.notionIntegration.findUnique({
      where: {
        userId: userId
      }
    });
    
    if (!notionIntegration) {
      return NextResponse.json(
        { error: '用戶尚未連接 Notion' },
        { status: 400 }
      );
    }
    
    // 使用 OpenAI API 生成內容摘要
    const summary = await generateSummary(content.content);
    
    // 將內容同步到 Notion
    const notionPageId = await syncToNotion(
      notionIntegration.accessToken,
      notionIntegration.databaseId,
      content,
      summary
    );
    
    // 更新內容的 Notion 頁面 ID
    // 這裡假設我們有一個 Topic 模型來存儲 Notion 頁面 ID
    const topic = await prisma.topic.create({
      data: {
        name: content.title || '未命名主題',
        userId: userId,
        notionPageId: notionPageId,
        savedContents: {
          connect: {
            id: content.id
          }
        }
      }
    });
    
    return NextResponse.json({
      success: true,
      message: '內容已成功同步到 Notion',
      topicId: topic.id,
      notionPageId: notionPageId
    });
  } catch (error) {
    console.error('同步內容到 Notion 時發生錯誤:', error);
    return NextResponse.json(
      { error: '同步內容到 Notion 時發生錯誤' },
      { status: 500 }
    );
  }
}

// 使用 OpenAI API 生成內容摘要
async function generateSummary(content: string): Promise<string> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('缺少 OpenAI API 密鑰');
      return '無法生成摘要：缺少 API 密鑰';
    }
    
    // 限制內容長度，避免超出 API 限制
    const truncatedContent = content.slice(0, 4000);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一個專業的內容摘要助手。請提取文本的關鍵信息，生成簡潔的摘要，並以精華筆記的形式呈現。'
          },
          {
            role: 'user',
            content: `請為以下內容生成一個精華筆記摘要，突出關鍵點和重要信息：\n\n${truncatedContent}`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API 請求失敗: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('生成摘要時發生錯誤:', error);
    return '無法生成摘要：API 錯誤';
  }
}

// 將內容同步到 Notion
async function syncToNotion(
  accessToken: string,
  databaseId: string | null,
  content: any,
  summary: string
): Promise<string> {
  try {
    if (!databaseId) {
      throw new Error('缺少 Notion 數據庫 ID');
    }
    
    // 創建 Notion 頁面
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parent: {
          database_id: databaseId
        },
        properties: {
          // 假設 Notion 數據庫有這些屬性
          'Name': {
            title: [
              {
                text: {
                  content: content.title || '未命名內容'
                }
              }
            ]
          },
          'URL': {
            url: content.url
          },
          '創建時間': {
            date: {
              start: new Date(content.createdAt).toISOString()
            }
          }
        },
        children: [
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: '精華筆記'
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: summary
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'heading_2',
            heading_2: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: '原始內容'
                  }
                }
              ]
            }
          },
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              rich_text: [
                {
                  type: 'text',
                  text: {
                    content: content.content.slice(0, 2000) // 限制長度
                  }
                }
              ]
            }
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Notion API 請求失敗: ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('同步到 Notion 時發生錯誤:', error);
    throw error;
  }
} 