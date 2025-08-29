import type { Metadata } from 'next'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: '用户登录',
  description: '登录到您的账户',
}

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">登录</CardTitle>
        <CardDescription className="text-center">
          输入您的邮箱和密码来登录账户
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* TODO: 实现登录表单 - 将在 S2-02 任务中完成 */}
        <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground mb-4">
            登录表单将在 Sprint 2 中实现
          </p>
          <p className="text-sm text-muted-foreground">
            当前为占位页面，用于路由结构搭建
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            还没有账户？{' '}
            <Link href="/register" className="text-primary hover:underline">
              注册新账户
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
        >
          返回首页
        </Link>
      </CardContent>
    </Card>
  )
}
