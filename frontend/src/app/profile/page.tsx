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
  title: '个人资料',
  description: '管理您的个人资料和账户设置',
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">个人资料</h1>
        <p className="text-lg text-muted-foreground">
          管理您的个人信息和账户设置
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>更新您的个人基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: 实现个人信息编辑表单 - 将在 S3-04 任务中完成 */}
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <p className="text-muted-foreground mb-4">
                个人信息编辑功能将在 Sprint 3 中实现
              </p>
              <p className="text-sm text-muted-foreground">
                包括：邮箱修改、个人信息更新等
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>密码设置</CardTitle>
            <CardDescription>更改您的登录密码</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: 实现密码修改功能 - 将在 S3-04 任务中完成 */}
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <p className="text-muted-foreground mb-4">
                密码修改功能将在 Sprint 3 中实现
              </p>
              <p className="text-sm text-muted-foreground">
                需要旧密码验证的安全密码更改
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>账户安全</CardTitle>
            <CardDescription>管理您的账户安全设置</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO: 实现安全设置 - 将在 S3-05 任务中完成 */}
            <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <p className="text-muted-foreground mb-4">
                账户安全功能将在 Sprint 3 中实现
              </p>
              <p className="text-sm text-muted-foreground">
                包括：登录设备管理、安全日志等
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center space-x-4">
        <Link
          href="/dashboard"
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          返回仪表板
        </Link>
        <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
          返回首页
        </Link>
      </div>
    </div>
  )
}
