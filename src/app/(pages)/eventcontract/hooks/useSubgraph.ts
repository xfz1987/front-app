import { useQuery } from '@tanstack/react-query';
import { SUBGRAPH_URL } from '../config';

// Transfer 事件类型
export interface TransferEvent {
	id: string;
	from: string;
	to: string;
	value: string;
	blockNumber: string;
	blockTimestamp: string;
	transactionHash: string;
}

// 查询所有转账记录
const GET_TRANSFERS_QUERY = `
  query GetTransfers($first: Int!, $skip: Int!) {
    transfers(first: $first, skip: $skip, orderBy: blockTimestamp, orderDirection: desc) {
      id
      from
      to
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 查询特定地址的转账记录
const GET_ADDRESS_TRANSFERS_QUERY = `
  query GetAddressTransfers($address: String!, $first: Int!) {
    transfers(
      first: $first
      orderBy: blockTimestamp
      orderDirection: desc
      where: { or: [{ from: $address }, { to: $address }] }
    ) {
      id
      from
      to
      value
      blockNumber
      blockTimestamp
      transactionHash
    }
  }
`;

// 查询统计信息
const GET_STATS_QUERY = `
  query GetStats {
    transfers(first: 1) {
      id
    }
  }
`;

// 通用查询函数
async function fetchSubgraph<T>(
	query: string,
	variables?: unknown
): Promise<T> {
	const response = await fetch(SUBGRAPH_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			variables,
		}),
	});

	if (!response.ok) {
		throw new Error('Subgraph query failed');
	}

	const json = await response.json();

	if (json.errors) {
		throw new Error(json.errors[0].message);
	}

	return json.data;
}

// 使用 The Graph 查询所有转账
export function useTransfers(first: number = 10, skip: number = 0) {
	return useQuery({
		queryKey: ['transfers', first, skip],
		queryFn: () =>
			fetchSubgraph<{ transfers: TransferEvent[] }>(GET_TRANSFERS_QUERY, {
				first,
				skip,
			}),
		refetchInterval: 5000, // 每5秒刷新一次
	});
}

// 查询特定地址的转账
export function useAddressTransfers(
	address: string | undefined,
	first: number = 10
) {
	return useQuery({
		queryKey: ['addressTransfers', address, first],
		queryFn: () =>
			fetchSubgraph<{ transfers: TransferEvent[] }>(
				GET_ADDRESS_TRANSFERS_QUERY,
				{
					address: address?.toLowerCase(),
					first,
				}
			),
		enabled: !!address,
		refetchInterval: 5000,
	});
}

// 查询统计信息
export function useTransferStats() {
	return useQuery({
		queryKey: ['transferStats'],
		queryFn: async () => {
			const data = await fetchSubgraph<{ transfers: TransferEvent[] }>(
				GET_STATS_QUERY
			);
			return {
				totalTransfers: data.transfers.length,
			};
		},
		refetchInterval: 10000,
	});
}
