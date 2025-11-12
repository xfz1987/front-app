# Next.js 部署到 Cloudflare Workers 文档

本文档指导你如何将 Next.js 项目（支持 SSR）部署到 **Cloudflare Workers**。

## 重要说明：Cloudflare Pages vs Workers

### 部署方式对比

| 特性 | Cloudflare Pages | Cloudflare Workers |
|------|-----------------|-------------------|
| **部署目标** | Pages (使用 Workers 作为底层) | 纯 Workers |
| **SSR 支持** | ✅ 通过 @cloudflare/next-on-pages | ✅ 通过 @opennextjs/cloudflare |
| **Node.js APIs** | ❌ 有限支持 | ✅ 更好的支持 |
| **部署方式** | Git 集成 或 wrangler pages deploy | wrangler deploy |
| **路由配置** | 自动 | 需要配置 |
| **适用场景** | 大多数 Next.js 应用 | 需要更多 Node.js APIs |

### 结论

**Cloudflare Pages 和 Workers 的关系：**
- **Cloudflare Pages** 底层使用 **Cloudflare Workers** 技术
- 当你部署到 **Pages** 时，动态功能（SSR、API Routes）会自动运行在 **Workers** 上
- 直接部署到 **Workers** 需要使用不同的适配器和配置

### 我应该选择哪个？

#### 选择 Cloudflare Pages（推荐）
- ✅ 如果你的应用是标准的 Next.js 项目
- ✅ 如果你想要简单的部署流程
- ✅ 如果你需要 Git 集成和自动 CI/CD
- ✅ 使用 Edge Runtime 即可满足需求

**→ 请参考我之前创建的 `CLOUDFLARE_WORKERS_DEPLOYMENT.md` 文档**（虽然名字是 Workers，但实际是部署到 Pages，Pages 会使用 Workers 处理动态内容）

#### 选择纯 Cloudflare Workers
- ✅ 如果你需要更多 Node.js APIs（如 crypto、buffer 等）
- ✅ 如果你需要自定义路由配置
- ✅ 如果你想要更底层的控制

**→ 继续阅读下面的文档**

---

## 部署到纯 Cloudflare Workers（使用 @opennextjs/cloudflare）

如果你确实需要部署到纯 Workers，请按照以下步骤操作。

### 前置准备

```bash
cd /Users/autonomic/work/AI/AI-ST/code/xfz-next-ai/front-app

# 检查环境
node --version  # 推荐 18.x+
pnpm --version
```

---

## 步骤 1: 安装 @opennextjs/cloudflare

```bash
# 安装适配器
pnpm add -D @opennextjs/cloudflare
```

---

## 步骤 2: 创建 wrangler.toml 配置

在项目根目录创建 `wrangler.toml`:

```toml
#:schema node_modules/wrangler/config-schema.json
name = "front-app"
compatibility_date = "2024-11-12"
compatibility_flags = ["nodejs_compat"]

# Workers Sites 配置
# [site]
# bucket = ".open-next/worker"

# 如果需要 KV 存储
# kv_namespaces = [
#   { binding = "ASSETS", id = "your-kv-id" }
# ]

# 环境变量（敏感信息使用 secrets）
[vars]
# NODE_ENV = "production"

# 路由配置（如果使用自定义域名）
# routes = [
#   { pattern = "example.com/*", zone_name = "example.com" }
# ]
```

**关键配置说明：**
- `compatibility_date`: 必须是 `2024-09-23` 或更新
- `compatibility_flags`: 必须包含 `nodejs_compat`

---

## 步骤 3: 配置 Next.js

### 更新 next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },

  // Cloudflare Workers 特定配置
  experimental: {
    // 不需要设置 runtime: 'edge'，@opennextjs/cloudflare 会处理
  },
};

export default nextConfig;
```

---

## 步骤 4: 更新 package.json

添加构建和部署脚本：

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "eslint",
    "workers:build": "opennextjs-cloudflare",
    "workers:deploy": "npm run workers:build && wrangler deploy",
    "workers:dev": "wrangler dev"
  }
}
```

---

## 步骤 5: 配置环境变量

### 本地开发 (.dev.vars)

创建 `.dev.vars` 文件（不要提交到 Git）：

```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

将其添加到 `.gitignore`:

```bash
echo ".dev.vars" >> .gitignore
```

### 生产环境

使用 wrangler secrets：

```bash
pnpm exec wrangler secret put DATABASE_URL
pnpm exec wrangler secret put DIRECT_URL
```

---

## 步骤 6: 登录 Cloudflare

```bash
pnpm exec wrangler login
```

浏览器将打开进行授权。

---

## 步骤 7: 构建应用

```bash
# 使用 @opennextjs/cloudflare 构建
pnpm run workers:build
```

这将创建 `.open-next` 目录，包含 Workers 脚本。

---

## 步骤 8: 本地测试（可选）

```bash
# 本地运行 Workers
pnpm run workers:dev
```

访问 `http://localhost:8787` 测试应用。

---

## 步骤 9: 部署到 Cloudflare Workers

```bash
# 首次部署
pnpm run workers:deploy
```

部署成功后，会显示 Worker URL：
```
https://front-app.your-subdomain.workers.dev
```

---

## 步骤 10: 配置自定义域名（可选）

### 通过 Dashboard

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 选择你的 Worker `front-app`
4. 点击 **Triggers** → **Add Custom Domain**
5. 输入域名并保存

### 通过 wrangler.toml

```toml
routes = [
  { pattern = "app.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

重新部署：
```bash
pnpm run workers:deploy
```

---

## 重要：处理 API 代理

你的项目调用了外部 API (`https://api2.yideng.shop/api/analyze`)。

