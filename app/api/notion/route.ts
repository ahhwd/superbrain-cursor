import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

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
    
    // 構建 Notion OAuth URL
    const clientId = process.env.NOTION_CLIENT_ID;
    const redirectUri = process.env.NOTION_REDIRECT_URI;
    const authUrl = process.env.NOTION_AUTH_URL;
    
    if (!clientId || !redirectUri || !authUrl) {
      return NextResponse.json(
        { error: 'Notion API 配置缺失' },
        { status: 500 }
      );
    }
    
    // 生成隨機狀態以防止 CSRF 攻擊
    const state = Math.random().toString(36).substring(2, 15);
    
    // 構建授權 URL
    const notionAuthUrl = `${authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}&owner=user`;
    
    console.log('生成 Notion 授權 URL:', notionAuthUrl);
    
    // 將用戶重定向到 Notion 授權頁面
    return NextResponse.json({ url: notionAuthUrl });
  } catch (error) {
    console.error('Notion 授權錯誤:', error);
    return NextResponse.json(
      { error: '授權過程中發生錯誤', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 