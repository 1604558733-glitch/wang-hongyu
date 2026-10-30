import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookieOptions, issueToken } from "@/lib/auth";
import { compare } from "bcryptjs";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const user = await db.user.findUnique({ where: { email } });
    if (!user || !(await compare(password, user.passwordHash)))
      return NextResponse.json({ error: "邮箱或密码错误" }, { status: 401 });
    const response = NextResponse.json({ id: user.id, name: user.name });
    response.cookies.set("session", await issueToken(user.id), cookieOptions);
    return response;
  } catch { return NextResponse.json({ error: "登录失败" }, { status: 500 }); }
}
