import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
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
    
    // 從數據庫中獲取用戶的 Notion 整合信息
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
    
    // 獲取 Notion API URL
    const notionApiUrl = process.env.NOTION_API_URL;
    if (!notionApiUrl) {
      return NextResponse.json(
        { error: 'Notion API URL 配置缺失' },
        { status: 500 }
      );
    }
    
    // 獲取用戶的 Notion 數據庫列表
    const response = await fetch(`${notionApiUrl}/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionIntegration.accessToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filter: {
          value: 'database',
          property: 'object'
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('獲取 Notion 數據庫列表失敗:', errorData);
      return NextResponse.json(
        { error: '獲取 Notion 數據庫列表失敗' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // 提取數據庫信息
    const databases = data.results.map((db: any) => ({
      id: db.id,
      title: db.title[0]?.plain_text || '未命名數據庫',
      url: db.url,
      created_time: db.created_time,
      last_edited_time: db.last_edited_time
    }));
    
    return NextResponse.json(databases);
  } catch (error) {
    console.error('獲取 Notion 數據庫列表時發生錯誤:', error);
    return NextResponse.json(
      { error: '獲取 Notion 數據庫列表時發生錯誤' },
      { status: 500 }
    );
  }
}

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
    const { databaseId, databaseName } = await req.json();
    
    if (!databaseId) {
      return NextResponse.json(
        { error: '缺少數據庫 ID' },
        { status: 400 }
      );
    }
    
    // 更新用戶的 Notion 整合信息
    // 使用 as any 類型斷言來繞過 TypeScript 類型檢查
    const updateData: any = {
      databaseId: databaseId
    };
    
    if (databaseName) {
      updateData.notionDatabaseName = databaseName;
    }
    
    const notionIntegration = await prisma.notionIntegration.update({
      where: {
        userId: userId
      },
      data: updateData
    });
    
    return NextResponse.json({
      success: true,
      message: '已成功選擇 Notion 數據庫',
      databaseId: notionIntegration.databaseId,
      // 使用類型斷言來訪問 notionDatabaseName 屬性
      databaseName: (notionIntegration as any).notionDatabaseName
    });
  } catch (error) {
    console.error('選擇 Notion 數據庫時發生錯誤:', error);
    return NextResponse.json(
      { error: '選擇 Notion 數據庫時發生錯誤' },
      { status: 500 }
    );
  }
} 