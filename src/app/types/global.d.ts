export {}; // 一定要加，否则 declare global 可能无效

declare global {
	interface Window {
		ethereum?: {
			on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
			on(event: 'chainChanged', handler: (chainId: string) => void): void;

			removeListener(
				event: 'accountsChanged' | 'chainChanged',
				handler: (...args: stirng[]) => void
			): void;

			request: (args: {
				method: string;
				params?: unknown[];
			}) => Promise<unknown>;
		};
	}
}
