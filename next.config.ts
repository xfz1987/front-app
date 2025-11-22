import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	reactCompiler: true,
	// crossOrigin: 'anonymous', // 在组件生成的所有<script>标签中，定义如何处理跨域请求, next/script
	// distDir: 'build',
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*',
			},
		],
		// 使用云服务提供商来优化图像，而不是使用 Next.js 内置的图像优化 API
		// loader: 'custom',
		// loaderFile: './my/image/loader.js', // (看文档)必须指向 Next.js 应用程序根目录下的一个文件。该文件必须导出一个返回字符串的默认函数
	},
	webpack: (config) => {
		config.resolve.fallback = { fs: false, net: false, tls: false };
		return config;
	},
	// 如果您要为环境的每个阶段重新构建，则需要生成一个一致的构建 ID 以便在容器之间使用
	// generateBuildId: async () => {
	//   // This could be anything, using the latest git hash
	//   return process.env.GIT_HASH!;
	// },
	// generateEtags: false,
	// webpack: (config, { isServer }) => {
	// 	// 忽略不使用的 wallet 连接器依赖
	// 	config.resolve.fallback = {
	// 		...config.resolve.fallback,
	// 		'@gemini-wallet/core': false,
	// 		'@base-org/account': false,
	// 		'@coinbase/wallet-sdk': false,
	// 	};

	// 	// 对于客户端构建，使用 IgnorePlugin 来忽略这些模块
	// 	if (!isServer) {
	// 		config.plugins = config.plugins || [];
	// 		const webpack = require('webpack');
	// 		config.plugins.push(
	// 			new webpack.IgnorePlugin({
	// 				resourceRegExp:
	// 					/@gemini-wallet\/core|@base-org\/account|@coinbase\/wallet-sdk/,
	// 			})
	// 		);
	// 	}

	// 	return config;
	// },
};

export default nextConfig;
