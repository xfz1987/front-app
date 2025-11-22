import { Transfer as TransferEvent } from '../generated/Events/Events';
import { Transfer } from '../generated/schema';

export function handleTransfer(event: TransferEvent): void {
	let entity = new Transfer(
		event.transaction.hash.concatI32(event.logIndex.toI32())
	);
	entity.from = event.params._from;
	entity.to = event.params._to;
	entity.value = event.params._value;

	entity.blockNumber = event.block.number;
	entity.blockTimestamp = event.block.timestamp;
	entity.transactionHash = event.transaction.hash;

	entity.save();
}
