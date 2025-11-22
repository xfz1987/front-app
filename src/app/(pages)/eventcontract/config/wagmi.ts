import { http, createConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Wagmi 配置
export const config = createConfig({
	chains: [sepolia],
	connectors: [
		injected(), // MetaMask 连接器
	],
	transports: {
		[sepolia.id]: http(),
	},
});

// 合约地址 - 请替换为你部署的合约地址
export const CONTRACT_ADDRESS = process.env
	.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

// 'https://api.studio.thegraph.com/query/<your-subgraph-id>/events/version/latest';
export const SUBGRAPH_URL = process.env.NEXT_PUBLIC_SUBGRAPH_URL;
