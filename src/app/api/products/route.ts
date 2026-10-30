import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUserId } from "@/lib/auth";
export async function GET(req: Request) {
  const communityId = new URL(req.url).searchParams.get("communityId");
  const products = await db.product.findMany({
    where: { status: "AVAILABLE", ...(communityId ? { communityId } : {}) },
    include: { community: { select: { name: true, city: true } }, seller: { select: { name: true } } },
    orderBy: { createdAt: "desc" }, take: 50
  });
  return NextResponse.json(products.map(p => ({ ...p, price: Number(p.price) })));
}
export async function POST(req: Request) {
  const sellerId = await currentUserId();
  if (!sellerId) return NextResponse.json({ error: "请先登录" }, { status: 401 });
  try {
    const body = await req.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const price = Number(body.price);
    const communityId = String(body.communityId ?? "");
    const imageUrl = body.imageUrl ? String(body.imageUrl).trim() : null;
    if (!title || title.length > 100 || description.length > 2000 || !Number.isFinite(price) || price < 0 || price > 10000000 || !communityId)
      return NextResponse.json({ error: "商品信息不完整" }, { status: 400 });
    if (imageUrl) {
      try { const u = new URL(imageUrl); if (!["http:", "https:"].includes(u.protocol)) throw new Error(); }
      catch { return NextResponse.json({ error: "图片链接格式不正确" }, { status: 400 }); }
    }
    if (!(await db.community.findUnique({ where: { id: communityId } })))
      return NextResponse.json({ error: "小区不存在" }, { status: 404 });
    const product = await db.product.create({ data: { title, description, price, imageUrl, communityId, sellerId } });
    return NextResponse.json({ id: product.id }, { status: 201 });
  } catch { return NextResponse.json({ error: "发布失败" }, { status: 500 }); }
}
