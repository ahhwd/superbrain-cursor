import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log('收到測試請求');
    
    // 檢查 OpenAI API 密鑰是否設置
    const apiKey = process.env.OPENAI_API_KEY || 'not-set';
    const apiKeyPrefix = apiKey.substring(0, 10) + '...';
    
    return NextResponse.json({
      message: "測試成功",
      apiKeyPrefix,
      env: Object.keys(process.env).filter(key => key.includes('OPENAI')),
    });
  } catch (error) {
    console.error("測試時發生錯誤:", error);
    return NextResponse.json(
      { error: "測試時發生錯誤", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 