import { useReadContract, useWriteContract, useWatchContractEvent } from 'wagmi';
import { CONTRACT_ADDRESS } from '../config/wagmi';
import EventsABI from '../abi/Events.json';
import { useState } from 'react';

// 合约 ABI
const abi = EventsABI.abi;

// 读取余额
export function useBalance(address: `0x${string}` | undefined) {
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

// 转账函数
export function useTransfer() {
	const { writeContract, isPending, isSuccess, isError, error, data: hash } = useWriteContract();

	const transfer = (from: `0x${string}`, to: `0x${string}`, amount: bigint) => {
		writeContract({
			address: CONTRACT_ADDRESS,
			abi: abi,
			functionName: '_transfer',
			args: [from, to, amount],
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

	useWatchContractEvent({
		address: CONTRACT_ADDRESS,
		abi: abi,
		eventName: 'Transfer',
		onLogs(logs) {
			console.log('New transfer events:', logs);
			setEvents((prev) => [...logs.reverse(), ...prev]);
		},
	});

	return { events };
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
			console.log('Transfer events for address:', logs);
			setEvents((prev) => [...logs.reverse(), ...prev]);
		},
	});

	return { events };
}
