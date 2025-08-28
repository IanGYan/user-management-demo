import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * 主题类型
 */
export type Theme = 'light' | 'dark' | 'system'

/**
 * Toast 通知类型
 */
export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * 加载状态接口
 */
export interface LoadingState {
  isLoading: boolean
  message?: string | undefined
  progress?: number | undefined
}

/**
 * UI 状态接口
 */
export interface UIState {
  // 主题相关
  theme: Theme
  isDarkMode: boolean
  
  // 全局加载状态
  globalLoading: LoadingState
  
  // Toast 通知
  toasts: Toast[]
  
  // 侧边栏和导航状态
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  
  // 模态框状态
  modals: Record<string, boolean>
  
  // 页面标题
  pageTitle?: string | undefined
}

/**
 * UI 操作接口
 */
export interface UIActions {
  // 主题控制
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  
  // 加载状态控制
  setGlobalLoading: (loading: boolean, message?: string, progress?: number) => void
  
  // Toast 通知控制
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAllToasts: () => void
  
  // 侧边栏和导航控制
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  
  // 模态框控制
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  toggleModal: (modalId: string) => void
  closeAllModals: () => void
  
  // 页面标题
  setPageTitle: (title?: string) => void
}

/**
 * UI Store 类型
 */
export type UIStore = UIState & UIActions

/**
 * 初始状态
 */
const initialState: UIState = {
  theme: 'system',
  isDarkMode: false,
  globalLoading: {
    isLoading: false,
    message: undefined,
    progress: undefined,
  },
  toasts: [],
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  modals: {},
  pageTitle: undefined,
}

/**
 * 获取系统主题偏好
 */
const getSystemTheme = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

/**
 * 计算当前是否应该使用深色模式
 */
const calculateIsDarkMode = (theme: Theme): boolean => {
  switch (theme) {
    case 'dark':
      return true
    case 'light':
      return false
    case 'system':
      return getSystemTheme()
    default:
      return false
  }
}

/**
 * 生成唯一 ID
 */
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * UI Zustand Store
 */
export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 设置主题
      setTheme: (theme: Theme) => {
        const isDarkMode = calculateIsDarkMode(theme)
        
        // 保存到 localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', theme)
          
          // 更新 HTML 类名
          document.documentElement.classList.toggle('dark', isDarkMode)
        }

        set(
          state => ({ ...state, theme, isDarkMode }),
          false,
          'setTheme'
        )
      },

      // 切换主题
      toggleTheme: () => {
        const currentTheme = get().theme
        let newTheme: Theme
        
        switch (currentTheme) {
          case 'light':
            newTheme = 'dark'
            break
          case 'dark':
            newTheme = 'system'
            break
          case 'system':
            newTheme = 'light'
            break
          default:
            newTheme = 'light'
        }
        
        get().setTheme(newTheme)
      },

      // 设置全局加载状态
      setGlobalLoading: (isLoading: boolean, message?: string, progress?: number) => {
        set(
          state => ({
            ...state,
            globalLoading: {
              isLoading,
              message: message ?? undefined,
              progress: progress ?? undefined,
            },
          }),
          false,
          'setGlobalLoading'
        )
      },

      // 添加 Toast 通知
      addToast: (toast: Omit<Toast, 'id'>) => {
        const newToast: Toast = {
          ...toast,
          id: generateId(),
          duration: toast.duration ?? 5000,
        }
        
        set(
          state => ({
            ...state,
            toasts: [...state.toasts, newToast],
          }),
          false,
          'addToast'
        )
        
        // 自动移除 toast
        if (newToast.duration && newToast.duration > 0) {
          setTimeout(() => {
            get().removeToast(newToast.id)
          }, newToast.duration)
        }
      },

      // 移除 Toast 通知
      removeToast: (id: string) => {
        set(
          state => ({
            ...state,
            toasts: state.toasts.filter(toast => toast.id !== id),
          }),
          false,
          'removeToast'
        )
      },

      // 清除所有 Toast 通知
      clearAllToasts: () => {
        set(
          state => ({ ...state, toasts: [] }),
          false,
          'clearAllToasts'
        )
      },

      // 设置侧边栏状态
      setSidebarOpen: (open: boolean) => {
        set(
          state => ({ ...state, isSidebarOpen: open }),
          false,
          'setSidebarOpen'
        )
      },

      // 切换侧边栏状态
      toggleSidebar: () => {
        set(
          state => ({ ...state, isSidebarOpen: !state.isSidebarOpen }),
          false,
          'toggleSidebar'
        )
      },

      // 设置移动端菜单状态
      setMobileMenuOpen: (open: boolean) => {
        set(
          state => ({ ...state, isMobileMenuOpen: open }),
          false,
          'setMobileMenuOpen'
        )
      },

      // 切换移动端菜单状态
      toggleMobileMenu: () => {
        set(
          state => ({ ...state, isMobileMenuOpen: !state.isMobileMenuOpen }),
          false,
          'toggleMobileMenu'
        )
      },

      // 打开模态框
      openModal: (modalId: string) => {
        set(
          state => ({
            ...state,
            modals: { ...state.modals, [modalId]: true },
          }),
          false,
          'openModal'
        )
      },

      // 关闭模态框
      closeModal: (modalId: string) => {
        set(
          state => ({
            ...state,
            modals: { ...state.modals, [modalId]: false },
          }),
          false,
          'closeModal'
        )
      },

      // 切换模态框状态
      toggleModal: (modalId: string) => {
        set(
          state => ({
            ...state,
            modals: {
              ...state.modals,
              [modalId]: !state.modals[modalId],
            },
          }),
          false,
          'toggleModal'
        )
      },

      // 关闭所有模态框
      closeAllModals: () => {
        set(
          state => ({ ...state, modals: {} }),
          false,
          'closeAllModals'
        )
      },

      // 设置页面标题
      setPageTitle: (title?: string) => {
        // 更新 document title
        if (typeof window !== 'undefined') {
          const appName = process.env.NEXT_PUBLIC_APP_NAME || '用户管理系统'
          document.title = title ? `${title} - ${appName}` : appName
        }
        
        set(
          state => ({ ...state, pageTitle: title ?? undefined }),
          false,
          'setPageTitle'
        )
      },
    }),
    {
      name: 'ui-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
)