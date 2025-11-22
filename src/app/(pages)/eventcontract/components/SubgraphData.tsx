'use client';

import { useState } from 'react';
import { formatEther } from 'viem';
import {
	Card,
	CardContent,
	Typography,
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	CircularProgress,
	Alert,
	Chip,
	Button,
	Tabs,
	Tab,
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTransfers, useAddressTransfers } from '../hooks/useSubgraph';
import { useAccount } from 'wagmi';

export function SubgraphData() {
	const { address } = useAccount();
	const [tabValue, setTabValue] = useState(0);
	const [page, setPage] = useState(0);
	const pageSize = 10;

	const {
		data: allTransfersData,
		isLoading,
		isError,
		refetch,
	} = useTransfers(pageSize, page * pageSize);
	const { data: myTransfersData, isLoading: myLoading } = useAddressTransfers(
		address,
		20
	);

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
	};

	const formatDate = (timestamp: string) => {
		const date = new Date(parseInt(timestamp) * 1000);
		return date.toLocaleString();
	};

	const openInExplorer = (txHash: string) => {
		window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank');
	};

	const transfers =
		tabValue === 0 ? allTransfersData?.transfers : myTransfersData?.transfers;
	const loading = tabValue === 0 ? isLoading : myLoading;

	return (
		<Card elevation={3}>
			<CardContent>
				<Box display='flex' alignItems='center' gap={1} mb={2}>
					<StorageIcon color='primary' fontSize='large' />
					<Typography variant='h5' fontWeight='bold'>
						The Graph 链上数据
					</Typography>
					<Button
						size='small'
						startIcon={<RefreshIcon />}
						onClick={() => refetch()}
						sx={{ ml: 'auto' }}
					>
						刷新
					</Button>
				</Box>

				<Tabs
					value={tabValue}
					onChange={(_, newValue) => setTabValue(newValue)}
					sx={{ mb: 2 }}
				>
					<Tab label='所有转账记录' />
					<Tab label='我的转账记录' disabled={!address} />
				</Tabs>

				{isError && (
					<Alert severity='error' sx={{ mb: 2 }}>
						无法加载数据，请检查 Subgraph URL 配置
					</Alert>
				)}

				{loading ? (
					<Box display='flex' justifyContent='center' py={6}>
						<CircularProgress />
					</Box>
				) : transfers && transfers.length > 0 ? (
					<>
						<TableContainer component={Paper} variant='outlined'>
							<Table>
								<TableHead>
									<TableRow sx={{ bgcolor: 'action.hover' }}>
										<TableCell>
											<Typography variant='subtitle2' fontWeight='bold'>
												区块
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant='subtitle2' fontWeight='bold'>
												时间
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant='subtitle2' fontWeight='bold'>
												发送方
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant='subtitle2' fontWeight='bold'>
												接收方
											</Typography>
										</TableCell>
										<TableCell align='right'>
											<Typography variant='subtitle2' fontWeight='bold'>
												金额
											</Typography>
										</TableCell>
										<TableCell align='center'>
											<Typography variant='subtitle2' fontWeight='bold'>
												操作
											</Typography>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{transfers.map((transfer) => (
										<TableRow key={transfer.id} hover>
											<TableCell>
												<Chip
													label={`#${transfer.blockNumber}`}
													size='small'
													variant='outlined'
												/>
											</TableCell>
											<TableCell>
												<Typography variant='body2'>
													{formatDate(transfer.blockTimestamp)}
												</Typography>
											</TableCell>
											<TableCell>
												<Chip
													label={formatAddress(transfer.from)}
													size='small'
												/>
											</TableCell>
											<TableCell>
												<Chip
													label={formatAddress(transfer.to)}
													size='small'
													color='primary'
												/>
											</TableCell>
											<TableCell align='right'>
												<Chip
													label={`${formatEther(BigInt(transfer.value))} ETH`}
													size='small'
													color='success'
												/>
											</TableCell>
											<TableCell align='center'>
												<Button
													size='small'
													startIcon={<OpenInNewIcon />}
													onClick={() =>
														openInExplorer(transfer.transactionHash)
													}
												>
													查看
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>

						{tabValue === 0 && (
							<Box display='flex' justifyContent='center' gap={2} mt={2}>
								<Button
									variant='outlined'
									disabled={page === 0}
									onClick={() => setPage((p) => p - 1)}
								>
									上一页
								</Button>
								<Chip label={`第 ${page + 1} 页`} />
								<Button
									variant='outlined'
									disabled={!transfers || transfers.length < pageSize}
									onClick={() => setPage((p) => p + 1)}
								>
									下一页
								</Button>
							</Box>
						)}
					</>
				) : (
					<Box
						sx={{
							py: 6,
							textAlign: 'center',
							color: 'text.secondary',
						}}
					>
						<StorageIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
						<Typography variant='body1'>暂无数据</Typography>
						<Typography variant='body2'>
							The Graph 尚未索引到任何转账记录
						</Typography>
					</Box>
				)}
			</CardContent>
		</Card>
	);
}
