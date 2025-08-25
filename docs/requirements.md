# 用户管理系统需求文档

## 1. 项目概述

### 1.1 项目背景

构建一个安全、可扩展的 Web 应用用户管理系统，支持用户注册、登录等核心功能。

### 1.2 项目目标

- 提供安全可靠的用户身份验证机制
- 支持邮箱验证的用户注册流程
- 实现完善的用户登录和会话管理
- 采用前后端分离架构，提供良好的可维护性

### 1.3 技术栈

- **前端**: TypeScript + Next.js + Tailwind CSS
- **后端**: TypeScript + NestJS (基于 Express)
- **数据库**: PostgreSQL + TypeORM
- **身份验证**: JWT Token
- **邮件服务**: Nodemailer（开发环境模拟）

## 2. 功能性需求

### 2.1 用户注册功能

#### 2.1.1 用户故事

作为一个新用户，我希望能够注册一个新账户，以便我可以访问系统。

#### 2.1.2 功能描述

用户通过提供有效的电子邮件地址和符合安全要求的密码来创建新账户。

#### 2.1.3 详细需求

**输入验证**

- 电子邮件地址必须符合标准邮箱格式（RFC 5322 标准）
- 密码要求：
  - 最少 8 个字符
  - 至少包含 1 个数字
  - 至少包含 1 个特殊字符（!@#$%^&\*()\_+-=[]{}|;:,.<>?）
  - 至少包含 1 个大写字母
  - 至少包含 1 个小写字母

**注册流程**

1. 用户在注册页面输入邮箱和密码
2. 客户端验证输入格式
3. 提交注册请求到后端
4. 后端验证数据有效性
5. 检查邮箱是否已被注册
6. 创建待验证用户记录
7. 发送邮箱验证链接
8. 显示"请检查邮箱并点击验证链接"提示

**邮箱验证**

- 验证链接有效期：24 小时
- 验证码为随机生成的 UUID 或加密 token
- 用户点击验证链接后激活账户
- 已验证的账户才能正常登录

**错误处理**

- 邮箱已存在：提示用户邮箱已被注册
- 密码不符合要求：显示具体的密码规则
- 邮件发送失败：提示用户稍后重试
- 验证链接过期：提供重新发送验证邮件选项

### 2.2 用户登录功能

#### 2.2.1 用户故事

作为一个已注册用户，我希望能够登录我的账户，以便我可以使用系统的功能。

#### 2.2.2 功能描述

用户使用已验证的邮箱和密码进行身份验证，获得系统访问权限。

#### 2.2.3 详细需求

**登录流程**

1. 用户在登录页面输入邮箱和密码
2. 客户端基本格式验证
3. 提交登录请求到后端
4. 后端验证邮箱和密码匹配
5. 检查账户状态（是否已验证、是否被锁定）
6. 生成 JWT 访问令牌和刷新令牌
7. 返回用户信息和令牌
8. 客户端存储令牌并跳转到主页

**安全措施**

- 密码错误次数限制：5 次失败后锁定账户 15 分钟
- 登录会话管理：JWT 令牌有效期 30 分钟
- 刷新令牌有效期 7 天
- 同一用户多设备登录支持

**错误处理**

- 邮箱不存在：提示用户邮箱或密码错误（不透露具体信息）
- 密码错误：提示用户邮箱或密码错误
- 账户未验证：提示验证邮箱并提供重发验证邮件选项
- 账户被锁定：显示锁定时间和解锁提示

### 2.3 会话管理功能

#### 2.3.1 功能描述

管理用户的登录会话状态，包括令牌刷新、登出等功能。

#### 2.3.2 详细需求

**令牌管理**

- 访问令牌自动刷新机制
- 令牌黑名单管理（用于登出时失效令牌）
- 令牌有效性验证

**登出功能**

- 单设备登出：失效当前设备的令牌
- 全设备登出：失效用户所有设备的令牌

### 2.4 附加功能需求

#### 2.4.1 重置密码功能

- 忘记密码时通过邮箱重置
- 重置链接有效期：1 小时
- 重置后强制重新登录所有设备

#### 2.4.2 用户资料管理

- 查看基本用户信息
- 修改密码（需要旧密码验证）
- 修改邮箱（需要新邮箱验证）

#### 2.4.3 邮箱重发验证

