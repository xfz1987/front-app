'use client';

import { useEffect, useState } from 'react';
import {
	useAccount,
	useReadContract,
	useWatchContractEvent,
	usePublicClient,
	useConfig,
} from 'wagmi';
import { formatUnits } from 'viem';
import { getPublicClient } from 'wagmi/actions';
import { CONTRACT_ADDRESS } from '../../config';
import RedPacketABI from '../../abi/RedPacket.json';
import RedTokenABI from '../../abi/RedToken.json';

interface PacketInfo {
	totalAmount: bigint;
	remainCount: bigint;
	expireAt: bigint;
	isEqual: boolean;
	exists: boolean;
}

interface PacketCreatedEventData {
	packetId: bigint;
	count: bigint;
	amount: bigint;
	initialAmount: bigint;
}

export default function RedPacketStats() {
	const { address } = useAccount();
	const wagmiConfig = useConfig();
	const publicClient = usePublicClient();
	const [currentPacketId, setCurrentPacketId] = useState<bigint | null>(null);
	const [packetInfo, setPacketInfo] = useState<PacketInfo | null>(null);
	const [tokenSymbol, setTokenSymbol] = useState('RPT');
	const [tokenDecimals, setTokenDecimals] = useState(0);
	const [initialCount, setInitialCount] = useState<bigint>(BigInt(0));
	const [initialAmount, setInitialAmount] = useState<bigint>(BigInt(0));

	// 获取 RedToken 地址
	const { data: tokenAddress } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'token',
	});

	// 获取用户的授权额度
	const { data: userAllowance, refetch: refetchAllowance } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'allowance',
		args: [address, CONTRACT_ADDRESS],
		query: {
			enabled: !!tokenAddress && !!address,
		},
	});

	// 获取用户的 token 余额
	const { data: userBalance, refetch: refetchBalance } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'balanceOf',
		args: [address],
		query: {
			enabled: !!tokenAddress && !!address,
		},
	});

	// 获取下一个红包ID (当前场次)
	const { data: nextPacketId } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'nextPacketId',
	});

	// 获取代币符号
	const { data: symbolData } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'symbol',
		query: {
			enabled: !!tokenAddress,
		},
	});

	// 获取代币精度
	const { data: decimalsData } = useReadContract({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		functionName: 'decimals',
		query: {
			enabled: !!tokenAddress,
		},
	});

	// 获取合约代币余额
	const { data: contractBalance } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'getContractTokenBalance',
	});

	// 获取当前红包信息
	const {
		data: packetData,
		refetch: refetchPacket,
		isLoading: isPacketLoading,
		error: packetError,
	} = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'packets',
		args: currentPacketId ? [currentPacketId] : undefined,
		query: {
			enabled: !!currentPacketId,
		},
	});

	console.log('[RedPacketStats] Packet data query:', {
		currentPacketId: currentPacketId?.toString(),
		hasPacketData: !!packetData,
		isPacketLoading,
		packetError: packetError?.message,
	});

	// 监听 PacketCreated 事件
	useWatchContractEvent({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		eventName: 'PacketCreated',
		onLogs(logs) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			logs.forEach((log: any) => {
				const { packetId, count, amount } = log.args;
				if (packetId) {
					// 更新当前红包ID
					setCurrentPacketId(packetId);
					setInitialCount(count);
					setInitialAmount(amount);
				}
			});
			refetchPacket();
		},
	});

	// 监听 PacketClaimed 事件
	useWatchContractEvent({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		eventName: 'PacketClaimed',
		onLogs() {
			refetchPacket();
		},
	});

	// 监听 Approval 事件（授权）
	useWatchContractEvent({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		eventName: 'Approval',
		onLogs(logs) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			logs.forEach((log: any) => {
				const { owner, spender } = log.args;
				// 只在当前用户授权给 RedPacket 合约时刷新
				if (
					owner?.toLowerCase() === address?.toLowerCase() &&
					spender?.toLowerCase() === CONTRACT_ADDRESS.toLowerCase()
				) {
					refetchAllowance();
				}
			});
		},
	});

	// 监听 Transfer 事件（转账）
	useWatchContractEvent({
		address: tokenAddress as `0x${string}`,
		abi: RedTokenABI.abi,
		eventName: 'Transfer',
		onLogs(logs) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			logs.forEach((log: any) => {
				const { from, to } = log.args;
				// 只在涉及当前用户时刷新余额
				if (
					from?.toLowerCase() === address?.toLowerCase() ||
					to?.toLowerCase() === address?.toLowerCase()
				) {
					refetchBalance();
				}
			});
		},
	});

	// 更新代币信息
	useEffect(() => {
		if (symbolData) {
			setTokenSymbol(symbolData as string);
		}
		if (decimalsData) {
			setTokenDecimals(decimalsData as number);
		}
	}, [symbolData, decimalsData]);

	// 更新当前红包ID
	useEffect(() => {
		if (nextPacketId) {
			const nextId = nextPacketId as bigint;
			// 当前场次是 nextPacketId - 1
			if (nextId > BigInt(0)) {
				setCurrentPacketId(nextId - BigInt(1));
			}
		}
	}, [nextPacketId]);

	// 更新红包信息
	useEffect(() => {
		if (packetData) {
			const [totalAmount, remainCount, expireAt, isEqual, exists] =
				packetData as [bigint, bigint, bigint, boolean, boolean];
			setPacketInfo({
				totalAmount,
				remainCount,
				expireAt,
				isEqual,
				exists,
			});
		}
	}, [packetData]);

	// 当 currentPacketId 变化时，获取该红包的历史事件来获取初始数量
	useEffect(() => {
		const fetchInitialCount = async () => {
			if (!currentPacketId) {
				console.log('[RedPacketStats] Missing currentPacketId');
				return;
			}

			console.log('[RedPacketStats] Fetching initial count for packet:', currentPacketId.toString());

			try {
				// 使用 wagmi config 获取 publicClient
				const client = publicClient || getPublicClient(wagmiConfig);

				if (!client) {
					console.error('[RedPacketStats] No public client available');
					return;
				}

				console.log('[RedPacketStats] Using client to fetch logs');

				// 获取当前区块号
				const currentBlock = await client.getBlockNumber();
				// 只查询最近 10000 个区块（约 1-2 天的数据）
				const fromBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);

				console.log('[RedPacketStats] Fetching logs from block:', fromBlock.toString(), 'to', currentBlock.toString());

				// 查询 PacketCreated 事件
				const logs = await client.getLogs({
					address: CONTRACT_ADDRESS,
					event: {
						type: 'event',
						name: 'PacketCreated',
						inputs: [
							{ type: 'uint256', name: 'packetId', indexed: true },
							{ type: 'address', name: 'sender', indexed: true },
							{ type: 'uint256', name: 'amount', indexed: false },
							{ type: 'uint256', name: 'count', indexed: false },
							{ type: 'bool', name: 'isEqual', indexed: false },
							{ type: 'uint256', name: 'expireAt', indexed: false },
						],
					},
					args: {
						packetId: currentPacketId,
					},
					fromBlock,
					toBlock: 'latest',
				});

				console.log('[RedPacketStats] PacketCreated logs:', logs);

				if (logs && logs.length > 0) {
					const log = logs[0];
					if (log && log.args) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const { count, amount } = log.args as any;
						console.log('[RedPacketStats] Found initial count:', {
							count: count?.toString(),
							amount: amount?.toString(),
						});
						if (count) {
							setInitialCount(count);
							setInitialAmount(amount);
						}
					}
				} else {
					console.log('[RedPacketStats] No logs found for packetId:', currentPacketId.toString());
				}
			} catch (error) {
				console.error('[RedPacketStats] Failed to fetch PacketCreated event:', error);
			}
		};

		fetchInitialCount();
	}, [currentPacketId, publicClient, wagmiConfig]);

	const formatAmount = (amount: bigint) => {
		return formatUnits(amount, tokenDecimals);
	};

	// 调试信息
	console.log('[RedPacketStats] Current state:', {
		currentPacketId: currentPacketId?.toString(),
		hasPublicClient: !!publicClient,
		initialCount: initialCount.toString(),
		initialAmount: initialAmount.toString(),
		remainCount: packetInfo?.remainCount?.toString(),
		exists: packetInfo?.exists,
		packetData,
	});

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
			{/* 当前场次 */}
			<div className='bg-linear-to-br from-blue-900/40 to-blue-800/40 backdrop-blur-sm rounded-xl p-6 border border-blue-700/50 shadow-lg'>
				<div className='text-blue-300 text-sm font-medium mb-2'>当前场次</div>
				<div className='text-white text-3xl font-bold mb-1'>
					#
					{currentPacketId !== null && currentPacketId > BigInt(0)
						? currentPacketId.toString()
						: '1'}
				</div>
				<div className='text-blue-400 text-xs'>
					{packetInfo?.exists ? '红包进行中' : '红包进行中'}
				</div>
			</div>

			{/* 剩余红包数 */}
			<div className='bg-linear-to-br from-red-900/40 to-pink-800/40 backdrop-blur-sm rounded-xl p-6 border border-red-700/50 shadow-lg'>
				<div className='text-red-300 text-sm font-medium mb-2'>剩余红包数</div>
				<div className='text-white text-3xl font-bold mb-1'>
					{packetInfo?.exists && initialCount > BigInt(0) ? (
						<>
							<span className='text-red-400'>
								{packetInfo.remainCount.toString()}
							</span>
							<span className='text-gray-400 text-xl'>
								{' '}
								/ {initialCount.toString()}
							</span>
						</>
					) : (
						<>
							<span className='text-red-400'>0</span>
							<span className='text-gray-400 text-xl'>
								{' '}
								/ {initialCount > BigInt(0) ? initialCount.toString() : '0'}
							</span>
						</>
					)}
				</div>
				<div className='text-red-400 text-xs'>
					{packetInfo?.isEqual ? '均分红包' : '拼手气红包'}
				</div>
			</div>

			{/* 红包剩余金额 */}
			<div className='bg-linear-to-br from-yellow-900/40 to-orange-800/40 backdrop-blur-sm rounded-xl p-6 border border-yellow-700/50 shadow-lg'>
				<div className='text-yellow-300 text-sm font-medium mb-2'>
					红包剩余金额
				</div>
				<div className='text-white text-3xl font-bold mb-1'>
					{packetInfo?.exists && packetInfo.totalAmount > BigInt(0)
						? formatAmount(packetInfo.totalAmount)
						: '0'}{' '}
					<span className='text-xl text-yellow-400'>
						{tokenSymbol || 'RPT'}
					</span>
				</div>
				{/* <div className='text-yellow-400 text-xs'>当前红包剩余</div> */}
			</div>

			{/* 我的余额 */}
			<div className='bg-linear-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-xl p-6 border border-purple-700/50 shadow-lg'>
				<div className='text-purple-300 text-sm font-medium mb-2'>
					RedToken 余额
				</div>
				<div className='text-white text-3xl font-bold mb-1'>
					{userBalance ? formatAmount(userBalance as bigint) : '0'}{' '}
					<span className='text-xl text-purple-400'>
						{tokenSymbol || 'RPT'}
					</span>
				</div>
				{/* <div className='text-purple-400 text-xs'>可用 Token 余额</div> */}
			</div>
		</div>
	);
}
