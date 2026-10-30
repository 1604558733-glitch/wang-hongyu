"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
type Community={id:string;name:string;city:string};
export default function Publish() {
  const router=useRouter();const [communities,setCommunities]=useState<Community[]>([]);const [error,setError]=useState("");const [busy,setBusy]=useState(false);
  useEffect(()=>{fetch("/api/communities").then(r=>r.json()).then(setCommunities).catch(()=>setError("小区加载失败"));},[]);
  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setError("");
    const data=Object.fromEntries(new FormData(e.currentTarget));
    const res=await fetch("/api/products",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    const result=await res.json();setBusy(false);
    if(!res.ok){setError(result.error??"发布失败");return;}router.push("/");router.refresh();
  }
  return <main className="panel"><Link href="/">← 返回首页</Link><h1>发布闲置好物</h1><p className="muted">当前版本使用图片链接，拍照上传和语音输入正在规划中。</p><form onSubmit={submit}><label>商品名称</label><input name="title" maxLength={100} required placeholder="例如：九成新儿童自行车"/><label>价格（元）</label><input name="price" type="number" min="0" max="10000000" step="0.01" required/><label>所在小区</label><select name="communityId" required><option value="">请选择小区</option>{communities.map(c=><option key={c.id} value={c.id}>{c.city} · {c.name}</option>)}</select><label>商品描述</label><textarea name="description" maxLength={2000} rows={4} placeholder="成色、使用情况、交易方式"/><label>图片链接（选填）</label><input name="imageUrl" type="url" placeholder="https://..."/>{error&&<p className="error">{error}</p>}<button disabled={busy||communities.length===0}>{busy?"正在发布...":"发布商品"}</button>{communities.length===0&&<p className="muted">尚无小区数据，请先初始化小区。</p>}</form></main>;
}
