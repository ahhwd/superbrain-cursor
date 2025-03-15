import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 添加更詳細的日誌
  console.log('Middleware 處理請求:', request.nextUrl.pathname);
  
  try {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log('Middleware token 狀態:', token ? '有效' : '無效');
    if (token) {
      console.log('Token 內容:', JSON.stringify(token, null, 2));
    }

    const isAuthPage = 
      request.nextUrl.pathname.startsWith("/auth/signin") ||
      request.nextUrl.pathname.startsWith("/auth/register");

    // 如果用戶已登入且訪問登入/註冊頁面，重定向到儀表板
    if (token && isAuthPage) {
      console.log('已登入用戶訪問認證頁面，重定向到儀表板');
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // 如果用戶未登入且訪問需要授權的頁面，重定向到登入頁面
    if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
      console.log('未登入用戶訪問儀表板，重定向到登入頁面');
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware 錯誤:', error);
    // 發生錯誤時，重定向到登入頁面
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }
}

// 配置需要進行中間件檢查的路徑
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}; 