- 未验证用户可重新发送验证邮件
- 发送频率限制：每 5 分钟最多 1 次

## 3. 非功能性需求

### 3.1 安全需求

- **数据加密**: 密码使用 bcrypt 加密存储
- **传输加密**: 全站 HTTPS 加密
- **SQL 注入防护**: 使用参数化查询
- **XSS 防护**: 输入验证和输出编码
- **CSRF 防护**: 使用 CSRF 令牌
- **暴力破解防护**: 登录尝试限制和账户锁定

### 3.2 性能需求

- **响应时间**: API 响应时间不超过 3 秒
- **并发用户**: 支持 1000 并发用户
- **数据库连接**: 连接池管理
- **缓存策略**: Redis 缓存频繁访问数据

### 3.3 可用性需求

- **系统可用性**: 99.9%服务可用时间
- **用户界面**: 响应式设计，支持移动端
- **错误提示**: 友好的错误信息和用户指导
- **国际化**: 支持中英文切换

### 3.4 兼容性需求

- **浏览器支持**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **移动端支持**: iOS 13+, Android 8+

## 4. 技术架构约束

### 4.1 前端架构

- **Next.js 框架**: 使用 App Router 模式
- **TypeScript**: 确保类型安全
- **Tailwind CSS**: 原子化 CSS 框架，响应式设计
- **组件化开发**: React 函数组件 + TypeScript
- **状态管理**: 使用 Zustand 或 React Context API
- **路由管理**: Next.js 内置路由系统
- **路由守卫**: 中间件(middleware.ts)实现身份验证
- **表单处理**: React Hook Form + Zod 验证
- **UI 组件**: 自定义组件 + Tailwind CSS
- **客户端缓存**: React Query/TanStack Query

### 4.2 后端架构

- **NestJS 框架**: 基于 Express 的企业级 Node.js 框架
- **模块化架构**: 按功能划分模块（Auth、User、Email 等）
- **依赖注入**: 使用 NestJS 内置 DI 容器
- **装饰器模式**: 控制器、服务、守卫等使用装饰器
- **RESTful API**: 标准 REST 接口设计
- **中间件**: 全局中间件（日志、CORS、限流等）
- **守卫(Guards)**: JWT 身份验证守卫
- **拦截器(Interceptors)**: 响应格式化、错误处理
- **管道(Pipes)**: 数据验证和转换
- **异常过滤器**: 统一错误处理机制
- **配置管理**: @nestjs/config 环境变量管理

### 4.3 数据库设计

- **PostgreSQL 数据库**: 关系型数据库
- **TypeORM**: 对象关系映射框架
- **实体定义**: 使用装饰器定义数据库实体
- **数据库迁移**: TypeORM 自动生成迁移文件
- **连接池管理**: TypeORM 内置连接池
- **查询构建器**: TypeORM QueryBuilder 复杂查询
- **事务管理**: 数据一致性保障
- **索引优化**: 邮箱、令牌等字段建立索引
- **数据验证**: 实体层面的数据验证
- **数据备份策略**: 定期自动备份

### 4.4 邮件服务配置

- **开发环境**: 使用 Nodemailer + Ethereal Email 或 MailHog 进行本地测试
- **邮件模板**: 使用 Handlebars 或其他模板引擎
- **邮件队列**: 使用 Bull Queue + Redis 处理异步邮件发送
- **邮件内容**: HTML 格式的响应式邮件模板
- **测试工具**: Ethereal Email 提供邮件预览和测试功能

### 4.5 部署和运维

- Docker 容器化部署
- 环境分离（开发、测试、生产）
- 日志记录和监控
- 数据库迁移管理

## 5. 项目结构规范

### 5.1 前端项目结构 (Next.js)

```
frontend/
├── src/
│   ├── app/                    # App Router 目录
│   │   ├── (auth)/            # 路由组
│   │   │   ├── login/         # 登录页面
│   │   │   └── register/      # 注册页面
│   │   ├── dashboard/         # 用户仪表板
│   │   ├── globals.css        # 全局样式
│   │   ├── layout.tsx         # 根布局
│   │   └── page.tsx           # 首页
│   ├── components/            # 可复用组件
│   │   ├── ui/               # 基础 UI 组件
│   │   ├── forms/            # 表单组件
│   │   └── layout/           # 布局组件
│   ├── lib/                  # 工具库
│   │   ├── auth.ts           # 认证相关工具
│   │   ├── api.ts            # API 请求工具
│   │   └── validations.ts    # 表单验证规则
│   ├── hooks/                # 自定义 React Hooks
│   ├── stores/               # 状态管理
│   └── types/                # TypeScript 类型定义
├── public/                   # 静态资源
├── middleware.ts             # Next.js 中间件
└── tailwind.config.js       # Tailwind 配置
```

