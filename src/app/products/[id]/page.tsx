import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function ProductDetail({params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const product=await db.product.findUnique({where:{id},include:{community:true,seller:{select:{name:true}}}});
  if(!product||product.status!=="AVAILABLE")notFound();
  return <><header><Link href="/"><strong>🏡 邻里集市</strong></Link><Link href="/publish" className="button">发布闲置</Link></header><main className="container"><Link href="/">← 返回商品列表</Link><article className="panel" style={{maxWidth:740}}>{product.imageUrl?<img src={product.imageUrl} alt={product.title} style={{width:"100%",maxHeight:420,objectFit:"contain",borderRadius:12}}/>:<div style={{height:220,background:"#e9f3ee",display:"grid",placeItems:"center",fontSize:64}}>📦</div>}<h1>{product.title}</h1><p className="price">¥{Number(product.price).toFixed(2)}</p><p className="muted">📍 {product.community.city} · {product.community.name}</p><p className="muted">卖家：{product.seller.name}</p><h2>商品描述</h2><p style={{whiteSpace:"pre-wrap"}}>{product.description||"卖家尚未填写描述"}</p><p className="muted">发布于 {product.createdAt.toLocaleDateString("zh-CN")}</p><p className="muted">平台尚未提供私信与支付功能，请勿公开个人联系方式或提前转账。</p></article></main></>;
}
