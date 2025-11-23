'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import {
	Card,
	CardContent,
	Typography,
	TextField,
	Button,
	Box,
	Alert,
	CircularProgress,
	Divider,
	Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
	useBalance,
	useContractBalance,
	useTransfer,
	useOwner,
} from '../hooks/useContract';
import WarningIcon from '@mui/icons-material/Warning';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export function ContractInteraction() {
	const { address } = useAccount();
	// 钱包原生 ETH 余额
	const {
		balance: walletBalance,
		isLoading: walletBalanceLoading,
		refetch: refetchWallet,
	} = useBalance(address);
	// 获取合约 owner
	const { owner, isLoading: ownerLoading } = useOwner();
	// 当前用户的合约内余额
	const {
		balance: contractBalance,
		isLoading: contractBalanceLoading,
		refetch: refetchContract,
	} = useContractBalance(address);
	// Owner 的合约内余额
	const {
		balance: ownerContractBalance,
		isLoading: ownerBalanceLoading,
		refetch: refetchOwnerBalance,
	} = useContractBalance(owner);
	const { transfer, isPending, isSuccess, isError, error, hash } =
		useTransfer();

	const [toAddress, setToAddress] = useState('');
	const [amount, setAmount] = useState('');
	const [isMounted, setIsMounted] = useState(false);

	// 检查当前用户是否是合约 owner
	const isOwner =
		address && owner && address.toLowerCase() === owner.toLowerCase();

	// 确保只在客户端渲染
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsMounted(true);
	}, []);

	// 格式化代币余额 (合约存储的是整数,不是 wei)
	const formatTokenBalance = (balance: bigint | undefined) => {
		if (balance === undefined) return '0';
		return balance.toString();
	};

	const handleTransfer = () => {
		if (!toAddress || !amount) {
			return;
		}

		try {
			// 将字符串转换为 bigint (合约使用整数,不是 wei)
			const amountInTokens = BigInt(amount);
			transfer(toAddress as `0x${string}`, amountInTokens);
		} catch (err) {
			console.error('Transfer error:', err);
		}
	};

	// 在组件挂载前不渲染内容,避免 hydration 错误
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

	if (!address) {
		return null;
	}

	return (
		<Card elevation={3}>
			<CardContent>
				<Box display='flex' alignItems='center' gap={1} mb={3}>
					<AccountBalanceIcon color='primary' fontSize='large' />
					<Typography variant='h5' fontWeight='bold'>
						合约交互
					</Typography>
				</Box>

				{/* Owner 信息显示 */}
				<Box mb={3}>
					{ownerLoading ? (
						<Box display='flex' alignItems='center' gap={1}>
							<CircularProgress size={16} />
							<Typography variant='body2' color='text.secondary'>
								加载合约信息...
							</Typography>
						</Box>
					) : (
						<Box>
							<Box display='flex' alignItems='center' gap={1} mb={1}>
								<AdminPanelSettingsIcon fontSize='small' color='action' />
								<Typography variant='body2' color='text.secondary'>
									合约部署人:{' '}
									{owner ? `${owner.slice(0, 6)}...${owner.slice(-4)}` : '未知'}
								</Typography>
							</Box>
							{isOwner ? (
								<Chip
									icon={<AdminPanelSettingsIcon />}
									label='你是合约部署人,可以发起转账'
									color='success'
									size='small'
									sx={{ mt: 0.5 }}
								/>
							) : (
								<Alert severity='warning' sx={{ mt: 1 }}>
									<Box display='flex' alignItems='center' gap={1}>
										<WarningIcon fontSize='small' />
										<Typography variant='body2'>
											只有合约部署人可以发起转账
										</Typography>
									</Box>
								</Alert>
							)}
						</Box>
					)}
				</Box>

				<Divider sx={{ mb: 3 }} />

				{/* 钱包 ETH 余额显示 */}
				<Box
					sx={{
						p: 3,
						mb: 2,
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						borderRadius: 2,
						color: 'white',
					}}
				>
					<Typography variant='body2' sx={{ opacity: 0.9, mb: 1 }}>
						钱包 ETH 余额
					</Typography>
					<Box display='flex' alignItems='center' gap={2}>
						<Typography variant='h4' fontWeight='bold'>
							{walletBalanceLoading ? (
								<CircularProgress size={24} sx={{ color: 'white' }} />
							) : walletBalance !== undefined ? (
								formatEther(walletBalance)
							) : (
								'0'
							)}{' '}
							ETH
						</Typography>
						<Button
							variant='outlined'
							size='small'
							onClick={() => refetchWallet()}
							sx={{
								color: 'white',
								borderColor: 'white',
								'&:hover': {
									borderColor: 'white',
									backgroundColor: 'rgba(255,255,255,0.1)',
								},
							}}
						>
							刷新
						</Button>
					</Box>
				</Box>

				{/* Owner 合约内余额显示 */}
				{!isOwner && owner && (
					<Box
						sx={{
							p: 3,
							mb: 2,
							background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
							borderRadius: 2,
							color: 'white',
						}}
					>
						<Typography variant='body2' sx={{ opacity: 0.9, mb: 1 }}>
							Owner 合约内余额
						</Typography>
						<Box display='flex' alignItems='center' gap={2}>
							<Typography variant='h4' fontWeight='bold'>
								{ownerBalanceLoading ? (
									<CircularProgress size={24} sx={{ color: 'white' }} />
								) : (
									formatTokenBalance(ownerContractBalance)
								)}{' '}
								Token
							</Typography>
							<Button
								variant='outlined'
								size='small'
								onClick={() => refetchOwnerBalance()}
								sx={{
									color: 'white',
									borderColor: 'white',
									'&:hover': {
										borderColor: 'white',
										backgroundColor: 'rgba(255,255,255,0.1)',
									},
								}}
							>
								刷新
							</Button>
						</Box>
						<Typography
							variant='caption'
							sx={{ opacity: 0.8, mt: 1, display: 'block' }}
						>
							部署人地址:{' '}
							{owner
								? `${owner.slice(0, 6)}...${owner.slice(-4)}`
								: '加载中...'}
						</Typography>
					</Box>
				)}

				{/* 当前用户合约内余额显示 */}
				<Box
					sx={{
						p: 3,
						mb: 3,
						background: isOwner
							? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
							: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
						borderRadius: 2,
						color: 'white',
					}}
				>
					<Typography variant='body2' sx={{ opacity: 0.9, mb: 1 }}>
						{isOwner ? '你的合约内余额 (Owner)' : '你的合约内余额'}
					</Typography>
					<Box display='flex' alignItems='center' gap={2}>
						<Typography variant='h4' fontWeight='bold'>
							{contractBalanceLoading ? (
								<CircularProgress size={24} sx={{ color: 'white' }} />
							) : (
								formatTokenBalance(contractBalance)
							)}{' '}
							Token
						</Typography>
						<Button
							variant='outlined'
							size='small'
							onClick={() => refetchContract()}
							sx={{
								color: 'white',
								borderColor: 'white',
								'&:hover': {
									borderColor: 'white',
									backgroundColor: 'rgba(255,255,255,0.1)',
								},
							}}
						>
							刷新
						</Button>
					</Box>
				</Box>

				<Divider sx={{ mb: 3 }} />

				{/* 转账表单 */}
				<Typography variant='h6' fontWeight='bold' mb={2}>
					发起转账 {!isOwner && '(仅合约部署人可用)'}
				</Typography>

				<Box display='flex' flexDirection='column' gap={2}>
					<TextField
						fullWidth
						label='接收地址'
						placeholder='0x...'
						value={toAddress}
						onChange={(e) => setToAddress(e.target.value)}
						disabled={isPending || !isOwner}
						helperText={!isOwner ? '只有合约部署人可以发起转账' : ''}
					/>

					<TextField
						fullWidth
						label='转账金额 (Token 数量)'
						type='number'
						placeholder='100'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						disabled={isPending || !isOwner}
						helperText='输入整数代币数量，例如: 100'
					/>

					<Button
						variant='contained'
						size='large'
						fullWidth
						startIcon={
							isPending ? <CircularProgress size={20} /> : <SendIcon />
						}
						onClick={handleTransfer}
						disabled={isPending || !toAddress || !amount || !isOwner}
						sx={{
							background: isOwner
								? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
								: 'linear-gradient(135deg, #9e9e9e 0%, #757575 100%)',
							py: 1.5,
						}}
					>
						{isPending
							? '处理中...'
							: isOwner
								? '发送转账'
								: '需要合约部署人权限'}
					</Button>
				</Box>

				{/* 状态提示 */}
				<Box mt={2}>
					{isSuccess && hash && (
						<Alert severity='success' sx={{ mb: 2 }}>
							<Typography variant='body2' fontWeight='bold' mb={1}>
								转账成功！事件应该会在"实时事件监听"中显示
							</Typography>
							<Box display='flex' alignItems='center' gap={1} mb={1}>
								<Typography variant='caption'>交易哈希:</Typography>
								<Chip
									label={`${hash.slice(0, 10)}...${hash.slice(-8)}`}
									size='small'
									color='success'
								/>
							</Box>
							<Button
								size='small'
								variant='outlined'
								onClick={() =>
									window.open(
										`https://sepolia.etherscan.io/tx/${hash}`,
										'_blank'
									)
								}
								sx={{ mt: 1 }}
							>
								在 Etherscan 上查看
							</Button>
						</Alert>
					)}

					{isError && (
						<Alert severity='error'>
							<Typography variant='body2' fontWeight='bold' mb={1}>
								转账失败
							</Typography>
							<Typography variant='caption'>
								{error?.message || '发生未知错误'}
							</Typography>
						</Alert>
					)}
				</Box>
			</CardContent>
		</Card>
	);
}