### 5.2 后端项目结构 (NestJS)

```
backend/
├── src/
│   ├── auth/                 # 认证模块
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── guards/           # 认证守卫
│   │   ├── strategies/       # JWT 策略
│   │   └── dto/              # 数据传输对象
│   ├── user/                 # 用户模块
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.module.ts
│   │   └── entities/         # 用户实体
│   ├── email/                # 邮件模块
│   │   ├── email.service.ts
│   │   ├── email.module.ts
│   │   └── templates/        # 邮件模板
│   ├── common/               # 公共模块
│   │   ├── decorators/       # 自定义装饰器
│   │   ├── filters/          # 异常过滤器
│   │   ├── interceptors/     # 拦截器
│   │   └── pipes/            # 管道
│   ├── config/               # 配置模块
│   ├── database/             # 数据库配置
│   │   └── migrations/       # 数据库迁移
│   └── main.ts               # 应用入口
├── test/                     # 测试文件
└── nest-cli.json            # NestJS 配置
```

## 6. API 接口规范

### 6.1 用户注册

```
POST /api/auth/register
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "message": "注册成功，请检查邮箱验证",
  "data": {
    "userId": "uuid",
    "email": "user@example.com"
  }
}
```

### 6.2 邮箱验证

```
GET /api/auth/verify-email?token=verification_token

Response:
{
  "success": true,
  "message": "邮箱验证成功"
}
```

### 6.3 用户登录

```
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "isVerified": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### 6.4 令牌刷新

```
POST /api/auth/refresh
Content-Type: application/json

Request Body:
{
  "refreshToken": "jwt_refresh_token"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

### 6.5 用户登出

```
POST /api/auth/logout
Authorization: Bearer jwt_access_token

Response:
{
  "success": true,
  "message": "登出成功"
}
```

## 7. 数据库模型

### 7.1 用户实体 (User Entity)

```typescript
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  verificationTokenExpires: Date;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ default: 0 })
  failedLoginAttempts: number;

  @Column({ nullable: true })
  lockedUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];
}
```

### 7.2 刷新令牌实体 (RefreshToken Entity)

```typescript
@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
```

## 8. 测试需求

### 8.1 单元测试

- 密码验证逻辑测试
- 邮箱格式验证测试
- JWT 令牌生成和验证测试
- 密码加密和比较测试

### 8.2 集成测试

- 注册流程端到端测试
- 登录流程端到端测试
- 邮箱验证流程测试
- 密码重置流程测试

### 8.3 安全测试

- SQL 注入攻击测试
- XSS 攻击测试
- 暴力破解防护测试
- 会话管理安全测试

## 9. 部署和维护

### 9.1 环境配置

- 开发环境本地配置
- 测试环境部署
- 生产环境部署

### 9.2 监控和日志

- 应用性能监控
- 错误日志记录
- 用户行为分析
- 安全事件监控

### 9.3 备份和恢复

- 数据库定期备份
- 用户数据恢复策略
- 灾难恢复计划

## 10. 验收标准

### 10.1 功能验收

- [ ] 用户可以成功注册账户
- [ ] 用户可以收到并验证邮箱
- [ ] 用户可以使用正确凭据登录
- [ ] 系统正确处理各种错误情况
- [ ] 密码安全要求得到执行

### 10.2 性能验收

- [ ] API 响应时间符合要求
- [ ] 系统支持规定的并发用户数
- [ ] 页面加载时间在可接受范围内

### 10.3 安全验收

- [ ] 密码正确加密存储
- [ ] 令牌管理安全可靠
- [ ] 防护措施有效阻止常见攻击
- [ ] 用户数据传输安全

---

**文档版本**: 1.0  
**创建日期**: Aug 24, 2025  
**最后更新**: Aug 25, 2025  
**状态**: 定稿
