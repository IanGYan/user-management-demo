# 用户管理系统 - 后端 API

基于 NestJS 构建的用户管理系统后端 API，提供安全的用户认证、注册、登录和资料管理功能。

![NestJS](https://img.shields.io/badge/NestJS-v10-red.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-v5-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-blue.svg)
![JWT](https://img.shields.io/badge/JWT-Authentication-green.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

## 🎯 项目概述

这是一个企业级的用户管理系统后端 API，采用 NestJS 框架构建，具有以下特性：

- 🔐 **安全认证**: JWT 双令牌机制，bcrypt 密码加密
- 📧 **邮件服务**: 用户注册验证、密码重置
- 🛡️ **安全防护**: 限流、CORS、输入验证
- 📊 **数据库**: PostgreSQL + TypeORM，自动迁移
- 🧪 **测试**: 单元测试 + 端到端测试
- 📝 **文档**: Swagger API 文档自动生成
- 🐳 **容器化**: Docker 开发和部署支持

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- Redis >= 6.0 (可选，用于缓存)
- Docker & Docker Compose (推荐)

### 安装依赖

```bash
# 安装项目依赖
npm install

# 或使用 yarn
yarn install
```

### 环境配置

```bash
# 复制环境变量文件
cp .env.example .env

# 编辑环境变量（重要：修改 JWT 密钥等敏感信息）
nano .env
```

### 数据库设置

#### 方式一：使用 Docker（推荐）

```bash
# 启动数据库服务
docker-compose up -d postgres redis mailhog

# 运行数据库迁移
npm run migration:run
```

#### 方式二：本地 PostgreSQL

```bash
# 创建数据库
psql -U postgres -c "CREATE DATABASE user_management;"

# 运行迁移
npm run migration:run
```

## 🏃‍♂️ 运行项目

### 开发环境

```bash
# 开发模式（热重载）
npm run start:dev

# 标准开发模式
npm run start

# 调试模式
npm run start:debug
```

### 生产环境

```bash
# 构建项目
npm run build

# 生产模式运行
npm run start:prod
```

### 访问服务

- **API 服务**: http://localhost:3001
- **API 文档**: http://localhost:3001/api/docs
- **健康检查**: http://localhost:3001/health

## 🧪 测试

### 运行测试

```bash
# 单元测试
npm run test

# 单元测试（监听模式）
npm run test:watch

# 端到端测试
npm run test:e2e

# 测试覆盖率
npm run test:cov

# 测试覆盖率（详细报告）
npm run test:cov -- --verbose
```

### 测试配置

- **单元测试**: Jest + 内存数据库 (SQLite)
- **E2E 测试**: Supertest + 测试数据库
- **覆盖率目标**: >90%
- **测试环境**: 自动化的数据库清理和种子数据

## 🚀 部署

### Docker 部署（推荐）

```bash
# 构建镜像
docker build -t user-management-api .

# 运行容器
docker run -p 3001:3001 --env-file .env user-management-api

# 使用 Docker Compose
docker-compose up -d
```

### 传统部署

```bash
# 1. 构建项目
npm run build

# 2. 设置生产环境变量
export NODE_ENV=production

# 3. 运行数据库迁移
npm run migration:run

# 4. 启动应用
npm run start:prod
```

### 部署清单

- [ ] 设置生产环境变量
- [ ] 配置数据库连接
- [ ] 运行数据库迁移
- [ ] 配置 HTTPS/SSL
- [ ] 设置反向代理 (Nginx)
- [ ] 配置监控和日志
- [ ] 设置备份策略

## 📁 项目结构

```
src/
├── auth/                    # 认证模块
│   ├── dto/                # 数据传输对象
│   ├── entities/           # 实体类
│   ├── guards/             # 守卫
│   ├── services/           # 服务
│   ├── strategies/         # 认证策略
│   └── auth.controller.ts  # 认证控制器
├── user/                   # 用户模块
│   ├── dto/
│   ├── entities/
│   ├── user.controller.ts
│   └── user.service.ts
├── email/                  # 邮件模块
├── common/                 # 公共模块
│   ├── decorators/         # 装饰器
│   ├── filters/            # 过滤器
│   ├── interceptors/       # 拦截器
│   ├── services/           # 公共服务
│   └── types/              # 类型定义
├── config/                 # 配置模块
├── database/               # 数据库模块
│   └── migrations/         # 数据库迁移
└── main.ts                 # 应用入口
```

## 🔧 开发工具

### 代码质量

```bash
# ESLint 检查
npm run lint
npm run lint:fix

# 代码格式化
npm run format

# 类型检查
npm run type-check
```

### 数据库操作

```bash
# 生成迁移文件
npm run migration:generate -- --name=AddNewFeature

# 运行迁移
npm run migration:run

# 回滚迁移
npm run migration:revert

# 查看迁移状态
npm run migration:show
```

### 日志和调试

```bash
# 查看应用日志
tail -f logs/app.log

# 数据库查询日志
# 在 .env 中设置 TYPEORM_LOGGING=true
```

## 📚 API 文档

### Swagger 文档

访问 http://localhost:3001/api/docs 查看完整的 API 文档。

### 主要 API 端点

#### 认证相关
- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录
- `POST /auth/logout` - 用户登出
- `POST /auth/refresh` - 刷新令牌
- `GET /auth/verify-email` - 邮箱验证
- `POST /auth/forgot-password` - 忘记密码
- `POST /auth/reset-password` - 重置密码

#### 用户相关
- `GET /user/profile` - 获取用户资料
- `PUT /user/profile` - 更新用户资料
- `POST /user/change-password` - 修改密码
- `DELETE /user/account` - 删除账户

### 响应格式

```typescript
// 成功响应
{
  "success": true,
  "data": {...},
  "message": "操作成功"
}

// 错误响应
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "输入验证失败",
    "details": [...]
  }
}
```

## 🛠️ 故障排除

### 常见问题

#### 1. 数据库连接失败
```bash
# 检查数据库是否运行
docker-compose ps

# 查看数据库日志
docker-compose logs postgres

# 测试连接
npm run db:test-connection
```

#### 2. 端口被占用
```bash
# 查找占用进程
lsof -i :3001

# 终止进程
kill -9 <PID>

# 或修改 .env 中的端口
PORT=3002
```

#### 3. 迁移失败
```bash
# 重置数据库
npm run db:reset

# 重新运行迁移
npm run migration:run
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

### 代码规范

- 遵循 ESLint 和 Prettier 配置
- 编写单元测试
- 更新 API 文档
- 遵循 TypeScript 严格模式

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../LICENSE) 文件了解详情。

## 📞 支持

- 📧 邮件: support@userapp.com
- 📖 文档: [项目文档](../docs/)
- 🐛 问题反馈: [GitHub Issues](../../issues)

---

**技术栈**: NestJS + TypeScript + PostgreSQL + TypeORM + JWT  
**版本**: v1.0.0  
**最后更新**: 2025年1月21日