### 选项 1: 创建 API Route 代理

创建 `src/app/api/analyze/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch('https://api2.yideng.shop/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
```

然后修改前端代码：

```typescript
// src/app/(pages)/nutrition/page.tsx
// 将 https://api2.yideng.shop/api/analyze 改为 /api/analyze
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gender: formData.gender,
    age: formData.age,
    height: formData.height,
    weight: formData.weight,
  }),
});
```

### 选项 2: 直接调用（保持现状）

如果不需要隐藏 API 密钥，可以保持现有代码不变。

---

## 数据库连接

你的项目使用 Supabase。确保：

### 1. 使用连接池

在 `src/app/lib/db.ts` 中（如果有的话），使用 `DATABASE_URL`（连接池）：

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false, // Workers 环境不需要持久化
  },
});
```

### 2. 配置环境变量

```bash
pnpm exec wrangler secret put SUPABASE_URL
pnpm exec wrangler secret put SUPABASE_ANON_KEY
```

---

## 持续部署

### 方式 1: GitHub Actions

创建 `.github/workflows/deploy-workers.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main
    paths:
      - 'front-app/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: |
          cd front-app
          pnpm install

      - name: Build
        run: |
          cd front-app
          pnpm run workers:build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
          workingDirectory: front-app
```

配置 GitHub Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

### 方式 2: 手动部署

每次更新后：

```bash
git add .
git commit -m "更新"
pnpm run workers:deploy
```

---

## 监控和调试

### 查看实时日志

```bash
# 查看 Worker 日志
pnpm exec wrangler tail
```

### 查看部署历史

```bash
# 列出部署
pnpm exec wrangler deployments list
```

### 通过 Dashboard

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages** → 选择 Worker
3. 查看 **Metrics** 和 **Logs**

---

## 常见问题

### 问题 1: "nodejs_compat not enabled"

**错误:**
```
Error: The package "crypto" wasn't found on the file system...
```

**解决:**
确保 `wrangler.toml` 中包含：
```toml
compatibility_flags = ["nodejs_compat"]
compatibility_date = "2024-11-12"
```

### 问题 2: 构建失败

**解决:**
```bash
# 清理并重新安装
rm -rf node_modules .next .open-next pnpm-lock.yaml
pnpm install
pnpm run workers:build
```

### 问题 3: 环境变量未生效

**检查:**
```bash
# 列出 secrets
pnpm exec wrangler secret list

# 如果没有，添加
pnpm exec wrangler secret put VARIABLE_NAME
```

### 问题 4: "Cannot find module '@opennextjs/cloudflare'"

**解决:**
```bash
pnpm add -D @opennextjs/cloudflare
```

---

## 性能优化

### 1. 缓存策略

在 API Routes 中添加缓存头：

```typescript
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### 2. 代码分割

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

### 3. 图片优化

使用 Next.js Image 组件：

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={800}
  height={600}
  alt="Description"
  priority={false}
/>
```

---

## 成本说明

### Cloudflare Workers 免费套餐

- ✅ **100,000 请求/天**
- ✅ 每个请求 10ms CPU 时间
- ✅ 128MB 内存
- ✅ 全球边缘网络

### 付费套餐

**Workers Paid ($5/月):**
- ✅ **10,000,000 请求/月**
- ✅ 每个请求 50ms CPU 时间
- ✅ 更高并发

---

## 部署清单

部署前确保：

- [ ] 安装 `@opennextjs/cloudflare`
- [ ] 创建 `wrangler.toml` 配置
- [ ] 配置 `compatibility_flags = ["nodejs_compat"]`
- [ ] 配置 `compatibility_date >= "2024-09-23"`
- [ ] 更新 `package.json` 脚本
- [ ] 创建 `.dev.vars` 用于本地开发
- [ ] 将敏感文件添加到 `.gitignore`
- [ ] 登录 Cloudflare: `pnpm exec wrangler login`
- [ ] 本地测试: `pnpm run workers:build && pnpm run workers:dev`
- [ ] 部署: `pnpm run workers:deploy`
- [ ] 配置生产环境变量（secrets）
- [ ] 验证部署
- [ ] 配置自定义域名（可选）

---

## 推荐：我应该用哪种方式？

### 💡 推荐大多数用户：Cloudflare Pages

使用 `@cloudflare/next-on-pages` 部署到 **Cloudflare Pages**：
- ✅ 更简单的部署流程
- ✅ 自动 Git 集成
- ✅ 支持 SSR 和 API Routes
- ✅ 足够满足大多数需求

**文档:** 参考我之前的 `CLOUDFLARE_WORKERS_DEPLOYMENT.md`（虽然文件名叫 Workers，但实际是部署到 Pages）

### 🔧 高级用户：纯 Cloudflare Workers

使用 `@opennextjs/cloudflare` 部署到 **Workers**：
- ✅ 需要更多 Node.js APIs
- ✅ 需要自定义路由配置
- ✅ 需要底层控制

**文档:** 本文档

---

## 总结

- **Cloudflare Pages** 是推荐的部署方式，底层使用 Workers 处理动态内容
- **纯 Cloudflare Workers** 适合需要更多控制和 Node.js APIs 的场景
- 两种方式都完全支持 SSR、API Routes 和 Server Components

如果不确定，**先尝试 Cloudflare Pages**（使用 `@cloudflare/next-on-pages`）！

---

## 参考资源

- [@opennextjs/cloudflare 文档](https://opennext.js.org/cloudflare)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Next.js 文档](https://nextjs.org/docs)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

祝部署顺利！🚀
