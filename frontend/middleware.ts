import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 受保护的路由
const protectedPaths = ['/dashboard', '/profile']

// 认证相关路由
const authPaths = ['/login', '/register']

/**
 * 检查是否有有效的访问令牌
 */
function hasValidToken(request: NextRequest): boolean {
  const token = request.cookies.get('accessToken')?.value
  
  // 简单检查令牌是否存在
  // 在实际应用中，这里可能需要验证JWT的有效性
  return Boolean(token && token.trim() !== '')
}

/**
 * 检查路径是否匹配给定的路径列表
 */
function matchesPath(pathname: string, paths: string[]): boolean {
  return paths.some(path => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  })
}

/**
 * Next.js 中间件函数
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = hasValidToken(request)

  // 检查是否是受保护的路由
  if (matchesPath(pathname, protectedPaths)) {
    if (!isAuthenticated) {
      // 未认证用户尝试访问受保护路由，重定向到登录页
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 检查是否是认证相关路由
  if (matchesPath(pathname, authPaths)) {
    if (isAuthenticated) {
      // 已认证用户尝试访问登录/注册页，重定向到仪表板
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // 对于其他路由，允许继续
  return NextResponse.next()
}

/**
 * 中间件配置
 * 指定中间件应该在哪些路径上运行
 */
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了以下路径：
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - 文件扩展名（.svg, .png, .jpg, etc.）
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}