# Next.js 部署到 Cloudflare Pages 文档

本文档指导你如何将 Next.js 项目（支持 SSR）部署到 **Cloudflare Pages**。

## 什么是 Cloudflare Pages？

Cloudflare Pages 是一个 JAMstack 平台，用于部署静态和全栈应用：
- ✅ 支持完整的 **SSR**（服务端渲染）
- ✅ 支持 **API Routes** 和动态路由
- ✅ 支持 **Server Components**
- ✅ 底层自动使用 Cloudflare Workers 处理动态内容
- ✅ 全球 CDN 边缘网络
- ✅ 简单的 Git 集成和自动部署

**核心优势：** 静态资源从 CDN 提供，动态功能自动运行在 Workers 上，无需手动配置！

---

## 前置准备

### 1. 确保已安装必要工具

```bash
cd /Users/autonomic/work/AI/AI-ST/code/xfz-next-ai/front-app

# 检查 Node.js 版本 (推荐 18.x 或更高)
node --version

# 检查 pnpm
pnpm --version

# 检查 wrangler (项目已安装)
pnpm exec wrangler --version
```

### 2. Cloudflare 账号

- 注册 Cloudflare 账号: https://dash.cloudflare.com/sign-up
- 登录到 Cloudflare Dashboard

---

## 部署方式选择

Cloudflare Pages 提供两种部署方式：

### 方式一：Git 集成部署（推荐）⭐
- ✅ 最简单的部署方式
- ✅ 推送代码自动部署
- ✅ 每个 PR 自动创建预览环境
- ✅ 适合团队协作

### 方式二：Wrangler CLI 部署
- ✅ 适合快速测试
- ✅ 更灵活的部署控制
- ✅ 无需 Git 仓库

---

## 方式一：通过 Git 集成部署（推荐）

这是最简单、最常用的部署方式。

### 步骤 1: 安装 @cloudflare/next-on-pages

```bash
cd /Users/autonomic/work/AI/AI-ST/code/xfz-next-ai/front-app

# 安装适配器
pnpm add -D @cloudflare/next-on-pages vercel
```

**说明：**
- `@cloudflare/next-on-pages`: Cloudflare 官方的 Next.js 适配器
- `vercel`: 需要作为依赖（适配器使用 Vercel Build Output API）

### 步骤 2: 更新 package.json

在 `scripts` 中添加构建命令：

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "eslint",
    "pages:build": "npx @cloudflare/next-on-pages",
    "preview": "npm run pages:build && wrangler pages dev",
    "deploy": "npm run pages:build && wrangler pages deploy"
  }
}
```

### 步骤 3: 配置 next.config.ts

你的配置基本已经兼容，但建议确认：

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

  // Cloudflare Pages 兼容配置
  // 如果有特定的 Server Actions 或 API Routes
  // 确保它们使用 Edge Runtime
};

export default nextConfig;
```

### 步骤 4: 准备 Git 仓库

确保你的代码已推送到 GitHub、GitLab 或 Bitbucket：

```bash
# 检查当前状态
git status

# 如果有未提交的更改
git add .
git commit -m "准备部署到 Cloudflare Pages"

# 推送到远程仓库（根据你的分支名调整）
git push origin main
```

如果还没有 Git 仓库：

