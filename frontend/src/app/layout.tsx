import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "用户管理系统",
    template: "%s | 用户管理系统",
  },
  description: "基于 Next.js 和 NestJS 的安全用户管理系统",
  keywords: ["用户管理", "认证", "Next.js", "NestJS", "TypeScript"],
  authors: [{ name: "User Management Team" }],
  creator: "User Management Team",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
