import {
	useReadContract,
	useWriteContract,
	useWatchContractEvent,
	useBalance as useWagmiBalance,
	usePublicClient,
} from 'wagmi';
import { CONTRACT_ADDRESS } from '../config';
import EventTestABI from '../abi/EventTest.json';
import { useState, useEffect } from 'react';

// 合约 ABI
const abi = EventTestABI.abi;

// 读取合约内余额
export function useContractBalance(address: `0x${string}` | undefined) {
	const { data, isError, isLoading, refetch } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: abi,
		functionName: '_balances',
		args: address ? [address] : undefined,
		query: {
			enabled: !!address,
		},
	});

	return {
		balance: data as bigint | undefined,
		isError,
		isLoading,
		refetch,
	};
}

// 读取钱包原生 ETH 余额
export function useBalance(address: `0x${string}` | undefined) {
	const { data, isError, isLoading, refetch } = useWagmiBalance({
		address: address,
		query: {
			enabled: !!address,
		},
	});

	return {
		balance: data?.value,
		isError,
		isLoading,
		refetch,
	};
}

// 读取合约 owner 地址
export function useOwner() {
	const { data, isError, isLoading } = useReadContract({
		address: CONTRACT_ADDRESS,
		abi: abi,
		functionName: 'owner',
	});

	return {
		owner: data as `0x${string}` | undefined,
		isError,
		isLoading,
	};
}

// 转账函数 (只有 owner 可以调用)
export function useTransfer() {
	const {
		writeContract,
		isPending,
		isSuccess,
		isError,
		error,
		data: hash,
	} = useWriteContract();

	const transfer = (to: `0x${string}`, amount: bigint) => {
		writeContract({
			address: CONTRACT_ADDRESS,
			abi: abi,
			functionName: 'ownerTransfer',
			args: [to, amount],
			gas: BigInt(100000), // 手动设置 gas limit,避免自动估算过高
		});
	};

	return {
		transfer,
		isPending,
		isSuccess,
		isError,
		error,
		hash,
	};
}

// 监听 Transfer 事件
export function useTransferEvents() {
	const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);
	const [isLoading, setIsLoading] = useState(true);
	const publicClient = usePublicClient();

	// 获取历史事件
	useEffect(() => {
		const fetchHistoricalEvents = async () => {
			if (!publicClient) {
				console.log('⚠️ Public client not ready');
				return;
			}

			try {
				console.log('🔍 Fetching historical Transfer events...');
				console.log('📍 Contract address:', CONTRACT_ADDRESS);

				// 获取最新区块号
				const latestBlock = await publicClient.getBlockNumber();
				// 查询最近 1000 个区块的事件 (RPC 限制)
				const fromBlock =
					latestBlock > BigInt(1000) ? latestBlock - BigInt(1000) : BigInt(0);

				console.log(
					'📊 Block range:',
					fromBlock.toString(),
					'to',
					latestBlock.toString()
				);

				const logs = await publicClient.getLogs({
					address: CONTRACT_ADDRESS,
					event: {
						type: 'event',
						name: 'Transfer',
						inputs: [
							{ name: '_from', type: 'address', indexed: true },
							{ name: '_to', type: 'address', indexed: true },
							{ name: '_value', type: 'uint256', indexed: false },
						],
					},
					fromBlock: fromBlock,
					toBlock: 'latest',
				});

				console.log('📦 Historical events found:', logs.length);

				if (logs.length > 0) {
					console.log(
						'📝 Events:',
						JSON.stringify(
							logs,
							(_, v) => (typeof v === 'bigint' ? v.toString() : v),
							2
						)
					);
					setEvents(logs.reverse() as Array<Record<string, unknown>>);
				} else {
					console.log('ℹ️ No events found in the last 1000 blocks');
					console.log('💡 This is normal if:');
					console.log('  - The contract is newly deployed');
					console.log('  - No transfers have been made yet');
					console.log('  - Transfers were made more than 1000 blocks ago');
				}
				setIsLoading(false);
			} catch (error) {
				console.error('❌ Error fetching historical events:', error);
				console.error('📋 Error details:', error);
				setIsLoading(false);
			}
		};

		fetchHistoricalEvents();
	}, [publicClient]);

	// 监听新事件
	useWatchContractEvent({
		address: CONTRACT_ADDRESS,
		abi: abi,
		eventName: 'Transfer',
		onLogs(logs) {
			console.log('🔔 New transfer events detected:', logs);
			console.log('📊 Logs count:', logs.length);

			if (logs.length > 0) {
				setEvents((prev) => {
					const newEvents = [...logs.reverse(), ...prev];
					console.log('✅ Events updated, total count:', newEvents.length);
					return newEvents;
				});
			}
		},
	});

	// 添加轮询刷新机制
	useEffect(() => {
		if (!publicClient) return;

		console.log('⏱️ Starting polling for new events (every 3 seconds)...');

		const pollInterval = setInterval(async () => {
			try {
				// console.log('🔍 Polling for new events...');
				const latestBlock = await publicClient.getBlockNumber();
				const fromBlock =
					latestBlock > BigInt(100) ? latestBlock - BigInt(100) : BigInt(0);

				const logs = await publicClient.getLogs({
					address: CONTRACT_ADDRESS,
					event: {
						type: 'event',
						name: 'Transfer',
						inputs: [
							{ name: '_from', type: 'address', indexed: true },
							{ name: '_to', type: 'address', indexed: true },
							{ name: '_value', type: 'uint256', indexed: false },
						],
					},
					fromBlock: fromBlock,
					toBlock: 'latest',
				});

				if (logs.length > 0) {
					// console.log(
					// 	'📦 Found',
					// 	logs.length,
					// 	'recent events in last 100 blocks'
					// );
					setEvents(logs.reverse() as Array<Record<string, unknown>>);
				}
			} catch (error) {
				console.error('⚠️ Error polling events:', error);
			}
		}, 5000); // 每3秒轮询一次

		return () => {
			console.log('🛑 Stopping event polling');
			clearInterval(pollInterval);
		};
	}, [publicClient]);

	return { events, isLoading };
}

// 监听特定地址的 Transfer 事件
export function useAddressTransferEvents(address: `0x${string}` | undefined) {
	const [events, setEvents] = useState<Array<Record<string, unknown>>>([]);

	useWatchContractEvent({
		address: CONTRACT_ADDRESS,
		abi: abi,
		eventName: 'Transfer',
		args: address ? { _from: address } : undefined,
		onLogs(logs) {
			// console.log('Transfer events for address:', logs);
			setEvents((prev) => [...logs.reverse(), ...prev]);
		},
	});

	return { events };
}
