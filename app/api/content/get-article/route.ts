import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const title = url.searchParams.get('title');
    
    if (!title) {
      return NextResponse.json(
        { error: "需要提供文章標題" },
        { status: 400 }
      );
    }

    const article = await prisma.content.findFirst({
      where: {
        title: {
          contains: title
        }
      }
    });

    if (!article) {
      return NextResponse.json(
        { error: "找不到相關文章" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("獲取文章時發生錯誤:", error);
    return NextResponse.json(
      { error: "獲取文章時發生錯誤" },
      { status: 500 }
    );
  }
} 