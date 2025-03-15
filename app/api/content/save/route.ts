import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 檢查用戶是否已登入
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "未授權的請求" },
        { status: 401 }
      );
    }

    // 獲取請求內容
    const { url, title, content } = await req.json();

    // 驗證必要欄位
    if (!url || !content) {
      return NextResponse.json(
        { error: "URL 和內容為必填欄位" },
        { status: 400 }
      );
    }

    // 查找用戶
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "找不到用戶" },
        { status: 404 }
      );
    }

    // 儲存內容
    const savedContent = await prisma.savedContent.create({
      data: {
        userId: user.id,
        url,
        title: title || url,
        content
      }
    });

    return NextResponse.json({
      message: "內容儲存成功",
      data: savedContent
    });

  } catch (error) {
    console.error("儲存內容時發生錯誤:", error);
    return NextResponse.json(
      { error: "儲存內容時發生錯誤" },
      { status: 500 }
    );
  }
} 