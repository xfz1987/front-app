import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia, mainnet } from 'wagmi/chains';

// Wagmi 配置
export const config = createConfig({
	chains: [sepolia, mainnet],
	connectors: [
		injected(), // MetaMask 连接器
	],
	transports: {
		// 使用 Alchemy 公共 RPC（更稳定，更高的请求限制）
		[sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/demo'),
		[mainnet.id]: http(),
	},
});

// 合约地址 - 请替换为你部署的合约地址
export const CONTRACT_ADDRESS =
	'0xC00F7C3FF7D22bBA378d767C5E107431e6152E04' as `0x${string}`;

// 'https://api.studio.thegraph.com/query/<your-subgraph-id>/events/version/latest';
// export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL || '';
