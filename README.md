# 🏡 邻里集市 Community Marketplace

小区二手闲置交易平台。当前版本为可供本地开发的 MVP，尚未正式部署。

## 已有功能
- 邮箱注册、登录、退出（bcrypt 密码哈希 + HttpOnly JWT Cookie）
- 商品发布、浏览、按小区筛选
- 商品详情页与卖家昵称
- PostgreSQL + Prisma 数据模型
- 演示小区初始化脚本

## 使用 Docker 启动数据库

需要 Node.js 20+ 和 Docker Desktop。

```bash
docker compose up -d
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

在浏览器打开 http://localhost:3000 。

Windows PowerShell 中请用 `Copy-Item .env.example .env` 代替 `cp`。请将 .env 中的 JWT_SECRET 修改为至少 32 字符的随机值。演示数据库密码仅供本地开发使用。

## 当前限制
- 图片暂时填写 URL，尚未接入文件上传
- 尚未接入语音转文字、自动定位与即时聊天
- 正式上线前必须补充限流、内容审核、图片存储、用户隐私保护及生产环境部署配置
- 尚未经过完整的自动化构建和端到端测试

## 项目结构
- `src/app` 页面和 API
- `src/lib` 数据库和身份验证
- `prisma/schema.prisma` 数据模型
- `prisma/seed.ts` 演示小区
