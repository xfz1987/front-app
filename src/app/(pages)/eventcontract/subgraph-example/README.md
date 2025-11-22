# The Graph Subgraph 配置示例

这个目录包含了为 Events 合约创建 The Graph Subgraph 所需的配置文件示例。

## 文件说明

- `schema.graphql`: 定义 GraphQL schema
- `subgraph.yaml`: Subgraph 配置文件
- `events.ts`: 事件处理器（AssemblyScript）

## 部署步骤

### 1. 安装 Graph CLI

```bash
npm install -g @graphprotocol/graph-cli
```

### 2. 创建 Subgraph 项目

```bash
graph init --studio events-subgraph
```

### 3. 复制配置文件

将本目录中的文件复制到你的 subgraph 项目中：

```bash
cp schema.graphql your-subgraph-project/
cp subgraph.yaml your-subgraph-project/
cp events.ts your-subgraph-project/src/
```

### 4. 更新配置

编辑 `subgraph.yaml`，更新以下内容：

- `address`: 你的合约地址
- `startBlock`: 合约部署的区块号

### 5. 复制 ABI

将合约的 ABI 文件复制到 subgraph 项目：

```bash
mkdir -p your-subgraph-project/abis
cp ../abi/Events.json your-subgraph-project/abis/
```

### 6. 生成代码

```bash
cd your-subgraph-project
graph codegen
```

### 7. 构建 Subgraph

```bash
graph build
```

### 8. 部署到 The Graph Studio

首先，访问 [The Graph Studio](https://thegraph.com/studio/) 创建一个新的 subgraph。

获取你的 deploy key：

```bash
graph auth --studio <DEPLOY_KEY>
```

部署 subgraph：

```bash
graph deploy --studio events-subgraph
```

### 9. 等待同步

部署后，subgraph 需要一些时间来索引区块链数据。你可以在 The Graph Studio 中查看同步进度。

### 10. 获取查询端点

同步完成后，你会得到一个查询端点 URL，格式如下：

```
https://api.studio.thegraph.com/query/<subgraph-id>/events-subgraph/version/latest
```

将这个 URL 更新到前端项目的 `config/wagmi.ts` 文件中。

## 测试查询

你可以在 The Graph Studio 的 Playground 中测试查询：

```graphql
{
  transfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    from
    to
    value
    blockNumber
    blockTimestamp
    transactionHash
  }
}
```

## 常见问题

### Q: 如何查找合约部署的区块号？

A: 在 [Sepolia Etherscan](https://sepolia.etherscan.io/) 中搜索你的合约地址，查看 "Contract Creation" 交易，其中包含区块号。

### Q: Subgraph 同步很慢怎么办？

A: 设置正确的 `startBlock` 可以加快同步速度，因为 subgraph 不需要从区块 0 开始索引。

### Q: 如何更新 Subgraph？

A: 修改配置或代码后，运行：

```bash
graph codegen
graph build
graph deploy --studio events-subgraph
```

会创建一个新版本，你可以选择发布新版本。

## 更多资源

- [The Graph 文档](https://thegraph.com/docs/)
- [AssemblyScript 文档](https://www.assemblyscript.org/)
- [Graph CLI 文档](https://github.com/graphprotocol/graph-cli)