```bash
# 初始化仓库
git init
git add .
git commit -m "初始提交"

# 添加远程仓库（替换为你的仓库 URL）
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 步骤 5: 在 Cloudflare Dashboard 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **Workers & Pages**
3. 点击 **Create application** 按钮
4. 选择 **Pages** 标签
5. 点击 **Connect to Git**

### 步骤 6: 连接 Git 仓库

1. 选择你的 Git 提供商：
   - GitHub
   - GitLab
   - Bitbucket

2. 点击 **Connect** 并授权 Cloudflare 访问你的仓库

3. 从列表中选择你的仓库（包含 `front-app` 的仓库）

4. 点击 **Begin setup**

### 步骤 7: 配置构建设置

在 **Set up builds and deployments** 页面配置：

#### 基本设置

| 配置项 | 值 |
|--------|-----|
| **项目名称** | `front-app` (或你想要的名称) |
| **生产分支** | `main` (或你的主分支名) |
| **框架预设** | `Next.js (Static HTML Export)` |

#### 构建设置

| 配置项 | 值 |
|--------|-----|
| **Build command** | `pnpm run pages:build` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory (optional)** | `front-app` (如果仓库根目录不是项目根) |

#### 环境变量

点击 **Add variable** 添加：

```
DATABASE_URL=你的生产数据库连接池 URL
DIRECT_URL=你的生产数据库直连 URL
```

**重要：** 不要在公开仓库中存储这些敏感信息！

### 步骤 8: 开始部署

1. 点击 **Save and Deploy**

2. Cloudflare 将自动：
   - 克隆你的 Git 仓库
   - 安装依赖 (`pnpm install`)
   - 运行构建命令 (`pnpm run pages:build`)
   - 部署到全球 CDN

3. 等待部署完成（通常需要 3-5 分钟）

### 步骤 9: 查看部署结果

部署完成后：

1. 你会看到一个部署 URL，类似：
   ```
   https://front-app-xxx.pages.dev
   ```

2. 点击 URL 访问你的应用

3. 检查：
   - ✅ 页面正常加载
   - ✅ SSR 功能正常工作
   - ✅ API 调用成功

### 步骤 10: 配置自定义域名（可选）

1. 在项目页面，点击 **Custom domains** 标签
2. 点击 **Set up a custom domain**
3. 输入你的域名（如 `app.yourdomain.com`）
4. 按照提示配置 DNS：
   - 如果域名在 Cloudflare：自动配置
   - 如果域名在其他服务商：添加 CNAME 记录

---

## 方式二：通过 Wrangler CLI 部署

如果你不想使用 Git 集成，可以通过 CLI 手动部署。

### 步骤 1: 安装依赖（如果还没有）

```bash
cd /Users/autonomic/work/AI/AI-ST/code/xfz-next-ai/front-app

# 安装适配器
pnpm add -D @cloudflare/next-on-pages vercel

# wrangler 已在 devDependencies 中
```

### 步骤 2: 登录 Cloudflare

```bash
pnpm exec wrangler login
```

浏览器会打开进行授权。

### 步骤 3: 创建 wrangler.toml（可选）

在项目根目录创建 `wrangler.toml`：

```toml
name = "front-app"
compatibility_date = "2024-11-12"
pages_build_output_dir = ".vercel/output/static"
```

### 步骤 4: 构建项目

```bash
# 使用适配器构建
pnpm run pages:build
```

这将在 `.vercel/output/static` 目录生成输出。

### 步骤 5: 本地预览（推荐）

在部署前先本地测试：

```bash
# 启动本地 Pages 服务器
pnpm exec wrangler pages dev .vercel/output/static
```

访问 `http://localhost:8788` 测试应用。

### 步骤 6: 部署到 Cloudflare Pages

```bash
# 首次部署
pnpm exec wrangler pages deploy .vercel/output/static --project-name=front-app

# 或使用 package.json 脚本
pnpm run deploy
```

首次部署会提示创建项目：
```
? Create a new project? (Y/n) Y
✔ Enter the name of your new project: front-app
```

部署成功后显示 URL：
```
✨ Deployment complete! Take a peek over at https://front-app.pages.dev
```

### 步骤 7: 配置环境变量

通过 Dashboard 或 CLI 配置：

#### 方式 A: 通过 Dashboard

1. 进入 **Workers & Pages** → 选择项目
2. 点击 **Settings** → **Environment variables**
3. 在 **Production** 环境添加：
   - `DATABASE_URL`
   - `DIRECT_URL`

#### 方式 B: 通过 CLI（使用 secrets）

