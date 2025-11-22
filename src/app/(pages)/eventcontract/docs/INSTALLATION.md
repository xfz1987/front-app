# 安装指南

## 🔧 前置要求

确保你的系统已安装以下工具：

- **Node.js**: v18.0.0 或更高版本
- **npm**: v9.0.0 或更高版本（或使用 pnpm/yarn）
- **MetaMask**: 浏览器扩展

## 📦 依赖安装

### 方法 1: 标准安装（推荐）

```bash
cd /path/to/front-app
npm install
```

### 方法 2: 如果遇到依赖冲突

```bash
npm install --legacy-peer-deps
```

### 方法 3: 强制安装

```bash
npm install --force
```

### 方法 4: 使用 pnpm（推荐用于大型项目）

```bash
# 安装 pnpm（如果还没有）
npm install -g pnpm

# 使用 pnpm 安装依赖
pnpm install
```

## 🔍 验证安装

安装完成后，验证关键依赖：

```bash
npm list wagmi viem @tanstack/react-query
```

你应该看到类似的输出：

```
front-app@0.1.0
├── @tanstack/react-query@5.76.0
├── viem@2.21.40
└── wagmi@2.19.5
```

## ⚙️ 配置

### 1. 更新合约配置

编辑 `config/wagmi.ts`：

```typescript
// 替换为你的合约地址
export const CONTRACT_ADDRESS = '0xYourContractAddress' as `0x${string}`;

// 替换为你的 Subgraph URL
export const SUBGRAPH_URL = 'https://api.studio.thegraph.com/query/...';
```

### 2. 环境变量（可选）

如果你想使用环境变量，创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

然后编辑 `.env.local`：

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_SUBGRAPH_URL=https://api.studio.thegraph.com/query/...
```

并更新 `config/wagmi.ts` 以使用环境变量：

```typescript
export const CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x...') as `0x${string}`;

export const SUBGRAPH_URL =
  process.env.NEXT_PUBLIC_SUBGRAPH_URL || 'https://...';
```

## 🚀 启动项目

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:3000/eventcontract`

### 生产构建

```bash
npm run build
npm run start
```

### 类型检查

```bash
npm run lint
```

## 🐛 常见问题

### 问题 1: 依赖版本冲突

**错误信息**:
```
ERESOLVE unable to resolve dependency tree
```

**解决方案**:
```bash
npm install --legacy-peer-deps
# 或者
npm install --force
```

### 问题 2: TypeScript 类型错误

**错误信息**:
```
Cannot find module 'wagmi' or its corresponding type declarations
```

**解决方案**:
```bash
# 删除 node_modules 和 lock 文件
rm -rf node_modules package-lock.json

# 重新安装
npm install --legacy-peer-deps
```

### 问题 3: Next.js 编译错误

**错误信息**:
```
Module not found: Can't resolve 'wagmi'
```

**解决方案**:
```bash
# 清除 Next.js 缓存
rm -rf .next

# 重新启动
npm run dev
```

### 问题 4: MetaMask 连接问题

**症状**: 点击连接钱包没有反应

**解决方案**:
1. 确保 MetaMask 已安装并解锁
2. 刷新页面
3. 检查浏览器控制台的错误信息
4. 尝试在隐身模式下测试

### 问题 5: The Graph 查询失败

**错误信息**:
```
Failed to fetch subgraph data
```

**解决方案**:
1. 检查 SUBGRAPH_URL 是否正确
2. 确认 Subgraph 已部署并同步完成
3. 在 The Graph Studio 中测试查询
4. 如果暂时不用 The Graph，可以注释相关代码

## 📊 依赖说明

### 核心 Web3 依赖

- **wagmi** (^2.19.5): Web3 React Hooks
- **viem** (^2.21.40): 以太坊交互库
- **@tanstack/react-query** (^5.76.0): 数据获取和状态管理

### 为什么需要这些特定版本？

- Wagmi 2.x 是当前稳定版本，提供了最好的 TypeScript 支持
- Viem 2.x 是 Wagmi 2.x 的对等依赖
- TanStack Query 5.x 提供了强大的缓存和数据同步功能

### 可选依赖

如果你想使用 RainbowKit（更丰富的钱包连接 UI）：

```bash
npm install @rainbow-me/rainbowkit
```

然后更新配置以使用 RainbowKit 的 Provider。

## 🔄 更新依赖

定期更新依赖以获取最新功能和安全补丁：

```bash
# 检查过时的包
npm outdated

# 更新所有依赖到最新版本
npm update

# 更新特定包
npm update wagmi viem @tanstack/react-query
```

## 🧹 清理和重置

如果遇到无法解决的问题，尝试完全重置：

```bash
# 删除所有安装的包和缓存
rm -rf node_modules package-lock.json .next

# 清除 npm 缓存
npm cache clean --force

# 重新安装
npm install --legacy-peer-deps

# 重新启动
npm run dev
```

## 📝 安装检查清单

安装完成后，确认以下项目：

- [ ] `node_modules/wagmi` 存在
- [ ] `node_modules/viem` 存在
- [ ] `node_modules/@tanstack/react-query` 存在
- [ ] `npm run dev` 可以正常启动
- [ ] 访问 `/eventcontract` 页面能正常显示
- [ ] 浏览器控制台没有错误
- [ ] MetaMask 连接功能正常

## 🆘 获取帮助

如果以上方法都无法解决问题：

1. 检查 Node.js 版本：`node --version`（建议 v18+）
2. 检查 npm 版本：`npm --version`（建议 v9+）
3. 查看完整的错误日志
4. 搜索 GitHub Issues：
   - [Wagmi Issues](https://github.com/wevm/wagmi/issues)
   - [Viem Issues](https://github.com/wevm/viem/issues)
5. 查阅官方文档：
   - [Wagmi Docs](https://wagmi.sh/)
   - [Viem Docs](https://viem.sh/)

## 🎉 安装成功！

如果所有检查项都通过，恭喜你！现在可以：

1. 阅读 [QUICKSTART.md](./QUICKSTART.md) 快速体验功能
2. 查看 [README.md](./README.md) 了解详细文档
3. 浏览 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) 理解项目架构
4. 开始自定义和扩展你的 DApp！

祝你开发顺利！🚀
