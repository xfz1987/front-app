# Cloudflare Pages 部署文档

本文档将指导你如何将 front-app (Next.js 项目) 部署到 Cloudflare Pages。

## 前置准备

### 1. 确保已安装必要工具
```bash
# 检查 Node.js 版本 (推荐 18.x 或更高)
node --version

# 检查 pnpm (项目使用 pnpm)
pnpm --version
```

### 2. Cloudflare 账号
- 注册 Cloudflare 账号: https://dash.cloudflare.com/sign-up
- 登录到 Cloudflare Dashboard

## 部署方式

Cloudflare Pages 支持两种部署方式：
1. **通过 Git 集成** (推荐) - 自动部署
2. **通过 Wrangler CLI** - 手动部署

---

## 方式一：通过 Git 集成部署 (推荐)

### 步骤 1: 准备 Git 仓库

1. 确保你的代码已经推送到 GitHub/GitLab/Bitbucket:
```bash
cd /Users/autonomic/work/AI/AI-ST/code/xfz-next-ai/front-app

# 检查 Git 状态
git status

# 如果有未提交的更改，先提交
git add .
git commit -m "准备部署到 Cloudflare Pages"

# 推送到远程仓库
git push origin main  # 或你的主分支名称
```

### 步骤 2: 在 Cloudflare Dashboard 创建项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 标签
5. 点击 **Connect to Git**

### 步骤 3: 连接 Git 仓库

1. 选择你的 Git 提供商 (GitHub/GitLab/Bitbucket)
2. 授权 Cloudflare 访问你的仓库
3. 选择包含 `front-app` 的仓库
4. 点击 **Begin setup**

### 步骤 4: 配置构建设置

在 **Set up builds and deployments** 页面，配置如下：

**项目名称:**
```
front-app
```
或者你想要的任何名称

**生产分支:**
```
main
```
或你的主分支名称

**框架预设:**
```
Next.js
```

**构建配置:**

| 配置项 | 值 |
|--------|-----|
| Build command | `pnpm run build` |
| Build output directory | `.next` |
| Root directory | `front-app` (如果仓库根目录不是项目根目录) |

**环境变量 (Environment variables):**

点击 **Add variable** 添加以下环境变量：

```
DATABASE_URL=你的数据库连接字符串
DIRECT_URL=你的直连数据库 URL
```

**重要提示:**
- 不要在这里添加敏感信息到公开仓库
- 生产环境的环境变量应该在 Cloudflare Dashboard 中配置

### 步骤 5: 开始部署

1. 点击 **Save and Deploy**
2. Cloudflare 将自动：
   - 克隆你的仓库
   - 安装依赖
   - 运行构建命令
   - 部署到 Cloudflare 网络

### 步骤 6: 查看部署结果

- 部署完成后，你会看到一个类似 `https://front-app.pages.dev` 的 URL
- 点击该 URL 即可访问你的应用

### 步骤 7: 配置自定义域名 (可选)

1. 在项目页面，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. 按照提示配置 DNS 记录

---

## 方式二：通过 Wrangler CLI 部署

项目中已经安装了 `wrangler`，可以使用命令行直接部署。

### 步骤 1: 登录 Cloudflare

```bash
cd /Users/autonomic/work/AI/AI-ST/code/xfz-next-ai/front-app

# 使用 wrangler 登录
pnpm exec wrangler login
```

这将打开浏览器进行授权。

### 步骤 2: 配置 Next.js 兼容 Cloudflare

Next.js 需要适配器才能在 Cloudflare Pages 上运行。需要安装 `@cloudflare/next-on-pages`:

```bash
pnpm add -D @cloudflare/next-on-pages
```

### 步骤 3: 更新 package.json 脚本

在 `package.json` 的 `scripts` 中添加：

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "lint": "eslint",
    "pages:build": "pnpm next-on-pages",
    "pages:deploy": "pnpm pages:build && wrangler pages deploy .vercel/output/static",
    "pages:dev": "pnpm next-on-pages --watch"
  }
}
```

### 步骤 4: 创建 wrangler.toml 配置文件

在项目根目录创建 `wrangler.toml`:

```toml
name = "front-app"
compatibility_date = "2024-11-12"
pages_build_output_dir = ".vercel/output/static"
```

### 步骤 5: 构建项目

```bash
# 使用适配器构建
pnpm run pages:build
```

### 步骤 6: 部署到 Cloudflare Pages

```bash
# 首次部署
pnpm exec wrangler pages deploy .vercel/output/static --project-name=front-app

