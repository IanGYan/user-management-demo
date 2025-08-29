# 用户管理系统 - 前端应用

基于 Next.js 15 构建的现代化用户管理系统前端应用，采用 App Router、TypeScript 和 Tailwind CSS，提供响应式的用户界面和优秀的开发体验。

![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)
![React](https://img.shields.io/badge/React-18-61DAFB.svg)
![Zustand](https://img.shields.io/badge/Zustand-State-FF6B6B.svg)

## 🎯 项目概述

这是一个企业级的用户管理系统前端应用，具有以下特性：

- 🚀 **Next.js 15**: 采用最新的 App Router 模式
- 🎨 **现代 UI**: Tailwind CSS + 自定义组件库
- 🔒 **安全认证**: JWT 令牌管理 + 路由守卫
- 📱 **响应式设计**: 移动优先的设计理念
- 🧪 **测试覆盖**: Jest + React Testing Library
- 🎭 **状态管理**: Zustand 轻量级状态管理
- 🌐 **国际化**: 多语言支持 (中/英文)
- ♿ **无障碍**: 符合 WCAG 2.1 标准

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0
- 后端 API 服务运行在 http://localhost:3001

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm  
pnpm install
```

### 环境配置

```bash
# 复制环境变量文件
cp .env.example .env.local

# 编辑环境变量（根据需要修改 API URL 等配置）
nano .env.local
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev

# 使用 yarn
yarn dev

# 使用 pnpm
pnpm dev

# 使用 bun
bun dev
```

### 访问应用

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看应用。

- **首页**: http://localhost:3000
- **登录页面**: http://localhost:3000/login
- **注册页面**: http://localhost:3000/register
- **用户仪表板**: http://localhost:3000/dashboard
- **用户资料**: http://localhost:3000/profile

## 📁 项目结构

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # 认证路由组
│   │   ├── login/           # 登录页面
│   │   ├── register/        # 注册页面
│   │   └── layout.tsx       # 认证布局
│   ├── dashboard/           # 用户仪表板
│   ├── profile/             # 用户资料
│   ├── globals.css          # 全局样式
│   ├── layout.tsx           # 根布局
│   ├── not-found.tsx        # 404 页面
│   └── page.tsx             # 首页
├── components/              # React 组件
│   └── ui/                  # 基础 UI 组件
│       ├── button.tsx       # 按钮组件
│       ├── card.tsx         # 卡片组件
│       ├── input.tsx        # 输入框组件
│       ├── loading.tsx      # 加载组件
│       ├── navigation.tsx   # 导航组件
│       └── toast.tsx        # 提示组件
├── hooks/                   # 自定义 React Hooks
│   ├── useAuth.ts          # 认证状态管理
│   └── useUI.ts            # UI 状态管理
├── stores/                  # Zustand 状态管理
│   ├── auth.ts             # 认证状态
│   └── ui.ts               # UI 状态
├── test/                    # 测试配置和工具
│   ├── config/             # 测试配置
│   ├── utils/              # 测试工具
│   └── setup.tsx           # 测试环境设置
└── types/                   # TypeScript 类型定义
    └── index.ts            # 全局类型
```

## 🎨 UI 组件库

### 基础组件

- **Button**: 多种样式的按钮组件
- **Input**: 带验证的输入框组件
- **Card**: 卡片布局组件
- **Loading**: 加载状态指示器
- **Toast**: 消息提示组件
- **Navigation**: 响应式导航组件

### 使用示例

```tsx
import { Button, Input, Card } from '@/components/ui';

function LoginForm() {
  return (
    <Card className="max-w-md mx-auto">
      <form className="space-y-4">
        <Input
          type="email"
          placeholder="邮箱地址"
          required
        />
        <Input
          type="password"
          placeholder="密码"
          required
        />
        <Button type="submit" className="w-full">
          登录
        </Button>
      </form>
    </Card>
  );
}
```

## 🔒 认证系统

### 认证流程

1. **用户登录** → 获取 JWT 令牌
2. **令牌存储** → 安全存储在客户端
3. **自动刷新** → 令牌过期前自动刷新
4. **路由守卫** → 保护需要认证的页面

### 认证 Hook 使用

```tsx
import { useAuth } from '@/hooks/useAuth';

function ProfilePage() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }
  
  return (
    <div>
      <h1>欢迎，{user?.email}</h1>
      <button onClick={logout}>退出登录</button>
    </div>
  );
}
```

### 受保护的路由

项目使用 Next.js 中间件实现路由守卫：

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // 检查认证状态
  // 重定向未认证用户到登录页
}
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 监听模式
npm run test:watch

# 测试覆盖率
npm run test:coverage

# UI 测试（如果配置了）
npm run test:ui
```

### 测试工具

- **Jest**: 测试框架
- **React Testing Library**: React 组件测试
- **MSW**: API 模拟 (Mock Service Worker)
- **Jest Environment**: jsdom 环境

### 测试示例

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders with text', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByText('点击我')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>点击我</Button>);
    fireEvent.click(screen.getByText('点击我'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🛠️ 开发工具

### 代码质量

```bash
# ESLint 检查
npm run lint
npm run lint:fix

# 类型检查
npm run type-check

# 代码格式化
npm run format
```

### 构建和部署

```bash
# 构建生产版本
npm run build

# 本地预览构建结果
npm start

# 分析构建包大小
npm run analyze
```

## ⚙️ 配置说明

### Tailwind CSS

项目使用 Tailwind CSS 4.x 和设计令牌系统：

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: 'hsl(var(--primary))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))' }
      }
    }
  }
}
```

### TypeScript 配置

- **严格模式**: 启用所有严格类型检查
- **路径映射**: `@/*` 映射到 `src/*`
- **绝对导入**: 支持绝对路径导入

### ESLint 配置

- **Next.js 规则**: 内置 Next.js 最佳实践
- **TypeScript 支持**: 完整的 TypeScript 规则
- **Accessibility**: 无障碍访问检查
- **React Hooks**: Hook 使用规范检查

## 🚀 部署

### Vercel 部署（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到 Vercel
vercel

# 生产部署
vercel --prod
```

### Docker 部署

```bash
# 构建 Docker 镜像
docker build -t user-management-frontend .

# 运行容器
docker run -p 3000:3000 user-management-frontend
```

### 静态导出

```bash
# 构建静态站点
npm run build
npm run export

# 部署 out/ 目录到任何静态托管服务
```

## 🔧 故障排除

### 常见问题

#### 1. 构建失败
```bash
# 清除缓存
rm -rf .next node_modules
npm install
npm run build
```

#### 2. 类型错误
```bash
# 检查 TypeScript 配置
npm run type-check

# 更新类型定义
npm update @types/node @types/react
```

#### 3. API 连接问题
```bash
# 检查环境变量
echo $NEXT_PUBLIC_API_URL

# 确认后端服务状态
curl http://localhost:3001/health
```

#### 4. 样式问题
```bash
# 重新构建 Tailwind
npm run build-css

# 检查 PostCSS 配置
cat postcss.config.mjs
```

## 📈 性能优化

### 代码分割

```tsx
// 动态导入组件
const DynamicComponent = dynamic(
  () => import('@/components/heavy-component'),
  { loading: () => <Loading /> }
);
```

### 图片优化

```tsx
import Image from 'next/image';

<Image
  src="/profile.jpg"
  alt="用户头像"
  width={100}
  height={100}
  priority // 关键图片预加载
/>
```

### 字体优化

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 开发规范

- 遵循 ESLint 和 Prettier 配置
- 编写组件测试
- 更新相关文档
- 确保类型安全
- 支持响应式设计

## 📚 学习资源

了解更多关于项目使用的技术：

- [Next.js 文档](https://nextjs.org/docs) - Next.js 功能和 API
- [React 文档](https://react.dev/) - React 组件和 Hooks
- [Tailwind CSS](https://tailwindcss.com/docs) - 样式和设计系统
- [TypeScript 手册](https://www.typescriptlang.org/docs/) - TypeScript 指南
- [Zustand 文档](https://zustand-demo.pmnd.rs/) - 状态管理

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。

## 📞 支持

- 📧 邮件: frontend@userapp.com
- 📖 文档: [项目文档](../docs/)
- 🐛 问题反馈: [GitHub Issues](../../issues)

---

**技术栈**: Next.js 15 + TypeScript + Tailwind CSS + Zustand  
**版本**: v1.0.0  
**最后更新**: 2025年1月21日
