'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
	Button,
	Card,
	CardContent,
	Typography,
	Box,
	Chip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export function WalletConnect() {
	const { address, isConnected, chain } = useAccount();
	const { connect, connectors, isPending } = useConnect();
	const { disconnect } = useDisconnect();

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	if (isConnected && address) {
		return (
			<Card
				elevation={3}
				sx={{
					background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
					color: 'white',
				}}
			>
				<CardContent>
					<Box
						display='flex'
						alignItems='center'
						justifyContent='space-between'
					>
						<Box display='flex' alignItems='center' gap={2}>
							<CheckCircleIcon fontSize='large' />
							<Box>
								<Typography variant='body2' sx={{ opacity: 0.9 }}>
									已连接钱包
								</Typography>
								<Typography variant='h6' fontWeight='bold'>
									{formatAddress(address)}
								</Typography>
								{chain && (
									<Chip
										label={chain.name}
										size='small'
										sx={{
											mt: 0.5,
											backgroundColor: 'rgba(255,255,255,0.2)',
											color: 'white',
										}}
									/>
								)}
							</Box>
						</Box>
						<Button
							variant='contained'
							color='error'
							startIcon={<PowerSettingsNewIcon />}
							onClick={() => disconnect()}
							sx={{ minWidth: 100 }}
						>
							断开
						</Button>
					</Box>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card elevation={3}>
			<CardContent>
				<Box
					display='flex'
					flexDirection='column'
					alignItems='center'
					gap={2}
					py={2}
				>
					<AccountBalanceWalletIcon
						sx={{ fontSize: 60, color: 'primary.main' }}
					/>
					<Typography variant='h5' fontWeight='bold' textAlign='center'>
						连接你的钱包
					</Typography>
					<Typography variant='body2' color='text.secondary' textAlign='center'>
						请连接 MetaMask 钱包以使用此应用
					</Typography>
					<Box display='flex' gap={2} flexWrap='wrap' justifyContent='center'>
						{connectors.map((connector) => (
							<Button
								key={connector.uid}
								variant='contained'
								size='large'
								disabled={isPending}
								onClick={() => connect({ connector })}
								startIcon={<AccountBalanceWalletIcon />}
								sx={{
									minWidth: 200,
									background:
										'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								}}
							>
								{isPending ? '连接中...' : `连接 ${connector.name}`}
							</Button>
						))}
					</Box>
				</Box>
			</CardContent>
		</Card>
	);
}