```bash
# 注意：Pages 项目使用 Dashboard 管理环境变量更方便
# 或者在 wrangler.toml 中配置（不推荐敏感信息）
```

---

## 重要配置说明

### 1. Edge Runtime 配置

如果你有 API Routes 或 Server Actions，建议显式指定 Edge Runtime：

```typescript
// src/app/api/example/route.ts
export const runtime = 'edge';

export async function GET() {
  // Your API logic
}
```

### 2. 环境变量访问

在服务端代码中：

```typescript
// ✅ 正确 - 在服务端组件或 API Routes
const dbUrl = process.env.DATABASE_URL;

// ✅ 正确 - 客户端可访问的变量（必须以 NEXT_PUBLIC_ 开头）
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

在客户端代码中：

```typescript
// ❌ 错误 - 客户端无法访问
const dbUrl = process.env.DATABASE_URL;

// ✅ 正确 - 使用 NEXT_PUBLIC_ 前缀
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 3. 处理外部 API 调用

你的项目调用了 `https://api2.yideng.shop/api/analyze`。

#### 选项 A: 保持现状（客户端调用）

```typescript
// src/app/(pages)/nutrition/page.tsx
const response = await fetch('https://api2.yideng.shop/api/analyze', {
  method: 'POST',
  // ...
});
```

**优点：** 简单，无需修改
**缺点：** API URL 暴露在客户端

#### 选项 B: 创建 API Route 代理（推荐）

创建 `src/app/api/analyze/route.ts`：

```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // 使用 Edge Runtime

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 调用外部 API
    const response = await fetch('https://api2.yideng.shop/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果需要 API Key，从环境变量读取
        // 'Authorization': `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

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
const handleFormSubmit = async (formData: FormData) => {
  setLoading(true);

  try {
    // 改为调用本地 API Route
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

    const data = await response.json();
    // ... 处理响应
  } catch (error) {
    console.error('Error:', error);
    alert('网络错误,请稍后重试');
  } finally {
    setLoading(false);
  }
};
```

**优点：**
- ✅ 隐藏外部 API URL
- ✅ 可以添加认证逻辑
- ✅ 可以添加错误处理和日志
- ✅ 可以实现缓存

### 4. 数据库连接

如果你使用 Supabase 或其他数据库：

```typescript
// src/app/lib/db.ts (示例)
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false, // Edge 环境不需要持久化会话
  },
});
```

确保环境变量已在 Cloudflare Dashboard 配置。

---

## 持续集成/部署（CI/CD）

### 自动部署（Git 集成）

使用 Git 集成后，自动部署流程：

1. **推送到主分支** → 触发生产部署
   ```bash
   git push origin main
   ```

2. **创建 Pull Request** → 自动创建预览部署
   - 预览 URL: `https://<commit-hash>.front-app.pages.dev`
   - 不影响生产环境

3. **合并 PR** → 自动更新生产环境

### 分支预览

Cloudflare Pages 自动为每个分支创建预览：

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 推送到远程
git push origin feature/new-feature
```

自动生成预览 URL：
```
https://feature-new-feature.front-app.pages.dev
```

---

## 监控和调试

### 1. 查看部署日志

#### 通过 Dashboard

1. 进入 **Workers & Pages** → 选择项目
2. 点击 **Deployments** 标签
3. 选择具体的部署查看详细日志

#### 通过 CLI

```bash
# 查看实时日志
pnpm exec wrangler pages deployment tail

# 查看特定项目的日志
pnpm exec wrangler pages deployment tail --project-name=front-app
```

### 2. 实时日志（Functions/API Routes）

```bash
# 实时查看 Functions 日志
pnpm exec wrangler pages deployment tail --project-name=front-app
```

### 3. Analytics

Cloudflare 自动提供 Web Analytics：

1. 进入项目页面
2. 点击 **Analytics** 标签
3. 查看：
   - 访问量统计
   - 地理分布
   - 性能指标（P50、P75、P99 延迟）
   - 带宽使用

### 4. 错误追踪

在代码中添加日志：

```typescript
// API Routes 或 Server Components
console.log('Debug info:', data);
console.error('Error occurred:', error);
```

日志会出现在 `wrangler pages deployment tail` 中。

---

## 性能优化

### 1. 启用缓存

在 API Routes 中添加缓存头：

```typescript
export const runtime = 'edge';

