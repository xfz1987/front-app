'use client';

import { useState, useEffect } from 'react';
import { formatEther } from 'viem';
import {
	Card,
	CardContent,
	Typography,
	Box,
	List,
	ListItem,
	ListItemText,
	Chip,
	Divider,
	Alert,
	CircularProgress,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTransferEvents } from '../hooks/useContract';
import { CONTRACT_ADDRESS } from '../config';
import type { TransferEvent, TransferEventArgs } from '../types';
import { Button } from '@mui/material';

export function EventListener() {
	const { events, isLoading: eventsLoading } = useTransferEvents();
	const [isMounted, setIsMounted] = useState(false);
	const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

	// 在控制台输出合约地址用于调试
	useEffect(() => {
		console.log('🏠 监听的合约地址:', CONTRACT_ADDRESS);
		console.log('⏱️ 轮询间隔: 每秒检查一次新事件');
	}, []);

	// 确保只在客户端渲染
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true);
	}, []);

	// 当事件更新时,记录时间
	useEffect(() => {
		if (events.length > 0) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setLastUpdateTime(new Date());
			console.log(
				'🔄 Events list updated at:',
				new Date().toLocaleTimeString()
			);
		}
	}, [events]);

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	// 格式化代币余额 (合约存储的是整数,不是 wei)
	const formatTokenBalance = (balance: bigint) => {
		return balance.toString();
	};

	// 添加调试信息
	useEffect(() => {
		console.log('EventListener mounted, events:', events);
	}, [events]);

	// 在组件挂载前显示加载状态
	if (!isMounted) {
		return (
			<Card elevation={3}>
				<CardContent>
					<Box
						display='flex'
						justifyContent='center'
						alignItems='center'
						py={4}
					>
						<CircularProgress />
					</Box>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card elevation={3}>
			<CardContent>
				<Box display='flex' alignItems='center' gap={1} mb={2}>
					<NotificationsActiveIcon color='primary' fontSize='large' />
					<Typography variant='h5' fontWeight='bold'>
						实时事件监听
					</Typography>
					<Chip
						label={`${events.length} 个事件`}
						color='primary'
						size='small'
						sx={{ ml: 'auto' }}
					/>
					<Button
						size='small'
						startIcon={<RefreshIcon />}
						onClick={() => window.location.reload()}
						variant='outlined'
					>
						刷新页面
					</Button>
				</Box>

				<Alert severity='info' sx={{ mb: 2 }}>
					<Box>
						<Box display='flex' alignItems='center' gap={1} mb={0.5}>
							<Box
								sx={{
									width: 8,
									height: 8,
									borderRadius: '50%',
									bgcolor: 'success.main',
									animation: 'pulse 2s ease-in-out infinite',
									'@keyframes pulse': {
										'0%, 100%': { opacity: 1 },
										'50%': { opacity: 0.5 },
									},
								}}
							/>
							<Typography variant='body2' fontWeight='bold'>
								实时监听中 (每5秒自动检查新事件)
							</Typography>
						</Box>
						<Typography
							variant='caption'
							color='text.secondary'
							display='block'
						>
							监听合约: {CONTRACT_ADDRESS}
						</Typography>
						{events.length > 0 && (
							<Typography
								variant='caption'
								color='text.secondary'
								display='block'
								mt={0.5}
							>
								最后更新: {lastUpdateTime.toLocaleTimeString()}
							</Typography>
						)}
					</Box>
				</Alert>

				<Divider sx={{ mb: 2 }} />

				{eventsLoading ? (
					<Box
						sx={{
							py: 6,
							textAlign: 'center',
							color: 'text.secondary',
						}}
					>
						<CircularProgress sx={{ mb: 2 }} />
						<Typography variant='body1'>加载历史事件...</Typography>
					</Box>
				) : events.length === 0 ? (
					<Box
						sx={{
							py: 6,
							textAlign: 'center',
							color: 'text.secondary',
						}}
					>
						<NotificationsActiveIcon
							sx={{ fontSize: 60, opacity: 0.3, mb: 2 }}
						/>
						<Typography variant='body1'>暂无事件</Typography>
						<Typography variant='body2'>
							发起转账后，事件将实时显示在这里
						</Typography>
					</Box>
				) : (
					<List sx={{ maxHeight: 500, overflow: 'auto' }}>
						{events.map((event, index) => {
							const typedEvent = event as unknown as TransferEvent;
							const { args, blockNumber, transactionHash } = typedEvent;
							const from = args?._from || '';
							const to = args?._to || '';
							const value = args?._value || BigInt(0);

							return (
								<Box key={index}>
									<ListItem
										sx={{
											flexDirection: 'column',
											alignItems: 'flex-start',
											bgcolor: index === 0 ? 'action.hover' : 'transparent',
											borderRadius: 1,
											mb: 1,
											p: 2,
										}}
									>
										<Box
											display='flex'
											alignItems='center'
											gap={1}
											width='100%'
											mb={1}
										>
											{index === 0 && (
												<Chip
													label='最新'
													size='small'
													color='success'
													sx={{ mr: 1 }}
												/>
											)}
											<Chip
												label={`Block #${blockNumber?.toString()}`}
												size='small'
												variant='outlined'
											/>
											<Typography
												variant='caption'
												color='text.secondary'
												sx={{ ml: 'auto' }}
											>
												{new Date().toLocaleTimeString()}
											</Typography>
										</Box>

										<Box
											display='flex'
											alignItems='center'
											gap={1}
											width='100%'
											mb={1}
										>
											<Chip label={formatAddress(from)} size='small' />
											<ArrowForwardIcon fontSize='small' color='action' />
											<Chip
												label={formatAddress(to)}
												size='small'
												color='primary'
											/>
											<Chip
												label={`${formatTokenBalance(value)} Token`}
												size='small'
												color='success'
												sx={{ ml: 'auto' }}
											/>
										</Box>

										<Typography
											variant='caption'
											color='text.secondary'
											noWrap
											sx={{ width: '100%' }}
										>
											Tx: {transactionHash}
										</Typography>
									</ListItem>
									{index < events.length - 1 && <Divider />}
								</Box>
							);
						})}
					</List>
				)}
			</CardContent>
		</Card>
	);
}
