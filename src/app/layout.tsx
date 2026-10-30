import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "邻里集市", description: "发现小区附近的闲置好物" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
