import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookieOptions, issueToken } from "@/lib/auth";
import { hash } from "bcryptjs";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();
    const password = String(body.password ?? "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || name.length < 2 || password.length < 8)
      return NextResponse.json({ error: "请填写姓名、有效邮箱及至少8位密码" }, { status: 400 });
    if (await db.user.findUnique({ where: { email } }))
      return NextResponse.json({ error: "邮箱已注册" }, { status: 409 });
    const user = await db.user.create({ data: { email, name, passwordHash: await hash(password, 12) } });
    const response = NextResponse.json({ id: user.id, name: user.name }, { status: 201 });
    response.cookies.set("session", await issueToken(user.id), cookieOptions);
    return response;
  } catch { return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 }); }
}
