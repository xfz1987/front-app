'use client';

import { Web3Provider } from './providers/Web3Provider';
import { ConnectWallet } from './components/ConnectWallet';
import { RedPacket } from './components/RedPacket';

export default function RedPacketPage() {
	return (
		<Web3Provider>
			<div className='min-h-screen bg-color'>
				<header className='bg-gray-800/50 backdrop-blur-sm border-b border-gray-700'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex items-center justify-between h-16'>
							<div className='flex items-center'>
								<h1 className='text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
									Red Packet
								</h1>
							</div>
							<div className='flex items-center '>
								<ConnectWallet />
							</div>
						</div>
					</div>
				</header>
				<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
					<RedPacket />
				</main>
			</div>
		</Web3Provider>
	);
}
