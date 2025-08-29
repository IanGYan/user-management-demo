import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | 用户认证',
    default: '用户认证',
  },
  description: '用户登录、注册和身份验证',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8">{children}</div>
    </div>
  )
}
