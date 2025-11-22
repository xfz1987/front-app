// 合约事件类型
export interface TransferEventArgs {
	_from: string;
	_to: string;
	_value: bigint;
}

export interface TransferEvent {
	args?: TransferEventArgs;
	blockNumber?: bigint;
	transactionHash?: string;
	logIndex?: number;
}

// The Graph 查询类型
export interface TransferRecord {
	id: string;
	from: string;
	to: string;
	value: string;
	blockNumber: string;
	blockTimestamp: string;
	transactionHash: string;
}

export interface TransfersQueryResult {
	transfers: TransferRecord[];
}

export interface TransferStatsResult {
	totalTransfers: number;
}

// 钱包状态类型
export interface WalletState {
	address?: `0x${string}`;
	isConnected: boolean;
	chainId?: number;
}

// 交易状态类型
export interface TransactionState {
	isPending: boolean;
	isSuccess: boolean;
	isError: boolean;
	error?: Error | null;
	hash?: `0x${string}`;
}
