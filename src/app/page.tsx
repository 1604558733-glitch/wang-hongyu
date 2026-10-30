import Link from "next/link";
import { db } from "@/lib/db";
import { currentUserId } from "@/lib/auth";
export const dynamic = "force-dynamic";
export default async function Home({ searchParams }: { searchParams: Promise<{ communityId?: string }> }) {
  const { communityId } = await searchParams;
  const [communities, products, userId] = await Promise.all([
    db.community.findMany({ orderBy: { name: "asc" } }),
    db.product.findMany({ where: { status: "AVAILABLE", ...(communityId ? { communityId } : {}) }, include: { community: true }, orderBy: { createdAt: "desc" }, take: 50 }),
    currentUserId()
  ]);
  return <><header><strong>🏡 邻里集市</strong><nav><Link href="/publish" className="button">+ 发布闲置</Link>　{userId ? <form action="/api/auth/logout" method="post" style={{display:"inline"}}><button>退出</button></form> : <Link href="/login">登录 / 注册</Link>}</nav></header>
    <main className="container"><section className="hero"><h1>让闲置好物，在邻里间流转</h1><p>同一个小区，交易更方便。发现附近的宝藏好物。</p></section>
    <form className="toolbar" method="get"><label htmlFor="community">选择小区：</label><select id="community" name="communityId" defaultValue={communityId ?? ""} style={{maxWidth:280}}><option value="">全部小区</option>{communities.map(c=><option key={c.id} value={c.id}>{c.city} · {c.name}</option>)}</select><button>筛选</button></form>
    <h2>最新闲置</h2>{products.length===0 ? <div className="empty">暂无商品。可先在数据库中添加小区，然后发布第一件闲置好物。</div> : <div className="grid">{products.map(p=><article className="card" key={p.id}>{p.imageUrl ? <img src={p.imageUrl} alt={p.title}/> : <div style={{height:180,background:"#e9f3ee",display:"grid",placeItems:"center",fontSize:48}}>📦</div>}<h3><Link href={`/products/${p.id}`}>{p.title}</Link></h3><p className="price">¥{Number(p.price).toFixed(2)}</p><p className="muted">{p.community.name} · {p.community.city}</p><p><Link href={`/products/${p.id}`} className="button secondary">查看详情</Link></p></article>)}</div>}</main></>;
}
