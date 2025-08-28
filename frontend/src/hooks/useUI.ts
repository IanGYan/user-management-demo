'use client'

import { useEffect } from 'react'
import { useUIStore, type Toast } from '@/stores/ui'

/**
 * UI 管理 Hook
 * 提供主题、Toast、加载状态等 UI 相关功能
 */
export const useUI = () => {
  const {
    theme,
    isDarkMode,
    globalLoading,
    toasts,
    isSidebarOpen,
    isMobileMenuOpen,
    modals,
    pageTitle,
    
    setTheme,
    toggleTheme,
    setGlobalLoading,
    addToast,
    removeToast,
    clearAllToasts,
    setSidebarOpen,
    toggleSidebar,
    setMobileMenuOpen,
    toggleMobileMenu,
    openModal,
    closeModal,
    toggleModal,
    closeAllModals,
    setPageTitle,
  } = useUIStore()

  // 初始化主题
  useEffect(() => {
    // 从 localStorage 恢复主题设置
    const savedTheme = localStorage.getItem('theme') as any
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      // 默认使用系统主题
      setTheme('system')
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        setTheme('system') // 触发重新计算
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setTheme, theme])

  /**
   * 快捷 Toast 方法
   */
  const toast = {
    success: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({
        type: 'success',
        title,
        ...(message !== undefined && { message }),
        ...options,
      })
    },
    error: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({
        type: 'error',
        title,
        ...(message !== undefined && { message }),
        ...options,
      })
    },
    warning: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({
        type: 'warning',
        title,
        ...(message !== undefined && { message }),
        ...options,
      })
    },
    info: (title: string, message?: string, options?: Partial<Toast>) => {
      addToast({
        type: 'info',
        title,
        ...(message !== undefined && { message }),
        ...options,
      })
    },
  }

  /**
   * 全局加载控制
   */
  const loading = {
    start: (message?: string, progress?: number) => {
      setGlobalLoading(true, message, progress)
    },
    stop: () => {
      setGlobalLoading(false)
    },
    update: (message?: string, progress?: number) => {
      setGlobalLoading(true, message, progress)
    },
  }

  /**
   * 模态框控制
   */
  const modal = {
    open: openModal,
    close: closeModal,
    toggle: toggleModal,
    closeAll: closeAllModals,
    isOpen: (modalId: string) => !!modals[modalId],
  }

  /**
   * 侧边栏控制
   */
  const sidebar = {
    open: () => setSidebarOpen(true),
    close: () => setSidebarOpen(false),
    toggle: toggleSidebar,
    isOpen: isSidebarOpen,
  }

  /**
   * 移动端菜单控制
   */
  const mobileMenu = {
    open: () => setMobileMenuOpen(true),
    close: () => setMobileMenuOpen(false),
    toggle: toggleMobileMenu,
    isOpen: isMobileMenuOpen,
  }

  return {
    // 状态
    theme,
    isDarkMode,
    globalLoading,
    toasts,
    pageTitle,
    
    // 主题控制
    setTheme,
    toggleTheme,
    
    // Toast 控制
    toast,
    addToast,
    removeToast,
    clearAllToasts,
    
    // 加载状态控制
    loading,
    setGlobalLoading,
    
    // 模态框控制
    modal,
    
    // 侧边栏控制
    sidebar,
    
    // 移动端菜单控制
    mobileMenu,
    
    // 页面标题
    setPageTitle,
  }
}