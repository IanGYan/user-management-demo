import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive:
          'destructive group border-destructive bg-destructive text-destructive-foreground',
        success:
          'border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-200',
        warning:
          'border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  onClose?: () => void
  duration?: number
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { className, variant, onClose, duration = 5000, children, ...props },
    ref
  ) => {
    React.useEffect(() => {
      if (duration > 0 && onClose) {
        const timer = setTimeout(onClose, duration)
        return () => clearTimeout(timer)
      }
      return undefined
    }, [duration, onClose])

    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="grid gap-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-1 top-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100"
            aria-label="关闭"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Toast.displayName = 'Toast'

const ToastTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn('text-sm font-semibold [&+div]:text-xs', className)}
    {...props}
  />
))
ToastTitle.displayName = 'ToastTitle'

const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
))
ToastDescription.displayName = 'ToastDescription'

// Toast 容器组件
const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  )
}

// 简单的 Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = React.useState<
    Array<{
      id: string
      title?: string
      description?: string
      variant?: 'default' | 'destructive' | 'success' | 'warning'
      duration?: number
    }>
  >([])

  const toast = React.useCallback(
    ({
      title,
      description,
      variant = 'default',
      duration = 5000,
    }: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive' | 'success' | 'warning'
      duration?: number
    }) => {
      const id = Math.random().toString(36).substr(2, 9)
      const toastData: {
        id: string
        title?: string
        description?: string
        variant?: 'default' | 'destructive' | 'success' | 'warning'
        duration?: number
      } = { id, variant, duration }

      if (title !== undefined) {
        toastData.title = title
      }
      if (description !== undefined) {
        toastData.description = description
      }

      setToasts(prev => [...prev, toastData])
    },
    []
  )

  const removeToast = React.useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  return {
    toasts,
    toast,
    removeToast,
  }
}

export { Toast, ToastTitle, ToastDescription, ToastContainer, toastVariants }
