import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* 品牌信息 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <span className="text-xs font-bold">UM</span>
              </div>
              <span className="font-semibold">用户管理系统</span>
            </div>
            <p className="text-sm text-muted-foreground">
              基于 Next.js 和 NestJS
              的安全用户管理系统，为现代应用提供完整的用户认证和管理解决方案。
            </p>
          </div>

          {/* 产品链接 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">产品</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  首页
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  仪表板
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  个人资料
                </Link>
              </li>
            </ul>
          </div>

          {/* 支持链接 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">支持</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  帮助中心
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  联系我们
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  隐私政策
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  服务条款
                </Link>
              </li>
            </ul>
          </div>

          {/* 技术信息 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">技术栈</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Next.js 15</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
              <li>• NestJS</li>
              <li>• PostgreSQL</li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">
              © {currentYear} 用户管理系统. 保留所有权利。
            </p>
            <div className="flex space-x-4">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                隐私政策
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                服务条款
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