export async function GET() {
  const data = await fetchData();

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

### 2. 图片优化

使用 Next.js Image 组件：

```typescript
import Image from 'next/image';

<Image
  src="/hero.jpg"
  width={1200}
  height={600}
  alt="Hero image"
  priority // 优先加载
  placeholder="blur" // 模糊占位
/>
```

### 3. 代码分割

```typescript
import dynamic from 'next/dynamic';

// 动态导入重型组件
const HealthForm = dynamic(
  () => import('./components/HealthForm'),
  {
    loading: () => <div>Loading...</div>,
    ssr: true, // 如果需要 SSR
  }
);
```

### 4. 使用 Next.js 缓存

```typescript
// 在 layout 或 page 中
export const revalidate = 3600; // 重新验证间隔（秒）

// 或使用 fetch 缓存
const data = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 }
});
```

---

## 常见问题排查

### 问题 1: 构建失败 - "Module not found"

**原因：** 依赖未安装或路径错误

**解决：**
```bash
# 清理并重新安装
rm -rf node_modules .next .vercel pnpm-lock.yaml
pnpm install

# 重新构建
pnpm run pages:build
```

### 问题 2: 部署成功但页面 404

**原因：** 构建输出目录配置错误

**解决：**
- 确认 Build output directory 是 `.vercel/output/static`
- 检查 `pages:build` 命令是否正确执行

### 问题 3: 环境变量未生效

**原因：** 环境变量未配置或配置错误

**解决：**
1. 在 Cloudflare Dashboard 检查环境变量配置
2. 确保变量名拼写正确
3. 重新部署：
   ```bash
   # 通过 Dashboard 点击 "Retry deployment"
   # 或推送新的 commit 触发部署
   ```

### 问题 4: "This site is not yet configured"

**原因：** 部署尚未完成或配置未生效

**解决：**
- 等待 1-2 分钟
- 刷新页面
- 检查部署状态

### 问题 5: API Routes 返回 500 错误

**原因：** Edge Runtime 不支持某些 Node.js APIs

**解决：**
```typescript
// 确保使用 Edge 兼容的 APIs
export const runtime = 'edge';

// 避免使用 Node.js 专有模块
// ❌ import fs from 'fs';
// ❌ import path from 'path';

// ✅ 使用 Web APIs
// ✅ 使用 fetch
```

### 问题 6: 图片加载失败

**原因：** 图片域名未在 `remotePatterns` 中配置

**解决：**
```typescript
// next.config.ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "api2.yideng.shop", // 添加你的图片域名
    },
    {
      protocol: "https",
      hostname: "*.supabase.co", // 支持通配符
    },
  ],
},
```

---

## 回滚部署

### 方式 1: 通过 Dashboard

1. 进入 **Workers & Pages** → 选择项目
2. 点击 **Deployments** 标签
3. 找到之前成功的部署
4. 点击右侧菜单 → **Rollback to this deployment**
5. 确认回滚

### 方式 2: 通过 Git

```bash
# 查看历史
git log --oneline

# 回滚到之前的 commit
git revert <commit-hash>
git push origin main

# 或强制回滚（谨慎使用）
git reset --hard <commit-hash>
git push -f origin main
```

---

## 成本说明

### Cloudflare Pages 免费套餐

- ✅ **无限请求**
- ✅ **无限带宽**
- ✅ **500 次构建/月**
- ✅ **1 次并发构建**
- ✅ **自定义域名**（无限）
- ✅ **预览部署**
- ✅ **Web Analytics**

### 付费套餐（Pages Pro - $20/月）

- ✅ **5,000 次构建/月**
- ✅ **5 次并发构建**
- ✅ **高级分析**
- ✅ **更快构建速度**

**大多数项目免费套餐完全够用！**

---

## 部署清单

在正式部署前，确保：

- [ ] 安装 `@cloudflare/next-on-pages` 和 `vercel`
- [ ] 更新 `package.json` 添加 `pages:build` 脚本
- [ ] 确认 `next.config.ts` 兼容 Cloudflare
- [ ] 代码已推送到 Git 仓库（Git 集成方式）
- [ ] 登录 Cloudflare: `pnpm exec wrangler login`（CLI 方式）
- [ ] 本地测试构建: `pnpm run pages:build`
- [ ] 本地预览: `pnpm exec wrangler pages dev .vercel/output/static`
- [ ] 部署: 通过 Git 推送 或 `pnpm run deploy`
- [ ] 配置环境变量（Dashboard）
- [ ] 验证部署: 访问 `.pages.dev` URL
- [ ] 测试 SSR 和 API Routes
- [ ] 配置自定义域名（可选）
- [ ] 设置监控和告警（可选）

---

## 更新部署

### 使用 Git 集成（自动）

```bash
# 1. 修改代码
# 2. 提交
git add .
git commit -m "更新功能"

# 3. 推送（自动触发部署）
git push origin main
```

### 使用 CLI（手动）

```bash
# 1. 修改代码
# 2. 重新构建和部署
pnpm run deploy
```

---

## 推荐的工作流程

### 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发功能
pnpm dev

# 3. 本地测试生产构建
pnpm run pages:build
pnpm exec wrangler pages dev .vercel/output/static

# 4. 提交并推送
git add .
git commit -m "添加新功能"
git push origin feature/new-feature

# 5. 创建 Pull Request
# Cloudflare 会自动创建预览部署

# 6. 审查和测试预览环境
# 访问 PR 中的预览链接

# 7. 合并到主分支
# 自动部署到生产环境
```

---

## 高级配置

### 1. 自定义构建配置

创建 `.node-version` 指定 Node.js 版本：

```
18.17.0
```

### 2. 配置重定向

创建 `public/_redirects`：

```
# 重定向规则
/old-path /new-path 301
/blog/* https://blog.example.com/:splat 301
```

### 3. 配置 Headers

创建 `public/_headers`：

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/api/*
  Cache-Control: no-store
```

### 4. 函数配置

创建 `functions/_middleware.ts` 用于全局中间件：

```typescript
export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
}) {
  // 添加自定义逻辑
  const response = await context.next();
  return response;
}
```

---

## 参考资源

### 官方文档
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [@cloudflare/next-on-pages](https://github.com/cloudflare/next-on-pages)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

### Next.js 资源
- [Next.js 文档](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Image 优化](https://nextjs.org/docs/app/building-your-application/optimizing/images)

### 社区资源
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Next.js Discord](https://nextjs.org/discord)

---

## 获取帮助

遇到问题时：

1. 查看 [Cloudflare Status](https://www.cloudflarestatus.com/)
2. 搜索 [Community Forum](https://community.cloudflare.com/)
3. 查看 [GitHub Issues](https://github.com/cloudflare/next-on-pages/issues)
4. 联系 [Cloudflare Support](https://support.cloudflare.com/)

---

## 总结

Cloudflare Pages 是部署 Next.js 应用的优秀选择：

✅ **简单易用** - Git 集成，推送即部署
✅ **功能完整** - 完全支持 SSR、API Routes、Server Components
✅ **性能卓越** - 全球 CDN，低延迟
✅ **免费慷慨** - 无限请求和带宽
✅ **开发友好** - 自动预览部署，回滚简单

**推荐使用 Git 集成方式部署，享受全自动 CI/CD！**

---

祝部署顺利！🚀

有问题随时查阅本文档或访问 [Cloudflare 社区](https://community.cloudflare.com/)。
