import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '../../../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // 獲取用戶會話
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    // 確保 session.user 有 id 屬性
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.redirect(new URL('/dashboard?error=no_user_id', req.url));
    }
    
    // 從 URL 獲取授權碼
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');
    
    // 處理錯誤情況
    if (error) {
      console.error('Notion 授權錯誤:', error);
      return NextResponse.redirect(new URL('/dashboard?error=notion_auth_failed', req.url));
    }
    
    if (!code) {
      return NextResponse.redirect(new URL('/dashboard?error=no_code', req.url));
    }
    
    // 獲取必要的環境變數
    const clientId = process.env.NOTION_CLIENT_ID;
    const clientSecret = process.env.NOTION_CLIENT_SECRET;
    const redirectUri = process.env.NOTION_REDIRECT_URI;
    const tokenUrl = process.env.NOTION_TOKEN_URL;
    
    if (!clientId || !clientSecret || !redirectUri || !tokenUrl) {
      return NextResponse.redirect(new URL('/dashboard?error=missing_env', req.url));
    }
    
    console.log('開始交換授權碼獲取訪問令牌...');
    
    // 交換授權碼獲取訪問令牌
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('獲取 Notion 訪問令牌失敗:', errorData);
      return NextResponse.redirect(new URL(`/dashboard?error=token_exchange_failed&details=${encodeURIComponent(JSON.stringify(errorData))}`, req.url));
    }
    
    const tokenData = await response.json();
    console.log('成功獲取訪問令牌:', JSON.stringify(tokenData, null, 2));
    
    // 從響應中提取必要的數據
    const {
      access_token,
      bot_id,
      workspace_id,
      expires_in
    } = tokenData;
    
    // 計算令牌過期時間
    const expiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null;
    
    console.log('正在保存 Notion 集成信息到數據庫...');
    
    // 在數據庫中保存或更新 Notion 集成
    await prisma.notionIntegration.upsert({
      where: {
        userId: userId
      },
      update: {
        accessToken: access_token,
        workspaceId: workspace_id,
        botId: bot_id,
        expiresAt
      },
      create: {
        userId: userId,
        accessToken: access_token,
        workspaceId: workspace_id,
        botId: bot_id,
        expiresAt
      }
    });
    
    console.log('Notion 集成信息已保存，重定向到儀表板...');
    
    // 重定向到儀表板，顯示成功消息
    return NextResponse.redirect(new URL('/dashboard?success=notion_connected', req.url));
  } catch (error) {
    console.error('Notion 回調處理錯誤:', error);
    return NextResponse.redirect(new URL(`/dashboard?error=callback_processing_failed&details=${encodeURIComponent(error instanceof Error ? error.message : String(error))}`, req.url));
  }
} 