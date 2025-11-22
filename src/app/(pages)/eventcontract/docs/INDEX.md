# Event Contract DApp - 文档索引

欢迎来到 Event Contract DApp 项目！这是一个完整的 Web3 去中心化应用示例。

## 📚 文档导航

### 🚀 快速开始

1. **[INSTALLATION.md](./INSTALLATION.md)** - 安装指南
   - 依赖安装
   - 环境配置
   - 常见问题解决

2. **[QUICKSTART.md](./QUICKSTART.md)** - 5分钟快速体验
   - 最快的上手方式
   - 基本功能演示
   - 故障快速排查

### 📖 完整文档

3. **[README.md](./README.md)** - 完整项目文档
   - 详细功能介绍
   - 技术栈说明
   - 使用方法
   - 开发指南

4. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - 项目架构概览
   - 项目结构
   - 数据流程
   - 设计模式
   - 扩展建议

### 🔧 The Graph 集成

5. **[subgraph-example/README.md](./subgraph-example/README.md)** - Subgraph 部署指南
   - Subgraph 配置
   - 部署步骤
   - 测试查询
   - 故障排查

## 📁 项目文件结构

```
eventcontract/
│
├── 📄 文档文件
│   ├── INDEX.md              # 本文件 - 文档索引
│   ├── INSTALLATION.md       # 安装指南
│   ├── QUICKSTART.md         # 快速开始
│   ├── README.md             # 完整文档
│   └── PROJECT_OVERVIEW.md   # 项目概览
│
├── 📁 核心代码
│   ├── page.tsx              # 主页面
│   ├── components/           # React 组件
│   ├── hooks/                # 自定义 Hooks
│   ├── providers/            # Context Providers
│   ├── config/               # 配置文件
│   ├── types/                # TypeScript 类型
│   └── abi/                  # 合约 ABI
│
└── 📁 示例配置
    ├── subgraph-example/     # The Graph 示例
    ├── config/example.env    # 环境变量示例
    └── .env.example          # 环境变量模板
```

## 🎯 阅读路径推荐

### 路径 1: 新手快速上手

适合：第一次接触 Web3 开发的开发者

1. 先看 [INSTALLATION.md](./INSTALLATION.md) 完成安装
2. 再看 [QUICKSTART.md](./QUICKSTART.md) 快速体验
3. 遇到问题时查阅对应文档的故障排查部分

### 路径 2: 深入学习

适合：想要理解项目架构和最佳实践的开发者

1. 阅读 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) 理解整体架构
2. 阅读 [README.md](./README.md) 了解详细功能
3. 查看源码，从 `page.tsx` 开始
4. 学习 The Graph 集成：[subgraph-example/README.md](./subgraph-example/README.md)

### 路径 3: 二次开发

适合：基于本项目进行定制开发的开发者

1. 快速浏览 [QUICKSTART.md](./QUICKSTART.md) 了解功能
2. 深入阅读 [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) 的扩展建议部分
3. 根据需求修改对应的组件和配置
4. 参考 [README.md](./README.md) 的开发说明部分

## 🔑 核心概念

### Web3 技术栈

- **Wagmi**: Web3 React Hooks 库，简化以太坊交互
- **Viem**: 轻量级、类型安全的以太坊库
- **The Graph**: 区块链数据索引和查询协议
- **MetaMask**: 浏览器钱包扩展

### 主要功能模块

1. **钱包管理** (`WalletConnect.tsx`)
   - 连接/断开钱包
   - 显示账户信息

2. **合约交互** (`ContractInteraction.tsx`)
   - 读取链上状态
   - 执行交易

3. **事件监听** (`EventListener.tsx`)
   - 实时监听链上事件
   - 显示事件详情

4. **数据查询** (`SubgraphData.tsx`)
   - The Graph 数据查询
   - 历史记录展示

## 📊 技术亮点

### 1. 类型安全
- 完整的 TypeScript 支持
- Viem 提供的严格类型检查
- 自定义类型定义

### 2. 用户体验
- 实时状态更新
- 友好的错误提示
- 加载状态指示
- 响应式设计

### 3. 性能优化
- React Query 缓存
- 智能数据刷新
- 组件懒加载

### 4. 可维护性
- 模块化架构
- 清晰的代码组织
- 完善的文档

## 🛠️ 配置要点

### 必须配置

1. **合约地址** (`config/wagmi.ts`)
   ```typescript
   export const CONTRACT_ADDRESS = '0xYourAddress' as `0x${string}`;
   ```

### 可选配置

2. **The Graph URL** (`config/wagmi.ts`)
   ```typescript
   export const SUBGRAPH_URL = 'https://...';
   ```

3. **RPC 端点** (使用默认或自定义)
   ```typescript
   import { http } from 'wagmi';

   const transport = http('https://your-rpc-url');
   ```

## 🔗 相关资源

### 官方文档

- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [The Graph Documentation](https://thegraph.com/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Material-UI Documentation](https://mui.com/)

### 学习资源

- [Ethereum.org Developer Portal](https://ethereum.org/developers)
- [Web3 University](https://www.web3.university/)
- [The Graph Academy](https://thegraph.academy/)

### 社区

- [Wagmi GitHub](https://github.com/wevm/wagmi)
- [Viem GitHub](https://github.com/wevm/viem)
- [The Graph Discord](https://thegraph.com/discord)

## ⚡ 快捷命令

```bash
# 安装依赖
npm install --legacy-peer-deps

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 类型检查
npm run lint

# 清除缓存并重新安装
rm -rf node_modules .next && npm install --legacy-peer-deps
```

## 📮 反馈和支持

遇到问题？有建议？

1. 查看对应文档的故障排查部分
2. 检查浏览器控制台的错误信息
3. 搜索相关 GitHub Issues
4. 查阅官方文档

## 🎓 学习建议

### 初学者

1. 先理解区块链和以太坊基础概念
2. 学习 React 和 TypeScript 基础
3. 了解智能合约的基本概念
4. 动手运行和修改这个项目

### 进阶开发者

1. 深入研究 Wagmi 和 Viem 的 API
2. 学习 The Graph 的索引和查询机制
3. 探索更复杂的合约交互模式
4. 优化性能和用户体验

### 架构师

1. 研究 Web3 应用的最佳实践
2. 设计可扩展的 DApp 架构
3. 考虑安全性和去中心化程度
4. 探索多链和跨链解决方案

## 🚀 下一步行动

现在你应该：

1. ✅ 完成安装：参考 [INSTALLATION.md](./INSTALLATION.md)
2. ✅ 快速体验：跟随 [QUICKSTART.md](./QUICKSTART.md)
3. ✅ 深入学习：阅读 [README.md](./README.md)
4. ✅ 开始开发：基于这个项目进行定制

## 📝 版本信息

- **版本**: 1.0.0
- **最后更新**: 2024
- **兼容性**:
  - Node.js: ≥ 18.0.0
  - Next.js: 16.x
  - Wagmi: 2.x
  - Viem: 2.x

---

**Happy Coding! 🎉**

如果这个项目对你有帮助，别忘了给个星标！⭐
