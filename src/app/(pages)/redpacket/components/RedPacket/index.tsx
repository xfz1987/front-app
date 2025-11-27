import dynamic from 'next/dynamic';

export function RedPacket() {
	const RedPacketStats = dynamic(() => import('./RedPacketStats'), {
		ssr: false,
	});
	const SendRedPacket = dynamic(() => import('./SendRedPacket'), {
		ssr: false,
	});
	const ClaimRedPacket = dynamic(() => import('./ClaimRedPacket'), {
		ssr: false,
	});

	return (
		<>
			<RedPacketStats />
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
				<SendRedPacket />
				<ClaimRedPacket />
			</div>
		</>
	);
}
