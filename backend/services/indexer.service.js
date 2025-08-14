import { pool } from '../config/db.js';
import { chunkText } from './chunk.service.js';
import { createQueue } from '../config/redis.js';
import { EMBEDDING_QUEUE } from '../queues/names.js';

const embeddingQueue = createQueue(EMBEDDING_QUEUE);

export async function indexDocument({ id, workspaceId, title, text, sourceType, sourceId, metadata = {} }) {
	// Persist document
	await pool.query(
		'INSERT INTO documents(id, workspace_id, source_type, source_id, title, text, metadata) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO NOTHING',
		[id, workspaceId, sourceType, sourceId, title || null, text, metadata]
	);

	// Chunk and enqueue embedding jobs (for now, enqueue only first chunk as MVP)
	const chunks = chunkText(text, { maxChars: 1000, overlap: 100 });
	for (let idx = 0; idx < Math.min(chunks.length, 10); idx += 1) {
		await embeddingQueue.add('embed', { documentId: id, chunkIndex: idx });
	}
}


