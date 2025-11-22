'use client';

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
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTransferEvents } from '../hooks/useContract';
import type { TransferEvent, TransferEventArgs } from '../types';

export function EventListener() {
	const { events } = useTransferEvents();

	const formatAddress = (addr: string) => {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	};

	return (
		<Card elevation={3}>
			<CardContent>
				<Box display="flex" alignItems="center" gap={1} mb={2}>
					<NotificationsActiveIcon color="primary" fontSize="large" />
					<Typography variant="h5" fontWeight="bold">
						实时事件监听
					</Typography>
					<Chip
						label={`${events.length} 个事件`}
						color="primary"
						size="small"
						sx={{ ml: 'auto' }}
					/>
				</Box>

				<Alert severity="info" sx={{ mb: 2 }}>
					监听链上的 Transfer 事件，实时更新
				</Alert>

				<Divider sx={{ mb: 2 }} />

				{events.length === 0 ? (
					<Box
						sx={{
							py: 6,
							textAlign: 'center',
							color: 'text.secondary',
						}}
					>
						<NotificationsActiveIcon sx={{ fontSize: 60, opacity: 0.3, mb: 2 }} />
						<Typography variant="body1">暂无事件</Typography>
						<Typography variant="body2">发起转账后，事件将实时显示在这里</Typography>
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
											display="flex"
											alignItems="center"
											gap={1}
											width="100%"
											mb={1}
										>
											{index === 0 && (
												<Chip
													label="最新"
													size="small"
													color="success"
													sx={{ mr: 1 }}
												/>
											)}
											<Chip
												label={`Block #${blockNumber?.toString()}`}
												size="small"
												variant="outlined"
											/>
											<Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
												{new Date().toLocaleTimeString()}
											</Typography>
										</Box>

										<Box display="flex" alignItems="center" gap={1} width="100%" mb={1}>
											<Chip label={formatAddress(from)} size="small" />
											<ArrowForwardIcon fontSize="small" color="action" />
											<Chip label={formatAddress(to)} size="small" color="primary" />
											<Chip
												label={`${formatEther(value)} ETH`}
												size="small"
												color="success"
												sx={{ ml: 'auto' }}
											/>
										</Box>

										<Typography variant="caption" color="text.secondary" noWrap sx={{ width: '100%' }}>
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
