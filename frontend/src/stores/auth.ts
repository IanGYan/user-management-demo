import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { User, LoginResponse } from '@/lib/api'
import { AuthManager, AuthStatus, getAuthStatus } from '@/lib/auth'

/**
 * 认证状态接口
 */
export interface AuthState {
  // 认证状态
  status: AuthStatus
  isAuthenticated: boolean
  isLoading: boolean

  // 用户信息
  user: User | null

  // 错误信息
  error: string | null
}

/**
 * 认证操作接口
 */
export interface AuthActions {
  // 状态更新
  setStatus: (status: AuthStatus) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setUser: (user: User | null) => void

  // 认证操作
  login: (loginData: LoginResponse) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void

  // 初始化和状态检查
  initialize: () => void
  checkAuthStatus: () => void
  clearError: () => void
}

/**
 * 认证 Store 类型
 */
export type AuthStore = AuthState & AuthActions

/**
 * 初始状态
 */
const initialState: AuthState = {
  status: AuthStatus.LOADING,
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
}

/**
 * 认证 Zustand Store
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 设置认证状态
      setStatus: (status: AuthStatus) => {
        set(
          state => ({
            ...state,
            status,
            isAuthenticated: status === AuthStatus.AUTHENTICATED,
            isLoading: false,
          }),
          false,
          'setStatus'
        )
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set(state => ({ ...state, isLoading: loading }), false, 'setLoading')
      },

      // 设置错误信息
      setError: (error: string | null) => {
        set(state => ({ ...state, error }), false, 'setError')
      },

      // 设置用户信息
      setUser: (user: User | null) => {
        set(state => ({ ...state, user }), false, 'setUser')
      },

      // 登录处理
      login: (loginData: LoginResponse) => {
        // 保存到 localStorage
        AuthManager.login(loginData.user, loginData.tokens)

        // 更新 store 状态
        set(
          state => ({
            ...state,
            status: AuthStatus.AUTHENTICATED,
            isAuthenticated: true,
            user: loginData.user,
            error: null,
            isLoading: false,
          }),
          false,
          'login'
        )
      },

      // 登出处理
      logout: () => {
        // 清除 localStorage 数据
        AuthManager.logout()

        // 重置 store 状态
        set(
          state => ({
            ...state,
            status: AuthStatus.UNAUTHENTICATED,
            isAuthenticated: false,
            user: null,
            error: null,
            isLoading: false,
          }),
          false,
          'logout'
        )
      },

      // 更新用户信息
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user
        if (!currentUser) return

        const updatedUser = { ...currentUser, ...userData }

        // 更新 localStorage
        AuthManager.setUser(updatedUser)

        // 更新 store
        set(state => ({ ...state, user: updatedUser }), false, 'updateUser')
      },

      // 初始化认证状态
      initialize: () => {
        set(state => ({ ...state, isLoading: true }), false, 'initialize/start')

        try {
          const status = getAuthStatus()
          const user = AuthManager.getUser()

          set(
            state => ({
              ...state,
              status,
              isAuthenticated: status === AuthStatus.AUTHENTICATED,
              user,
              isLoading: false,
            }),
            false,
            'initialize/success'
          )
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to initialize auth state:', error)
          }
          set(
            state => ({
              ...state,
              status: AuthStatus.UNAUTHENTICATED,
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: '初始化认证状态失败',
            }),
            false,
            'initialize/error'
          )
        }
      },

      // 检查认证状态
      checkAuthStatus: () => {
        const status = getAuthStatus()
        const user = AuthManager.getUser()

        set(
          state => ({
            ...state,
            status,
            isAuthenticated: status === AuthStatus.AUTHENTICATED,
            user,
          }),
          false,
          'checkAuthStatus'
        )
      },

      // 清除错误
      clearError: () => {
        set(state => ({ ...state, error: null }), false, 'clearError')
      },
    }),
    {
      name: 'auth-store', // Redux DevTools 中的名称
      // 仅在开发环境启用 devtools
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)
