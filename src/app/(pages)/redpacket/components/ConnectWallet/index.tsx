import { Suspense } from 'react';
import { useConnection } from 'wagmi';
import dynamic from 'next/dynamic';

export function ConnectWallet() {
	const { isConnected } = useConnection();

	const Component = dynamic(
		() => (!isConnected ? import('./ConnectButton') : import('./Connected')),
		{
			ssr: false,
		}
	);

	return (
		<Suspense fallback={null}>
			<Component />;
		</Suspense>
	);
}