# 或使用自定义脚本
pnpm run pages:deploy
```

### 步骤 7: 配置环境变量

```bash
# 添加生产环境变量
pnpm exec wrangler pages secret put DATABASE_URL --project-name=front-app
pnpm exec wrangler pages secret put DIRECT_URL --project-name=front-app
```

按提示输入对应的值。

---

## 重要配置说明

### 1. 环境变量管理

**开发环境 (`.env.local`):**
```bash
DATABASE_URL="你的开发数据库 URL"
DIRECT_URL="你的开发直连 URL"
```

**生产环境:**
- 在 Cloudflare Dashboard 中配置
- 或使用 `wrangler pages secret put` 命令

### 2. Next.js 配置注意事项

当前 `next.config.ts` 配置基本兼容 Cloudflare，但注意：

- **图片优化**: Cloudflare Pages 支持 Next.js 图片优化
- **React Compiler**: 已启用 `reactCompiler: true`
- **Remote Patterns**: 已配置允许所有 HTTPS 图片源

### 3. 不支持的 Next.js 功能

Cloudflare Pages 对某些 Next.js 功能有限制：

- ❌ `getServerSideProps` (使用 App Router 代替)
- ❌ `getStaticProps` with `revalidate` (使用 `export const revalidate`)
- ❌ Middleware 中的某些 Node.js APIs
- ✅ App Router (完全支持)
- ✅ Server Components
- ✅ API Routes

---

## 常见问题排查

### 问题 1: 构建失败

**检查构建日志:**
```bash
# 本地测试构建
pnpm run build
```

**常见原因:**
- Node.js 版本不兼容
- 依赖安装失败
- TypeScript 类型错误

### 问题 2: 环境变量未生效

**解决方案:**
1. 确认在 Cloudflare Dashboard 中正确配置
2. 重新部署项目
3. 检查变量名拼写

### 问题 3: 图片加载失败

**检查:**
- 确认图片 URL 在 `remotePatterns` 中
- 检查图片源是否支持 HTTPS

### 问题 4: 运行时错误

**检查:**
- Cloudflare 兼容性
- 避免使用 Node.js 专有 APIs
- 查看 Cloudflare Pages 函数日志

---

## 性能优化建议

### 1. 启用 Cloudflare 缓存

在 Cloudflare Dashboard 中配置:
- **Caching** → 设置合适的缓存规则
- 静态资源自动缓存在边缘节点

### 2. 启用 Cloudflare CDN

- 自动全球分发
- 自动 HTTPS
- 自动 Brotli/Gzip 压缩

### 3. 代码优化

```typescript
// 使用动态导入减小初始包大小
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />
})

// 启用图片优化
import Image from 'next/image'
<Image src="..." width={500} height={300} alt="..." />
```

---

## 持续集成/部署 (CI/CD)

### 自动部署设置

通过 Git 集成，每次推送代码到指定分支时，Cloudflare 会自动：
1. 检测代码变更
2. 触发构建
3. 运行测试（如果配置）
4. 部署到生产/预览环境

### 预览部署

- 每个 Pull Request 自动创建预览部署
- 预览 URL: `https://<commit-hash>.front-app.pages.dev`
- 不影响生产环境

---

## 监控和日志

### 查看部署日志

1. 进入 **Workers & Pages** → 选择你的项目
2. 点击 **Deployments** 查看所有部署
3. 点击具体部署查看详细日志

### 实时日志

```bash
# 使用 wrangler 查看实时日志
pnpm exec wrangler pages deployment tail
```

### Analytics

- Cloudflare 自动提供 Web Analytics
- 查看访问量、性能指标
- 免费且隐私友好

---

## 回滚部署

### 通过 Dashboard 回滚

1. 进入项目 **Deployments** 页面
2. 找到之前成功的部署
3. 点击 **Rollback to this deployment**

### 通过 Git 回滚

```bash
# 回滚到之前的 commit
git revert <commit-hash>
git push origin main
```

---

## 成本说明

**Cloudflare Pages 免费套餐包括:**
- ✅ 无限请求
- ✅ 无限带宽
- ✅ 500 次构建/月
- ✅ 1 次并发构建
- ✅ 自定义域名

**付费套餐 (Pro):**
- 更多并发构建
- 更快构建速度
- 高级分析

大多数项目免费套餐完全够用。

---

## 参考资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Next.js 文档](https://nextjs.org/docs)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)

---

## 下一步

部署完成后，建议：

1. ✅ 配置自定义域名
2. ✅ 设置 Web Analytics
3. ✅ 配置缓存规则
4. ✅ 启用 Bot Protection
5. ✅ 配置 CI/CD 工作流
6. ✅ 设置监控告警

---

## 支持

如果遇到问题：
1. 查看 [Cloudflare Community](https://community.cloudflare.com/)
2. 查看 [Cloudflare Status](https://www.cloudflarestatus.com/)
3. 联系 Cloudflare Support

祝部署顺利！🚀
