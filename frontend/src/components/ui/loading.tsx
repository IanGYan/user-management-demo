import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const loadingVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface LoadingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, size, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', className)}
        {...props}
      >
        <svg
          className={cn(loadingVariants({ size }))}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    )
  }
)
Loading.displayName = 'Loading'

// 全屏加载组件
const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, text = '加载中...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm',
          className
        )}
        {...props}
      >
        <div className="flex flex-col items-center space-y-2">
          <Loading size="lg" />
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    )
  }
)
LoadingOverlay.displayName = 'LoadingOverlay'

// 页面加载组件
const PageLoading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, text = '页面加载中...', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex h-64 items-center justify-center', className)}
        {...props}
      >
        <div className="flex flex-col items-center space-y-2">
          <Loading size="lg" />
          <p className="text-sm text-muted-foreground">{text}</p>
        </div>
      </div>
    )
  }
)
PageLoading.displayName = 'PageLoading'

export { Loading, LoadingOverlay, PageLoading, loadingVariants }
