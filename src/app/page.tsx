import Link from "next/link";
import { db } from "@/lib/db";
import { currentUserId } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function Home({ searchParams }: { searchParams: Promise<{ communityId?: string; q?: string }> }) {
  const params = await searchParams;
  const communityId = params.communityId || "";
  const q = (params.q || "").trim().slice(0,80);
  const where = { status: "AVAILABLE", ...(communityId ? { communityId } : {}), ...(q ? { OR: [{ title: { contains: q, mode: "insensitive" as const } }, { description: { contains: q, mode: "insensitive" as const } }] } : {}) };
  const [communities, products, userId] = await Promise.all([
    db.community.findMany({ orderBy: [{ city: "asc" }, { name: "asc" }] }),
    db.product.findMany({ where, include: { community: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    currentUserId()
  ]);
  return <><header><strong>🏡 邻里集市</strong><nav><Link href="/publish" className="button">+ 发布闲置</Link>　{userId ? <form action="/api/auth/logout" method="post" style={{display:"inline"}}><button>退出</button></form> : <Link href="/login">登录 / 注册</Link>}</nav></header>
    <main className="container"><section className="hero"><h1>让闲置好物，在邻里间流转</h1><p>找你的小区，发现邻居正在转让的好东西。</p></section>
    <form className="toolbar" method="get" role="search">
      <label htmlFor="q">搜索闲置：</label><input id="q" name="q" type="search" maxLength={80} defaultValue={q} placeholder="如儿童自行车、婴儿车" style={{maxWidth:310}}/>
      <label htmlFor="community">所在小区：</label><select id="community" name="communityId" defaultValue={communityId} style={{maxWidth:280}}><option value="">全部小区</option>{communities.map(c=><option key={c.id} value={c.id}>{c.city} · {c.name}</option>)}</select><button type="submit">搜索商品</button>
      {(q || communityId) && <Link href="/" className="button secondary">清除筛选</Link>}
    </form>
    <h2>{q ? `“${q}”的搜索结果` : "最新闲置"}</h2>{products.length===0 ? <div className="empty">没有找到符合条件的商品，试试其他关键词或小区。</div> : <div className="grid">{products.map(p=><article className="card" key={p.id}>{p.imageUrl ? <img src={p.imageUrl} alt={p.title}/> : <div style={{height:180,background:"#e9f3ee",display:"grid",placeItems:"center",fontSize:48}}>📦</div>}<h3><Link href={`/products/${p.id}`}>{p.title}</Link></h3><p className="price">¥{Number(p.price).toFixed(2)}</p><p className="muted">{p.community.name} · {p.community.city}</p><p><Link href={`/products/${p.id}`} className="button secondary">查看详情</Link></p></article>)}</div>}</main></>;
}
