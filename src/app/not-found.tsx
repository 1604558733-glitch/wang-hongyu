import Link from "next/link";
export default function NotFound(){return <main className="panel"><h1>没有找到该页面</h1><p>商品可能已下架，或者链接不正确。</p><Link href="/" className="button">返回首页</Link></main>;}
