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
  title: '用户注册',
  description: '创建新的用户账户',
}

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">注册</CardTitle>
        <CardDescription className="text-center">
          创建新账户来开始使用系统
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* TODO: 实现注册表单 - 将在 S2-02 任务中完成 */}
        <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground mb-4">
            注册表单将在 Sprint 2 中实现
          </p>
          <p className="text-sm text-muted-foreground">
            当前为占位页面，用于路由结构搭建
          </p>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            已有账户？{' '}
            <Link href="/login" className="text-primary hover:underline">
              立即登录
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
