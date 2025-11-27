'use client';

import { useState, useEffect } from 'react';
import {
	useConnection,
	useDisconnect,
	useEnsAvatar,
	useEnsName,
	useBalance,
	useSwitchChain,
	useChainId,
	useChains,
	useConnect,
	useConnectors,
} from 'wagmi';
import { formatEther } from 'viem';
import {
	Select,
	MenuItem,
	Box,
	Typography,
	Avatar,
	IconButton,
	Tooltip,
} from '@mui/material';
import {
	AccountBalanceWallet,
	ContentCopy,
	PowerSettingsNew,
	SwapHoriz,
} from '@mui/icons-material';
import { useAlert } from '@/app/components/Alert/AlertProvider';

export default function Connected() {
	const [copySuccess, setCopySuccess] = useState(false);
	const { address } = useConnection();
	const { disconnect } = useDisconnect();
	const { switchChain } = useSwitchChain();
	const { data: ensName } = useEnsName({ address });
	const { data: ensAvatar } = useEnsAvatar({ name: ensName! });
	const { data: balance } = useBalance({ address });
	const chainId = useChainId();
	const chains = useChains();
	const { connect } = useConnect();
	const connectors = useConnectors();

	const { showAlert } = useAlert();
	console.log(ensName);

	// 获取所有账户地址
	// 注意：eth_accounts 只返回当前已连接的账户
	// MetaMask 不允许网页直接获取钱包中的所有账户（安全限制）
	const loadAccounts = async () => {
		if (typeof window === 'undefined' || !window.ethereum) return [];
		try {
			await window.ethereum.request({
				method: 'eth_accounts',
			});
			showAlert('连接账户成功', 'success');
		} catch (e) {
			showAlert('获取账户失败', 'error');
			console.error('获取账户失败', e);
			return [];
		}
	};

	// 监听账户变化
	useEffect(() => {
		if (!window.ethereum) return;

		const init = async () => {
			await loadAccounts();
		};

		init();

		const ethereum = window.ethereum;

		const handler = (accs: string[]) => {
			console.log('accountsChanged:', accs);
		};

		ethereum.on('accountsChanged', handler);

		return () => {
			ethereum.removeListener('accountsChanged', handler);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 主动触发切换账户
	const requestAccountSwitch = async () => {
		if (!window.ethereum) return;
		try {
			await window.ethereum.request({
				method: 'wallet_requestPermissions',
				params: [{ eth_accounts: {} }],
			});
			console.log('账户切换请求已发送');
			return;
		} catch (e) {
			console.warn('wallet_requestPermissions 失败，尝试备用方案:', e);
		}

		// 方法2: 断开重连（备用方案）
		console.log('使用断开重连方式切换账户');
		await disconnect();

		// 等待断开完成（增加等待时间）
		await new Promise((resolve) => setTimeout(resolve, 500));

		// 重新连接
		try {
			const metamaskConnector = connectors.find((c) => c.id === 'injected');
			if (metamaskConnector) {
				console.log('重新连接钱包...');
				await connect({ connector: metamaskConnector });
				console.log('账户切换成功');
			} else {
				throw new Error('未找到 MetaMask 连接器');
			}
		} catch (err) {
			console.error('切换账号失败', err);
			showAlert('切换账户失败，请在 MetaMask 中手动切换账户', 'error');
		}
	};

	// 复制地址
	const copyAddress = () => {
		if (address) {
			navigator.clipboard.writeText(address);
			setCopySuccess(true);
			setTimeout(() => setCopySuccess(false), 2000);
		}
	};

	// 格式化地址
	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 2,
			}}
		>
			{/* 头像 */}
			<Avatar
				src={ensAvatar || undefined}
				sx={{
					width: 40,
					height: 40,
					border: '2px solid rgba(139, 92, 246, 0.5)',
				}}
			>
				<AccountBalanceWallet />
			</Avatar>

			{/* 地址和余额 */}
			<Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 150 }}>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
					<Typography
						variant='body2'
						sx={{ color: 'white', fontWeight: 600, fontSize: '0.875rem' }}
					>
						{ensName ? ensName : address && formatAddress(address)}
					</Typography>
					<Tooltip title={copySuccess ? 'Copied!' : 'Copy Address'}>
						<IconButton
							size='small'
							onClick={copyAddress}
							sx={{
								color: 'rgba(255, 255, 255, 0.7)',
								p: 0.5,
								'&:hover': {
									color: 'white',
									backgroundColor: 'rgba(255, 255, 255, 0.1)',
								},
							}}
						>
							<ContentCopy sx={{ fontSize: 14 }} />
						</IconButton>
					</Tooltip>
				</Box>
				<Typography
					variant='caption'
					sx={{ color: 'rgba(139, 92, 246, 1)', fontWeight: 500 }}
				>
					{balance
						? parseFloat(formatEther(balance.value)).toFixed(4)
						: '0.0000'}{' '}
					ETH
				</Typography>
			</Box>

			{/* 账户切换按钮 - 始终显示，让用户可以切换到其他账户 */}
			<Tooltip title='Switch Account'>
				<IconButton
					onClick={requestAccountSwitch}
					sx={{
						color: 'rgba(139, 92, 246, 0.9)',
						bgcolor: 'rgba(139, 92, 246, 0.1)',
						border: '1px solid rgba(139, 92, 246, 0.3)',
						'&:hover': {
							bgcolor: 'rgba(139, 92, 246, 0.2)',
							color: 'rgb(139, 92, 246)',
						},
					}}
				>
					<SwapHoriz fontSize='small' />
				</IconButton>
			</Tooltip>

			{/* 链选择 */}
			<Select
				value={chainId}
				onChange={(e) => switchChain({ chainId: Number(e.target.value) })}
				size='small'
				sx={{
					minWidth: 130,
					color: 'white',
					bgcolor: 'rgba(139, 92, 246, 0.15)',
					border: '1px solid rgba(139, 92, 246, 0.3)',
					'.MuiSvgIcon-root': { color: 'white' },
					'.MuiOutlinedInput-notchedOutline': {
						border: 'none',
					},
					'&:hover': {
						bgcolor: 'rgba(139, 92, 246, 0.25)',
					},
				}}
			>
				{chains.map(({ id, name }) => (
					<MenuItem key={id} value={id}>
						{name}
					</MenuItem>
				))}
			</Select>

			{/* 断开连接按钮 */}
			<Tooltip title='Disconnect Wallet'>
				<IconButton
					onClick={() => disconnect()}
					sx={{
						color: 'rgba(239, 68, 68, 0.9)',
						bgcolor: 'rgba(239, 68, 68, 0.1)',
						border: '1px solid rgba(239, 68, 68, 0.3)',
						'&:hover': {
							bgcolor: 'rgba(239, 68, 68, 0.2)',
							color: 'rgb(239, 68, 68)',
						},
					}}
				>
					<PowerSettingsNew fontSize='small' />
				</IconButton>
			</Tooltip>
		</Box>
	);
}
