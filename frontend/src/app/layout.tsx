import type { Metadata, Viewport } from 'next'
import { Navigation, Footer } from '@/components/ui'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '用户管理系统',
    template: '%s | 用户管理系统',
  },
  description: '基于 Next.js 和 NestJS 的安全用户管理系统',
  keywords: ['用户管理', '认证', 'Next.js', 'NestJS', 'TypeScript'],
  authors: [{ name: 'User Management Team' }],
  creator: 'User Management Team',
  robots: 'index, follow',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
