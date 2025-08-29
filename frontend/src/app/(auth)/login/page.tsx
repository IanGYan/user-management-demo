'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Loading } from '@/components/ui/loading'

import { loginSchema, type LoginFormData } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

export default function LoginPage(): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    const result = await login(data)
    
    if (result.success) {
      // 登录成功，重定向到仪表板或原来的页面
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
      router.push(redirectTo)
    }
  }

  const isFormSubmitting = isSubmitting || isLoading

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">登录</CardTitle>
        <CardDescription className="text-center">
          输入您的邮箱和密码来登录账户
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 邮箱输入 */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              邮箱地址
            </label>
            <Input
              id="email"
              type="email"
              placeholder="请输入您的邮箱地址"
              autoComplete="email"
              {...register('email')}
              className={cn(
                errors.email && 'border-red-500 focus-visible:ring-red-500'
              )}
              disabled={isFormSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* 密码输入 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                密码
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
                tabIndex={isFormSubmitting ? -1 : 0}
              >
                忘记密码？
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                autoComplete="current-password"
                {...register('password')}
                className={cn(
                  'pr-10',
                  errors.password && 'border-red-500 focus-visible:ring-red-500'
                )}
                disabled={isFormSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isFormSubmitting}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 记住登录状态 */}
          <div className="flex items-center space-x-2">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
              disabled={isFormSubmitting}
            />
            <label
              htmlFor="remember-me"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              记住登录状态
            </label>
          </div>

          {/* 提交按钮 */}
          <Button
            type="submit"
            className="w-full"
            disabled={isFormSubmitting || !isValid}
          >
            {isFormSubmitting ? (
              <>
                <Loading className="mr-2 h-4 w-4" />
                登录中...
              </>
            ) : (
              '登录账户'
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              还没有账户？{' '}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                注册新账户
              </Link>
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary underline"
            >
              返回首页
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
