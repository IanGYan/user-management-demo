'use client'

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

export default function NotFound() {
  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }
  return (
    <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <div className="text-4xl font-bold text-muted-foreground">404</div>
          </div>
          <CardTitle className="text-2xl">页面未找到</CardTitle>
          <CardDescription className="text-base">
            抱歉，您访问的页面不存在或已被移动。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">可能的原因：</p>
          <ul className="text-sm text-muted-foreground text-left space-y-1">
            <li>• 网址输入错误</li>
            <li>• 页面已被删除或移动</li>
            <li>• 访问权限不足</li>
          </ul>
          <div className="flex flex-col gap-3 pt-4">
            <Link href="/" className={cn(buttonVariants())}>
              返回首页
            </Link>
            <button
              className={cn(buttonVariants({ variant: 'outline' }))}
              onClick={handleGoBack}
            >
              返回上一页
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
