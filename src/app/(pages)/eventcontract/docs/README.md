# Event Contract DApp

一个功能完整的 Web3 DApp，使用 Wagmi、The Graph 和 Material-UI 构建。

## 功能特性

- ✅ **Wagmi 钱包连接**: 通过 MetaMask 连接到 Sepolia 测试网
- ✅ **智能合约交互**: 读取余额和执行转账操作
- ✅ **实时事件监听**: 监听链上的 Transfer 事件并实时更新
- ✅ **The Graph 集成**: 查询和展示历史链上数据
- ✅ **美观的 UI**: 使用 Material-UI 构建的现代化界面

## 目录结构

```
eventcontract/
├── abi/
│   └── Events.json          # 智能合约 ABI
├── components/
│   ├── WalletConnect.tsx    # 钱包连接组件
│   ├── ContractInteraction.tsx  # 合约交互组件
│   ├── EventListener.tsx    # 事件监听组件
│   └── SubgraphData.tsx     # The Graph 数据展示组件
├── config/
│   └── wagmi.ts            # Wagmi 和合约配置
├── hooks/
│   ├── useContract.ts      # 合约交互 hooks
│   └── useSubgraph.ts      # The Graph 查询 hooks
├── providers/
│   └── Web3Provider.tsx    # Web3 Provider 封装
└── page.tsx                # 主页面
```

## 配置说明

### 1. 更新合约地址

编辑 `config/wagmi.ts` 文件，将合约地址替换为你部署的合约地址：

```typescript
export const CONTRACT_ADDRESS = '0xYourContractAddressHere' as `0x${string}`;
```

### 2. 配置 The Graph Subgraph

同样在 `config/wagmi.ts` 中，更新 Subgraph URL：

```typescript
export const SUBGRAPH_URL =
  'https://api.studio.thegraph.com/query/<your-subgraph-id>/events/version/latest';
```

### 3. The Graph Subgraph Schema 示例

你的 subgraph 需要索引 Transfer 事件。以下是示例 schema：

```graphql
type Transfer @entity {
  id: ID!
  from: Bytes!
  to: Bytes!
  value: BigInt!
  blockNumber: BigInt!
  blockTimestamp: BigInt!
  transactionHash: Bytes!
}
```

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问页面

打开浏览器访问 `http://localhost:3000/eventcontract`

### 4. 连接钱包

- 点击"连接钱包"按钮
- 在 MetaMask 中确认连接
- 确保你的钱包连接到 Sepolia 测试网

### 5. 使用功能

#### 查看余额
- 连接钱包后自动显示你的余额

#### 发起转账
1. 输入接收地址（0x...）
2. 输入转账金额（ETH）
3. 点击"发送转账"
4. 在 MetaMask 中确认交易

#### 查看实时事件
- 转账完成后，事件会实时显示在"实时事件监听"卡片中

#### 查看历史记录
- "The Graph 链上数据"卡片显示所有历史转账记录
- 切换到"我的转账记录"标签查看与你相关的转账

## 技术栈

- **Next.js 16**: React 框架
- **Wagmi**: Web3 React Hooks
- **Viem**: Ethereum 交互库
- **@tanstack/react-query**: 数据获取和状态管理
- **Material-UI**: UI 组件库
- **The Graph**: 链上数据索引和查询
- **TypeScript**: 类型安全

## 合约说明

当前合约包含以下功能：

### 读取函数
- `_balances(address)`: 查询地址余额

### 写入函数
- `_transfer(from, to, amount)`: 执行转账操作

### 事件
- `Transfer(address indexed _from, address indexed _to, uint256 _value)`: 转账事件

## 开发说明

### 添加新功能

1. 如果需要调用新的合约函数，在 `hooks/useContract.ts` 中添加新的 hook
2. 如果需要新的 Graph 查询，在 `hooks/useSubgraph.ts` 中添加查询
3. 创建对应的 UI 组件在 `components/` 目录下

### 切换网络

编辑 `config/wagmi.ts`，修改 chains 配置：

```typescript
import { mainnet, sepolia, goerli } from 'wagmi/chains';

export const config = createConfig({
  chains: [sepolia, goerli], // 添加你需要的网络
  // ...
});
```

## 故障排查

### 钱包连接失败
- 确保安装了 MetaMask 浏览器扩展
- 确保 MetaMask 连接到 Sepolia 测试网

### 交易失败
- 确保钱包有足够的 Sepolia ETH（用于 gas）
- 检查合约地址是否正确

### The Graph 数据不显示
- 确保 Subgraph URL 配置正确
- 确保 Subgraph 已经部署并同步完成
- 检查浏览器控制台是否有错误信息

### 事件监听不工作
- 确保合约地址正确
- 确保你连接到正确的网络
- 刷新页面重新连接钱包

## 获取测试币

访问 Sepolia 水龙头获取测试 ETH：
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia

## License

MIT
