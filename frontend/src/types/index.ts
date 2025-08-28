// 用户类型定义
export interface User {
  id: string
  email: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// 认证令牌类型
export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// 认证状态类型
export interface AuthState {
  user: User | null
  tokens: AuthTokens | null
  isLoading: boolean
  isAuthenticated: boolean
}

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string[]>
}

// 表单数据类型
export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
}

export interface LoginFormData {
  email: string
  password: string
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  password: string
  confirmPassword: string
}

export interface UpdateUserFormData {
  email?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

// 组件 Props 类型
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  loading?: boolean
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

// 路由保护类型
export interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireUnauth?: boolean
  redirectTo?: string
}

// Toast 通知类型
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 语言类型
export type Language = 'zh' | 'en'
