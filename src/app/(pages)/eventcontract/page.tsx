'use client';

import { useState, useEffect } from 'react';
import {
	Container,
	Box,
	Typography,
	Grid,
	Paper,
	CircularProgress,
} from '@mui/material';
import { Web3Provider } from './providers/Web3Provider';
import { WalletConnect } from './components/WalletConnect';
import { ContractInteraction } from './components/ContractInteraction';
import { EventListener } from './components/EventListener';
import { SubgraphData } from './components/SubgraphData';
import { useAccount } from 'wagmi';

function EventContractContent() {
	const { isConnected } = useAccount();
	const [isMounted, setIsMounted] = useState(false);

	// 确保只在客户端渲染
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true);
	}, []);

	// 在组件挂载前显示加载状态
	if (!isMounted) {
		return (
			<Container maxWidth='xl' sx={{ py: 4 }}>
				<Box
					display='flex'
					justifyContent='center'
					alignItems='center'
					minHeight='60vh'
				>
					<CircularProgress size={60} />
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth='xl' sx={{ py: 4 }}>
			{/* 钱包连接卡片 */}
			<Box mb={4}>
				<WalletConnect />
			</Box>

			{/* 主要内容区域 */}
			{isConnected ? (
				<>
					{/* 第一行：合约交互和事件监听 */}
					<Grid container spacing={3} mb={3}>
						<Grid size={{ xs: 12, md: 6 }}>
							<ContractInteraction />
						</Grid>
						<Grid size={{ xs: 12, md: 6 }}>
							<EventListener />
						</Grid>
					</Grid>

					{/* 第二行：The Graph 数据展示 */}
					<Grid container spacing={3}>
						<Grid size={{ xs: 12 }}>
							<SubgraphData />
						</Grid>
					</Grid>
				</>
			) : (
				<Paper
					elevation={0}
					sx={{
						py: 8,
						textAlign: 'center',
						background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
					}}
				>
					<Typography variant='h5' fontWeight='bold' gutterBottom>
						欢迎来到 Web3 DApp
					</Typography>
					<Typography variant='body1' color='text.secondary'>
						请先连接你的 MetaMask 钱包以开始使用
					</Typography>
				</Paper>
			)}

			{/* 页脚说明 */}
			<Box mt={6} py={3} borderTop={1} borderColor='divider' textAlign='center'>
				<Typography variant='body2' color='text.secondary' gutterBottom>
					功能特性
				</Typography>
				<Grid container spacing={2} justifyContent='center' mt={1}>
					<Grid>
						<Typography variant='caption' sx={{ fontWeight: 'bold' }}>
							• Wagmi 钱包连接
						</Typography>
					</Grid>
					<Grid>
						<Typography variant='caption' sx={{ fontWeight: 'bold' }}>
							• 智能合约交互
						</Typography>
					</Grid>
					<Grid>
						<Typography variant='caption' sx={{ fontWeight: 'bold' }}>
							• 实时事件监听
						</Typography>
					</Grid>
					<Grid>
						<Typography variant='caption' sx={{ fontWeight: 'bold' }}>
							• The Graph 数据查询
						</Typography>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}

export default function EventContractPage() {
	return (
		<Web3Provider>
			<EventContractContent />
		</Web3Provider>
	);
}
