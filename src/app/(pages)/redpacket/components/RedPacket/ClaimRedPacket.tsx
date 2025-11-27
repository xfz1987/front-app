'use client';

import { useState, useEffect } from 'react';
import {
	useAccount,
	useReadContract,
	useWriteContract,
	useWaitForTransactionReceipt,
	usePublicClient,
	useConfig,
} from 'wagmi';
import { formatUnits } from 'viem';
import { getPublicClient } from 'wagmi/actions';
import { CONTRACT_ADDRESS } from '../../config';
import RedPacketABI from '../../abi/RedPacket.json';
import RedTokenABI from '../../abi/RedToken.json';
import { useAlert } from '@/app/components/Alert/AlertProvider';

interface PacketInfo {
	totalAmount: bigint;
	remainCount: bigint;
	expireAt: bigint;
	isEqual: boolean;
	exists: boolean;
}

export default function ClaimRedPacket() {
	const { address } = useAccount();
	const { showAlert } = useAlert();
	const wagmiConfig = useConfig();
	const publicClient = usePublicClient();
	const [packetId, setPacketId] = useState('');
	const [packetInfo, setPacketInfo] = useState<PacketInfo | null>(null);
	const [hasClaimed, setHasClaimed] = useState(false);
	const [isExpired, setIsExpired] = useState(false);
	const [tokenSymbol, setTokenSymbol] = useState('RPT');
	const [tokenDecimals, setTokenDecimals] = useState(0);
	const [packetSender, setPacketSender] = useState<string | null>(null);

	// 获取 RedToken 地址
	const { data: tokenAddress } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'token',
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

	// 获取红包信息
	const { data: packetData, refetch: refetchPacket } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'packets',
		args: packetId ? [BigInt(packetId)] : undefined,
		query: {
			enabled: !!packetId,
		},
	});

	// 检查用户是否已领取
	const { data: claimedData, refetch: refetchClaimed } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: RedPacketABI.abi,
		functionName: 'hasClaimed',
		args: packetId && address ? [BigInt(packetId), address] : undefined,
		query: {
			enabled: !!packetId && !!address,
		},
	});

	const {
		writeContract: claim,
		data: claimHash,
		error: claimError,
		reset: resetClaim,
	} = useWriteContract();
	const {
		writeContract: recycle,
		data: recycleHash,
		error: recycleError,
		reset: resetRecycle,
	} = useWriteContract();

	const { isSuccess: isClaimSuccess, isLoading: isClaiming } =
		useWaitForTransactionReceipt({
			hash: claimHash,
		});

	const { isSuccess: isRecycleSuccess, isLoading: isRecycling } =
		useWaitForTransactionReceipt({
			hash: recycleHash,
		});

	// 更新代币信息
	useEffect(() => {
		if (symbolData) {
			setTokenSymbol(symbolData as string);
		}
		if (decimalsData !== undefined) {
			setTokenDecimals(decimalsData as number);
		}
	}, [symbolData, decimalsData]);

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

			// 检查是否过期
			const now = Math.floor(Date.now() / 1000);
			setIsExpired(Number(expireAt) < now);
		}
	}, [packetData]);

	// 更新领取状态
	useEffect(() => {
		if (claimedData !== undefined) {
			setHasClaimed(claimedData as boolean);
		}
	}, [claimedData]);

	// 监听领取成功
	useEffect(() => {
		if (isClaimSuccess) {
			refetchPacket();
			refetchClaimed();
			showAlert('抢红包成功！', 'success');
		}
	}, [isClaimSuccess, refetchPacket, refetchClaimed, showAlert]);

	// 监听收回成功
	useEffect(() => {
		if (isRecycleSuccess) {
			refetchPacket();
			showAlert('收回红包成功！', 'success');
		}
	}, [isRecycleSuccess, refetchPacket, showAlert]);

	// 监听抢红包错误
	useEffect(() => {
		if (claimError) {
			console.error('Claim error:', claimError);
			const errorMessage = claimError.message || '抢红包失败';
			if (
				errorMessage.includes('User rejected') ||
				errorMessage.includes('User denied')
			) {
				showAlert('用户取消了交易', 'info');
			} else {
				showAlert('抢红包失败，请重试', 'error');
			}
			resetClaim();
		}
	}, [claimError, showAlert, resetClaim]);

	// 监听收回红包错误
	useEffect(() => {
		if (recycleError) {
			console.error('Recycle error:', recycleError);
			const errorMessage = recycleError.message || '收回红包失败';
			if (
				errorMessage.includes('User rejected') ||
				errorMessage.includes('User denied')
			) {
				showAlert('用户取消了交易', 'info');
			} else {
				showAlert('收回红包失败，请重试', 'error');
			}
			resetRecycle();
		}
	}, [recycleError, showAlert, resetRecycle]);

	// 获取红包创建者
	useEffect(() => {
		const fetchPacketSender = async () => {
			if (!packetId) {
				console.log('Missing packetId');
				return;
			}

			try {
				// 使用 wagmi config 获取 publicClient
				const client = publicClient || getPublicClient(wagmiConfig);

				if (!client) {
					console.error('No public client available');
					return;
				}

				console.log('Fetching packet sender for packetId:', packetId);

				// 获取当前区块号
				const currentBlock = await client.getBlockNumber();
				// 只查询最近 10000 个区块
				const fromBlock = currentBlock > BigInt(10000) ? currentBlock - BigInt(10000) : BigInt(0);

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
						packetId: BigInt(packetId),
					},
					fromBlock,
					toBlock: 'latest',
				});

				console.log('PacketCreated logs:', logs);

				if (logs && logs.length > 0) {
					const log = logs[0];
					if (log && log.args) {
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const { sender } = log.args as any;
						console.log('Packet sender found:', sender);
						if (sender) {
							setPacketSender(sender);
						}
					}
				} else {
					console.log('No logs found for packetId:', packetId);
				}
			} catch (error) {
				console.error('Failed to fetch packet sender:', error);
			}
		};

		fetchPacketSender();
	}, [packetId, publicClient, wagmiConfig]);

	const handleSearch = () => {
		if (packetId) {
			refetchPacket();
			refetchClaimed();
		}
	};

	const handleClaim = async () => {
		if (!packetId || !address) return;

		claim({
			address: CONTRACT_ADDRESS,
			abi: RedPacketABI.abi,
			functionName: 'claim',
			args: [BigInt(packetId)],
		});
	};

	const handleRecycle = async () => {
		if (!packetId || !address) return;

		// 检查是否是创建者
		if (packetSender && address.toLowerCase() !== packetSender.toLowerCase()) {
			showAlert('只有红包创建者可以收回红包', 'warning');
			return;
		}

		recycle({
			address: CONTRACT_ADDRESS,
			abi: RedPacketABI.abi,
			functionName: 'recycle',
			args: [BigInt(packetId)],
		});
	};

	const getStatus = () => {
		if (!packetInfo?.exists) return '红包不存在';
		if (isExpired) return '红包已过期';
		if (hasClaimed) return '本红包已抢过';
		if (packetInfo.remainCount === BigInt(0)) return '红包已抢完';
		return '本红包已抢过';
	};

	const canClaim =
		packetInfo?.exists &&
		!isExpired &&
		!hasClaimed &&
		packetInfo.remainCount > BigInt(0);

	const canRecycle =
		packetInfo?.exists &&
		packetInfo.remainCount > BigInt(0) &&
		packetSender &&
		address &&
		address.toLowerCase() === packetSender.toLowerCase();

	// 调试信息
	console.log('canRecycle 判断:', {
		exists: packetInfo?.exists,
		remainCount: packetInfo?.remainCount?.toString(),
		packetSender,
		currentAddress: address,
		isCreator: packetSender && address ? address.toLowerCase() === packetSender.toLowerCase() : false,
		canRecycle,
	});

	return (
		<div className='bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl'>
			<div className='flex items-center gap-3 mb-6'>
				<div className='w-1 h-8 bg-gradient-to-b from-yellow-500 to-orange-500 rounded-full' />
				<h2 className='text-2xl font-bold text-white'>抢红包</h2>
			</div>

			<div className='space-y-6'>
				{/* 红包ID输入 */}
				<div>
					<label className='block text-sm font-medium text-gray-300 mb-2'>
						红包ID
					</label>
					<div className='flex gap-3'>
						<input
							type='number'
							min='0'
							value={packetId}
							onChange={(e) => setPacketId(e.target.value)}
							placeholder='请输入红包ID'
							className='flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all'
						/>
						<button
							onClick={handleSearch}
							className='px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all'
						>
							查询
						</button>
					</div>
				</div>

				{/* 当前状态 */}
				{packetId && packetInfo && (
					<div className='bg-gray-900/50 rounded-xl p-6 border border-gray-700'>
						<h3 className='text-lg font-semibold text-white mb-4'>当前状态</h3>
						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<span className='text-gray-400'>状态:</span>
								<span
									className={`font-medium ${
										canClaim ? 'text-yellow-400' : 'text-gray-400'
									}`}
								>
									{hasClaimed && '本红包已抢过'}
									{!hasClaimed && canClaim && '等待抢红包'}
									{!hasClaimed && !canClaim && getStatus()}
								</span>
							</div>
							{packetInfo.exists && (
								<>
									<div className='flex items-center justify-between'>
										<span className='text-gray-400'>剩余红包数:</span>
										<span className='text-white font-medium'>
											{packetInfo.remainCount.toString()}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-gray-400'>总金额:</span>
										<span className='text-white font-medium'>
											{formatUnits(packetInfo.totalAmount, tokenDecimals)}{' '}
											{tokenSymbol}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-gray-400'>类型:</span>
										<span className='text-white font-medium'>
											{packetInfo.isEqual ? '均分红包' : '拼手气红包'}
										</span>
									</div>
									<div className='flex items-center justify-between'>
										<span className='text-gray-400'>过期时间:</span>
										<span className='text-white font-medium'>
											{new Date(
												Number(packetInfo.expireAt) * 1000
											).toLocaleString()}
										</span>
									</div>
									{packetSender && (
										<div className='flex items-center justify-between'>
											<span className='text-gray-400'>创建者:</span>
											<span className='text-white font-medium text-xs'>
												{packetSender.slice(0, 6)}...{packetSender.slice(-4)}
											</span>
										</div>
									)}
									{address && packetSender && (
										<div className='flex items-center justify-between'>
											<span className='text-gray-400'>我是创建者:</span>
											<span className={`font-medium ${address.toLowerCase() === packetSender.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
												{address.toLowerCase() === packetSender.toLowerCase() ? '是' : '否'}
											</span>
										</div>
									)}
								</>
							)}
						</div>
					</div>
				)}

				{/* 红包管理 */}
				<div className='bg-gray-900/50 rounded-xl p-6 border border-gray-700'>
					<h3 className='text-lg font-semibold text-white mb-4'>红包管理</h3>
					<div className='space-y-3'>
						<button
							onClick={handleClaim}
							disabled={!canClaim || isClaiming}
							className='w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg'
						>
							{isClaiming ? '抢红包中...' : canClaim ? '抢红包' : '本轮已抢过'}
						</button>
						<button
							onClick={handleRecycle}
							disabled={!canRecycle || isRecycling}
							className='w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
						>
							{isRecycling ? '收回中...' : '收回剩余红包'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
