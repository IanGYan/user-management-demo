# 用户管理系统 - 后端服务

基于 NestJS 构建的用户管理系统后端 API 服务，提供用户注册、登录、身份验证等核心功能。

## 🚀 技术栈

- **框架**: NestJS (Node.js + TypeScript)
- **数据库**: PostgreSQL + TypeORM
- **身份验证**: JWT + Passport
- **验证**: Class-validator + Class-transformer
- **配置**: @nestjs/config
- **文档**: Swagger/OpenAPI
- **测试**: Jest
- **代码质量**: ESLint + Prettier

## 📁 项目结构

```
src/
├── auth/                 # 认证模块
│   ├── dto/             # 数据传输对象
│   ├── guards/          # 认证守卫
│   ├── strategies/      # JWT策略
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── user/                # 用户模块
│   ├── entities/        # 用户实体
│   ├── dto/            # 数据传输对象
│   ├── user.controller.ts
│   ├── user.service.ts
│   └── user.module.ts
├── email/               # 邮件模块
│   ├── templates/       # 邮件模板
│   ├── email.service.ts
│   └── email.module.ts
├── common/              # 公共模块
│   ├── decorators/      # 自定义装饰器
│   ├── filters/         # 异常过滤器
│   ├── interceptors/    # 拦截器
│   └── pipes/          # 管道
├── config/              # 配置模块
│   ├── configuration.ts
│   └── config.module.ts
├── database/            # 数据库配置
│   └── migrations/      # 数据库迁移
└── main.ts              # 应用入口
```

## 🛠️ 环境设置

### 本地开发

1. **克隆仓库并安装依赖**

```bash
npm install
```

2. **创建环境变量文件**

```bash
cp .env.example .env
```

3. **配置环境变量** (编辑 `.env` 文件)

```env
# 应用配置
NODE_ENV=development
PORT=3001
API_PREFIX=api

# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/user_management?schema=public"

# JWT配置
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=30m
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_REFRESH_EXPIRES_IN=7d

# 邮件配置
EMAIL_HOST=localhost
EMAIL_PORT=1025
EMAIL_FROM=noreply@userapp.com
```

### Docker 开发环境

使用 Docker Compose 启动完整的开发环境（包括数据库、Redis、邮件服务）：

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f backend

# 停止服务
docker-compose down
```

## 🚦 运行项目

### 开发模式

```bash
# 启动开发服务器（热重载）
npm run start:dev

# 构建项目
npm run build

# 生产模式
npm run start:prod
```

### 访问服务

- **API 基础地址**: `http://localhost:3001/api`
- **Swagger 文档**: `http://localhost:3001/api/docs` (开发环境)
- **MailHog 邮件测试**: `http://localhost:8025` (Docker环境)

## 🧪 测试

```bash
# 单元测试
npm run test

# 端到端测试
npm run test:e2e

# 测试覆盖率
npm run test:cov

# 监听模式
npm run test:watch
```

## 📝 API 接口

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/refresh` - 刷新Token
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/verify-email` - 邮箱验证

### 用户相关

- `GET /api/user/profile` - 获取用户信息
- `PUT /api/user/profile` - 更新用户信息
- `POST /api/user/change-password` - 修改密码

### 健康检查

- `GET /api/auth/test` - 认证模块状态
- `GET /api/user/test` - 用户模块状态

## 🔧 开发工具

### 代码质量

```bash
# ESLint 检查
npm run lint

# 代码格式化
npm run format
```

### 数据库

```bash
# 生成迁移文件
npm run migration:generate

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert
```

## 📦 部署

### 生产构建

```bash
# 构建 Docker 镜像
docker build -t user-management-backend .

# 运行容器
docker run -p 3001:3001 --env-file .env user-management-backend
```

## 🔒 安全考虑

- 密码使用 bcrypt 加密存储
- JWT Token 有效期管理
- 请求频率限制
- 输入验证和XSS防护
- CORS 配置
- 环境变量敏感信息保护

## 📚 相关文档

- [NestJS 官方文档](https://docs.nestjs.com)
- [TypeORM 文档](https://typeorm.io)
- [项目需求文档](../docs/requirements.md)
- [Sprint 计划](../docs/sprint-plan.md)
