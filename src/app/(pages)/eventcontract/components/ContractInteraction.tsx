'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
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
} from '../hooks/useContract';

export function ContractInteraction() {
	const { address } = useAccount();
	// 钱包原生 ETH 余额
	const {
		balance: walletBalance,
		isLoading: walletBalanceLoading,
		refetch: refetchWallet,
	} = useBalance(address);
	// 合约内余额
	const {
		balance: contractBalance,
		isLoading: contractBalanceLoading,
		refetch: refetchContract,
	} = useContractBalance(address);
	const { transfer, isPending, isSuccess, isError, error, hash } =
		useTransfer();

	const [toAddress, setToAddress] = useState('');
	const [amount, setAmount] = useState('');

	const handleTransfer = () => {
		if (!address || !toAddress || !amount) {
			return;
		}

		try {
			const amountInWei = parseEther(amount);
			transfer(address, toAddress as `0x${string}`, amountInWei);
		} catch (err) {
			console.error('Transfer error:', err);
		}
	};

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

				{/* 合约内余额显示 */}
				<Box
					sx={{
						p: 3,
						mb: 3,
						background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
						borderRadius: 2,
						color: 'white',
					}}
				>
					<Typography variant='body2' sx={{ opacity: 0.9, mb: 1 }}>
						合约内余额
					</Typography>
					<Box display='flex' alignItems='center' gap={2}>
						<Typography variant='h4' fontWeight='bold'>
							{contractBalanceLoading ? (
								<CircularProgress size={24} sx={{ color: 'white' }} />
							) : contractBalance !== undefined ? (
								formatEther(contractBalance)
							) : (
								'0'
							)}{' '}
							ETH
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
					发起转账
				</Typography>

				<Box display='flex' flexDirection='column' gap={2}>
					<TextField
						fullWidth
						label='接收地址'
						placeholder='0x...'
						value={toAddress}
						onChange={(e) => setToAddress(e.target.value)}
						disabled={isPending}
					/>

					<TextField
						fullWidth
						label='转账金额 (ETH)'
						type='number'
						placeholder='0.0'
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						disabled={isPending}
					/>

					<Button
						variant='contained'
						size='large'
						fullWidth
						startIcon={
							isPending ? <CircularProgress size={20} /> : <SendIcon />
						}
						onClick={handleTransfer}
						disabled={isPending || !toAddress || !amount}
						sx={{
							background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
							py: 1.5,
						}}
					>
						{isPending ? '处理中...' : '发送转账'}
					</Button>
				</Box>

				{/* 状态提示 */}
				<Box mt={2}>
					{isSuccess && hash && (
						<Alert severity='success' sx={{ mb: 2 }}>
							<Typography variant='body2' fontWeight='bold' mb={1}>
								转账成功！
							</Typography>
							<Box display='flex' alignItems='center' gap={1}>
								<Typography variant='caption'>交易哈希:</Typography>
								<Chip
									label={`${hash.slice(0, 10)}...${hash.slice(-8)}`}
									size='small'
									color='success'
								/>
							</Box>
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
