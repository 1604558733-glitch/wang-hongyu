"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Login() {
  const router = useRouter(); const [register,setRegister]=useState(false); const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();setBusy(true);setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch(register?"/api/auth/register":"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(Object.fromEntries(form))});
    const data = await res.json();setBusy(false);
    if(!res.ok){setError(data.error??"操作失败");return;}
    router.push("/");router.refresh();
  }
  return <main className="panel"><Link href="/">← 返回首页</Link><h1>{register?"注册邻里集市":"欢迎回来"}</h1><form onSubmit={submit}>{register&&<><label>昵称</label><input name="name" minLength={2} required/></>}<label>邮箱</label><input name="email" type="email" required/><label>密码</label><input name="password" type="password" minLength={register?8:1} required/>{error&&<p className="error">{error}</p>}<button disabled={busy}>{busy?"请稍候...":register?"注册":"登录"}</button></form><p><button className="button secondary" type="button" onClick={()=>{setRegister(!register);setError("");}}>{register?"已有账号？去登录":"没有账号？立即注册"}</button></p></main>;
}
