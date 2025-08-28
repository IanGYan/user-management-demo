'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'
import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)

  const handleTestLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* 标题区域 */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">用户管理系统</h1>
        <p className="text-lg text-muted-foreground">
          基于 Next.js 和 NestJS 的现代化用户管理解决方案
        </p>
      </div>

      {/* 组件展示区域 */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* 按钮组件展示 */}
        <Card>
          <CardHeader>
            <CardTitle>按钮组件</CardTitle>
            <CardDescription>各种样式和状态的按钮组件</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">默认按钮</Button>
              <Button variant="secondary">次要按钮</Button>
              <Button variant="outline">轮廓按钮</Button>
              <Button variant="ghost">幽灵按钮</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="destructive">危险按钮</Button>
              <Button variant="link">链接按钮</Button>
              <Button loading={loading} onClick={handleTestLoading}>
                {loading ? '加载中...' : '测试加载'}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">小按钮</Button>
              <Button size="default">默认大小</Button>
              <Button size="lg">大按钮</Button>
            </div>
          </CardContent>
        </Card>

        {/* 输入组件展示 */}
        <Card>
          <CardHeader>
            <CardTitle>输入组件</CardTitle>
            <CardDescription>表单输入组件的不同状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="用户名"
              placeholder="请输入用户名"
              helperText="用户名用于登录系统"
            />
            <Input
              label="邮箱地址"
              type="email"
              placeholder="user@example.com"
              required
            />
            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              error="密码强度不足"
            />
            <Input
              label="确认密码"
              type="password"
              placeholder="请再次输入密码"
              disabled
            />
          </CardContent>
        </Card>

        {/* 加载组件展示 */}
        <Card>
          <CardHeader>
            <CardTitle>加载组件</CardTitle>
            <CardDescription>不同大小和样式的加载指示器</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Loading size="sm" />
              <Loading size="default" />
              <Loading size="lg" />
              <Loading size="xl" />
            </div>
            <Loading text="正在加载数据..." />
          </CardContent>
        </Card>

        {/* 系统状态 */}
        <Card>
          <CardHeader>
            <CardTitle>系统状态</CardTitle>
            <CardDescription>当前系统的开发状态</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex justify-between">
                <span>后端 API</span>
                <span className="text-green-600">✓ 已完成</span>
              </div>
              <div className="flex justify-between">
                <span>前端基础设施</span>
                <span className="text-green-600">✓ 已完成</span>
              </div>
              <div className="flex justify-between">
                <span>UI 组件库</span>
                <span className="text-green-600">✓ 已完成</span>
              </div>
              <div className="flex justify-between">
                <span>用户认证</span>
                <span className="text-yellow-600">⚠ 开发中</span>
              </div>
              <div className="flex justify-between">
                <span>测试覆盖</span>
                <span className="text-gray-600">○ 待开始</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 下一步计划 */}
      <Card>
        <CardHeader>
          <CardTitle>下一步计划</CardTitle>
          <CardDescription>后续开发任务</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">认证系统</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 用户注册页面</li>
                <li>• 用户登录页面</li>
                <li>• 邮箱验证功能</li>
                <li>• 密码重置功能</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">用户管理</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 用户资料页面</li>
                <li>• 密码修改功能</li>
                <li>• 账户设置页面</li>
                <li>• 用户仪表板</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">系统优化</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 单元测试覆盖</li>
                <li>• 端到端测试</li>
                <li>• 性能优化</li>
                <li>• 部署配置</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
