'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth'
import { authApi, type LoginFormData, type RegisterFormData } from '@/lib/api'
import { AuthStatus } from '@/lib/auth'
import { useUIStore } from '@/stores/ui'

/**
 * 认证操作 Hook
 * 提供登录、注册、登出等认证相关功能
 */
export const useAuth = () => {
  const {
    status,
    isAuthenticated,
    isLoading,
    user,
    error,
    login: setLoginData,
    logout: clearAuth,
    setLoading,
    setError,
    initialize,
    checkAuthStatus,
    clearError,
  } = useAuthStore()

  const { addToast } = useUIStore()

  // 初始化认证状态
  useEffect(() => {
    initialize()
  }, [initialize])

  /**
   * 用户登录
   */
  const login = async (credentials: LoginFormData) => {
    try {
      setLoading(true)
      clearError()

      // TODO: 后端需要实现 POST /auth/login API
      // 当前后端只有 GET /auth/test 测试端点
      const response = await authApi.login(credentials)

      if (response.data.success && response.data.data) {
        setLoginData(response.data.data)

        addToast({
          type: 'success',
          title: '登录成功',
          message: '欢迎回来！',
        })

        return { success: true, data: response.data.data }
      } else {
        throw new Error(response.data.message || '登录失败')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '登录失败，请稍后重试'

      setError(errorMessage)
      addToast({
        type: 'error',
        title: '登录失败',
        message: errorMessage,
      })

      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 用户注册
   */
  const register = async (userData: RegisterFormData) => {
    try {
      setLoading(true)
      clearError()

      // TODO: 后端需要实现 POST /auth/register API
      // 当前后端只有 GET /auth/test 测试端点
      const response = await authApi.register({
        email: userData.email,
        password: userData.password,
      })

      if (response.data.success) {
        addToast({
          type: 'success',
          title: '注册成功',
          message: '请检查您的邮箱并点击验证链接',
          duration: 8000,
        })

        return { success: true, data: response.data.data }
      } else {
        throw new Error(response.data.message || '注册失败')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '注册失败，请稍后重试'

      setError(errorMessage)
      addToast({
        type: 'error',
        title: '注册失败',
        message: errorMessage,
      })

      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 用户登出
   */
  const logout = async () => {
    try {
      setLoading(true)

      // TODO: 后端需要实现 POST /auth/logout API
      // 当前后端只有 GET /auth/test 测试端点
      await authApi.logout()

      clearAuth()

      addToast({
        type: 'info',
        title: '已退出登录',
        message: '您已安全退出',
      })

      return { success: true }
    } catch (error: any) {
      // 即使 API 调用失败，也要清除本地状态
      clearAuth()

      // 记录登出 API 错误（但不在用户界面显示）
      if (process.env.NODE_ENV === 'development') {
        console.error('Logout API error:', error)
      }

      addToast({
        type: 'info',
        title: '已退出登录',
        message: '您已安全退出',
      })

      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 邮箱验证
   */
  const verifyEmail = async (token: string) => {
    try {
      setLoading(true)
      clearError()

      // TODO: 后端需要实现 GET /auth/verify-email API
      // 当前后端只有 GET /auth/test 测试端点
      const response = await authApi.verifyEmail(token)

      if (response.data.success) {
        // 重新检查认证状态以更新用户验证状态
        checkAuthStatus()

        addToast({
          type: 'success',
          title: '邮箱验证成功',
          message: '您的账户已激活，现在可以正常使用所有功能',
        })

        return { success: true }
      } else {
        throw new Error(response.data.message || '邮箱验证失败')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '邮箱验证失败'

      setError(errorMessage)
      addToast({
        type: 'error',
        title: '邮箱验证失败',
        message: errorMessage,
      })

      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 重新发送验证邮件
   */
  const resendVerificationEmail = async (email?: string) => {
    try {
      setLoading(true)
      clearError()

      const emailToUse = email || user?.email
      if (!emailToUse) {
        throw new Error('未找到邮箱地址')
      }

      // TODO: 后端需要实现 POST /auth/resend-verification API
      // 当前后端只有 GET /auth/test 测试端点
      const response = await authApi.resendVerification(emailToUse)

      if (response.data.success) {
        addToast({
          type: 'success',
          title: '验证邮件已发送',
          message: '请检查您的邮箱并点击验证链接',
          duration: 8000,
        })

        return { success: true }
      } else {
        throw new Error(response.data.message || '发送验证邮件失败')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '发送验证邮件失败'

      setError(errorMessage)
      addToast({
        type: 'error',
        title: '发送失败',
        message: errorMessage,
      })

      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 忘记密码
   */
  const forgotPassword = async (email: string) => {
    try {
      setLoading(true)
      clearError()

      // TODO: 后端需要实现 POST /auth/forgot-password API
      // 当前后端只有 GET /auth/test 测试端点
      const response = await authApi.forgotPassword(email)

      if (response.data.success) {
        addToast({
          type: 'success',
          title: '重置链接已发送',
          message: '请检查您的邮箱并按照说明重置密码',
          duration: 8000,
        })

        return { success: true }
      } else {
        throw new Error(response.data.message || '发送重置链接失败')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '发送重置链接失败'

      setError(errorMessage)
      addToast({
        type: 'error',
        title: '发送失败',
        message: errorMessage,
      })

      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  /**
   * 重置密码
   */
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setLoading(true)
      clearError()

      // TODO: 后端需要实现 POST /auth/reset-password API
      // 当前后端只有 GET /auth/test 测试端点
      const response = await authApi.resetPassword({
        token,
        password: newPassword,
      })

      if (response.data.success) {
        // 重置成功后清除认证状态，要求重新登录
        clearAuth()

        addToast({
          type: 'success',
          title: '密码重置成功',
          message: '请使用新密码登录',
        })

        return { success: true }
      } else {
        throw new Error(response.data.message || '密码重置失败')
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || '密码重置失败'

      setError(errorMessage)
      addToast({
        type: 'error',
        title: '重置失败',
        message: errorMessage,
      })

      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    // 状态
    status,
    isAuthenticated,
    isLoading,
    user,
    error,

    // 状态检查
    isEmailVerified: status === AuthStatus.AUTHENTICATED,
    needsEmailVerification: status === AuthStatus.EMAIL_NOT_VERIFIED,

    // 操作
    login,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,

    // 工具函数
    clearError,
    checkAuthStatus,
  }
}
