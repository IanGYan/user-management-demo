# 用户管理系统

一个安全、可扩展的 Web 应用用户管理系统，支持用户注册、登录、邮箱验证等核心功能。

## 🎯 项目概述

本项目采用现代全栈技术构建：
- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **后端**: NestJS + TypeScript + PostgreSQL + TypeORM  
- **身份验证**: JWT 双令牌机制
- **开发工具**: Docker + ESLint + Prettier + Jest

## 📋 功能特性

- ✅ 用户注册和邮箱验证
- ✅ 安全登录和会话管理
- ✅ 密码重置功能
- ✅ 用户资料管理
- ✅ 响应式 UI 设计
- ✅ JWT 双令牌认证
- ✅ 安全防护机制（限流、加密等）

## 🚀 快速开始

### 前置要求

确保您的开发环境已安装以下软件：
- [Node.js](https://nodejs.org/) >= 18.0.0
- [Docker](https://www.docker.com/) >= 20.0.0  
- [Docker Compose](https://docs.docker.com/compose/) >= 2.0.0
- [Git](https://git-scm.com/) >= 2.30.0

### 1. 克隆项目

```bash
git clone <repository-url>
cd user-management-demo
```

### 2. 启动开发环境

使用 Docker Compose 一键启动所有服务：

```bash
# 启动所有服务（数据库、后端、前端）
docker-compose up -d

# 查看服务状态
docker-compose ps
```

这将启动：
- **PostgreSQL** 数据库 (端口: 5432)
- **Redis** 缓存 (端口: 6379)  
- **MailHog** 邮件测试工具 (端口: 1025/8025)
- **后端 API** 服务 (端口: 3001)
- **前端 Web** 应用 (端口: 3000)

### 3. 访问应用

- **前端应用**: http://localhost:3000
- **后端 API**: http://localhost:3001/api  
- **API 文档**: http://localhost:3001/api/docs
- **邮件测试**: http://localhost:8025

## 🛠️ 本地开发设置

如果您更喜欢在本地环境开发，请按以下步骤操作：

### 后端开发环境

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 启动数据库服务
docker-compose up -d postgres redis mailhog

# 运行数据库迁移
npm run migration:run

# 启动开发服务器
npm run start:dev
```

### 前端开发环境

```bash
# 进入前端目录  
cd frontend

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env.local

# 启动开发服务器
npm run dev
```

## 📁 项目结构

```
user-management-demo/
├── backend/              # NestJS 后端应用
│   ├── src/
│   │   ├── auth/        # 认证模块
│   │   ├── user/        # 用户模块  
│   │   ├── email/       # 邮件模块
│   │   ├── common/      # 公共模块
│   │   ├── config/      # 配置模块
│   │   └── database/    # 数据库模块
│   ├── test/            # 测试文件
│   └── package.json
├── frontend/             # Next.js 前端应用
│   ├── src/
│   │   ├── app/         # App Router 页面
│   │   ├── components/  # React 组件
│   │   ├── hooks/       # 自定义 Hooks
│   │   ├── stores/      # 状态管理
│   │   └── types/       # TypeScript 类型
│   └── package.json
├── docs/                 # 项目文档
├── docker-compose.yml    # Docker 服务配置
└── README.md            # 项目说明
```

## 🧪 运行测试

### 后端测试

```bash
cd backend

# 单元测试
npm run test

# 端到端测试
npm run test:e2e  

# 测试覆盖率
npm run test:cov
```

### 前端测试

```bash
cd frontend

# 单元测试
npm run test

# 测试覆盖率
npm run test:coverage
```

## 🔧 开发工具

### 代码格式化

项目使用 ESLint 和 Prettier 进行代码格式化：

```bash
# 后端
cd backend
npm run lint          # 检查代码质量
npm run lint:fix      # 自动修复问题
npm run format        # 格式化代码

# 前端  
cd frontend
npm run lint
npm run lint:fix
npm run format
```

### VS Code 配置

推荐安装以下 VS Code 扩展：
- ESLint
- Prettier - Code formatter  
- TypeScript Hero
- Docker
- GitLens

在 VS Code 设置中添加：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact"]
}
```

## 🐛 故障排除

### 常见问题

#### 1. 端口冲突
**问题**: `Error: listen EADDRINUSE: address already in use`

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :3000  # 或其他端口
# 终止进程  
kill -9 <PID>
```

#### 2. 数据库连接错误
**问题**: 无法连接到 PostgreSQL

**解决方案**:
```bash
# 确保数据库服务正在运行
docker-compose up -d postgres

# 检查环境变量配置
cat backend/.env
```

#### 3. 依赖安装问题
**问题**: npm install 失败

**解决方案**:
```bash
# 清除缓存并重新安装
npm cache clean --force
rm -rf node_modules package-lock.json  
npm install
```

## 🚀 部署指南

### 开发环境部署

使用 Docker Compose：
```bash
docker-compose -f docker-compose.yml up -d
```

### 生产环境部署

1. 构建镜像：
```bash
docker-compose -f docker-compose.prod.yml build
```

2. 部署服务：
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 相关文档

- [需求文档](./docs/requirements.md) - 详细的功能需求和技术规范
- [Sprint 计划](./docs/sprint-plan.md) - 开发进度和里程碑  
- [后端 API 文档](./backend/README.md) - NestJS 后端开发指南
- [前端开发指南](./frontend/README.md) - Next.js 前端开发指南

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)  
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

## 📞 支持与反馈

如果您有任何问题或建议，请：
1. 查看 [FAQ 文档](./docs/faq.md)
2. 创建 [Issue](../../issues)
3. 联系开发团队

---

**项目状态**: 🚧 开发中  
**版本**: v1.0.0  
**最后更新**: 2025年1月21日