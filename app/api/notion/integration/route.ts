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
      return NextResponse.json(null);
    }
    
    // 返回 Notion 整合信息（不包括敏感信息如訪問令牌）
    return NextResponse.json({
      id: notionIntegration.id,
      workspaceId: notionIntegration.workspaceId,
      databaseId: notionIntegration.databaseId,
      // 檢查 notionDatabaseName 是否存在於 notionIntegration 中
      ...(notionIntegration as any).notionDatabaseName && { notionDatabaseName: (notionIntegration as any).notionDatabaseName },
      createdAt: notionIntegration.createdAt,
      updatedAt: notionIntegration.updatedAt
    });
  } catch (error) {
    console.error('獲取 Notion 整合信息時發生錯誤:', error);
    return NextResponse.json(
      { error: '獲取 Notion 整合信息時發生錯誤' },
      { status: 500 }
    );
  }
} 