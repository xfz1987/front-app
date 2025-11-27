'use client';

import { useConnect, useConnection, useConnectors } from 'wagmi';
import { Button } from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

export default function ConnectButton() {
	const { isConnecting } = useConnection();
	const { connect } = useConnect();
	const connectors = useConnectors();

	return (
		<Button
			onClick={() => {
				const injectedConnector = connectors.find((c) => c.id === 'injected');
				if (injectedConnector) {
					connect({ connector: injectedConnector });
				}
			}}
			loading={isConnecting}
			className='flex items-center space-x-2 px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl'
		>
			<AccountBalanceWalletRoundedIcon />
			<span>Connect MetaMask</span>
		</Button>
	);
}
