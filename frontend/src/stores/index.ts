/**
 * Store 统一入口文件
 * 导出所有 Zustand stores 和相关类型
 */

// 认证 Store
export { useAuthStore } from './auth'
export type { AuthState, AuthActions, AuthStore } from './auth'

// UI Store
export { useUIStore } from './ui'
export type {
  UIState,
  UIActions,
  UIStore,
  Theme,
  Toast,
  LoadingState,
} from './ui'

/**
 * 重置所有 stores 的函数
 * 通常在测试中使用
 */
export const resetAllStores = () => {
  // 这里可以添加重置逻辑，如果 stores 提供了重置方法
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'development') {
      console.warn('resetAllStores: 清除本地存储和重置状态')
    }
    localStorage.clear()
    // 可以添加更多重置逻辑
  }
}

/**
 * Store 初始化函数
 * 在应用启动时调用
 */
export const initializeStores = () => {
  // 可以在这里添加 stores 的初始化逻辑
  // 例如：恢复主题设置、初始化认证状态等

  // 恢复主题设置
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as any
    if (savedTheme) {
      // 这里需要导入 useUIStore 然后调用 setTheme
      // 但是由于这是在模块级别，我们不能直接使用 hooks
      // 这个功能应该在组件级别的 useEffect 中处理
    }
  }
}

/**
 * Store 类型和常量导出
 */
export { AuthStatus } from '@/lib/auth'
