import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "../../../../lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, name, password } = await req.json();

    if (!email || !name || !password) {
      return new NextResponse("缺少必要資訊", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (existingUser) {
      return new NextResponse("此電子郵件已被註冊", { status: 400 });
    }

    const hashedPassword = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword
      }
    });

    const { hashedPassword: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.log("[REGISTER_ERROR]", error);
    return new NextResponse("內部伺服器錯誤", { status: 500 });
  }
} 