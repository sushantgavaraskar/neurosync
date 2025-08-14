import BullMQ from 'bullmq';
import IORedis from 'ioredis';

const { Queue, Worker } = BullMQ;

const redisUrl = process.env.REDIS_URL;
const connection = redisUrl && redisUrl !== 'disabled' ? new IORedis(redisUrl) : null;

export function createQueue(name) {
	// v5: QueueScheduler not required; support no-redis mode
	if (!connection) {
		return { add: async () => ({ ok: true, skipped: true, queue: name }) };
	}
	return new Queue(name, { connection });
}

export function createWorker(name, processor) {
	if (!connection) {
		return { close: async () => {} };
	}
	return new Worker(name, processor, { connection });
}


