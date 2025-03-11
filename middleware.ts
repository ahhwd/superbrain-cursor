import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = 
    request.nextUrl.pathname.startsWith("/auth/signin") ||
    request.nextUrl.pathname.startsWith("/auth/register");

  // 如果用戶已登入且訪問首頁或登入/註冊頁面，重定向到儀表板
  if (token && (request.nextUrl.pathname === "/" || isAuthPage)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 如果用戶未登入且訪問需要授權的頁面，重定向到登入頁面
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

// 配置需要進行中間件檢查的路徑
export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
}; 