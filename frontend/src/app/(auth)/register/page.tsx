'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

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

import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

// 密码强度检查
const getPasswordStrength = (password: string): {
  score: number
  label: string
  color: string
  requirements: { met: boolean; text: string }[]
} => {
  const requirements = [
    { met: password.length >= 8, text: '至少8个字符' },
    { met: /[A-Z]/.test(password), text: '包含大写字母' },
    { met: /[a-z]/.test(password), text: '包含小写字母' },
    { met: /[0-9]/.test(password), text: '包含数字' },
    { met: /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password), text: '包含特殊字符' },
  ]

  const score = requirements.filter(req => req.met).length
  let label = ''
  let color = ''

  if (score === 0) {
    label = ''
    color = ''
  } else if (score < 3) {
    label = '弱'
    color = 'text-red-500'
  } else if (score < 5) {
    label = '中等'
    color = 'text-yellow-500'
  } else {
    label = '强'
    color = 'text-green-500'
  }

  return { score, label, color, requirements }
}

export default function RegisterPage(): React.ReactElement {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  })

  const password = watch('password', '')
  const confirmPassword = watch('confirmPassword', '')
  const passwordStrength = getPasswordStrength(password)

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    const result = await registerUser(data)
    
    if (result.success) {
      // 注册成功，显示邮箱验证提示
      // useAuth hook 会自动显示 toast 消息
    }
  }

  const isFormSubmitting = isSubmitting || isLoading

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">注册</CardTitle>
        <CardDescription className="text-center">
          创建新账户来开始使用系统
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
            <label
              htmlFor="password"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              密码
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
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
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* 密码强度指示 */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        'h-2 rounded-full transition-all',
                        passwordStrength.score < 3
                          ? 'bg-red-500'
                          : passwordStrength.score < 5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      )}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  {passwordStrength.label && (
                    <span className={cn('text-sm font-medium', passwordStrength.color)}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {passwordStrength.requirements.map((req, index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex items-center gap-2 text-xs',
                        req.met ? 'text-green-600' : 'text-gray-500'
                      )}
                    >
                      {req.met ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {req.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* 确认密码输入 */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              确认密码
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="请再次输入密码"
                {...register('confirmPassword')}
                className={cn(
                  'pr-10',
                  errors.confirmPassword && 'border-red-500 focus-visible:ring-red-500'
                )}
                disabled={isFormSubmitting}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isFormSubmitting}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* 密码匹配指示 */}
            {confirmPassword && password && (
              <div className="flex items-center gap-2 text-xs">
                {password === confirmPassword ? (
                  <>
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">密码匹配</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">密码不匹配</span>
                  </>
                )}
              </div>
            )}

            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                {errors.confirmPassword.message}
              </p>
            )}
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
                注册中...
              </>
            ) : (
              '创建账户'
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              已有账户？{' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                立即登录
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
