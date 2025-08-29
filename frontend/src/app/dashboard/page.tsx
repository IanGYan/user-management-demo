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
  title: '用户仪表板',
  description: '用户个人仪表板和系统概览',
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">用户仪表板</h1>
        <p className="text-lg text-muted-foreground">
          欢迎回来，这里是您的个人控制中心
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>账户概览</CardTitle>
            <CardDescription>查看您的账户基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: 实现账户信息展示 - 将在 S3-04 任务中完成 */}
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <p className="text-sm text-muted-foreground">
                账户信息将在后续Sprint中实现
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>安全设置</CardTitle>
            <CardDescription>管理您的账户安全</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: 实现安全设置 - 将在 S3-05 任务中完成 */}
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <p className="text-sm text-muted-foreground">
                安全设置将在后续Sprint中实现
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>活动记录</CardTitle>
            <CardDescription>查看最近的账户活动</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: 实现活动记录 - 将在 S3-05 任务中完成 */}
            <div className="text-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <p className="text-sm text-muted-foreground">
                活动记录将在后续Sprint中实现
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
          返回首页
        </Link>
      </div>
    </div>
  )
}
