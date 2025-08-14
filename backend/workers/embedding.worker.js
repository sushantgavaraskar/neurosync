import 'dotenv/config';
import { createWorker } from '../config/redis.js';
import { pool } from '../config/db.js';
import { embedText } from '../services/embedding.service.js';
import { EMBEDDING_QUEUE } from '../queues/names.js';

async function upsertEmbedding({ documentId, workspaceId, text, chunkIndex = 0, metadata = {} }) {
	const vec = await embedText(text);
	await pool.query(
		`INSERT INTO document_embeddings(id, document_id, workspace_id, chunk_index, embedding, text, metadata)
		 VALUES ($1,$2,$3,$4,$5,$6,$7)
		 ON CONFLICT (id) DO UPDATE SET embedding = EXCLUDED.embedding, text = EXCLUDED.text, metadata = EXCLUDED.metadata`,
		[`emb_${documentId}_${chunkIndex}`, documentId, workspaceId, chunkIndex, vec, text, metadata]
	);
}

createWorker(EMBEDDING_QUEUE, async (job) => {
	const { documentId } = job.data;
	const { rows } = await pool.query('SELECT id, workspace_id, text, metadata FROM documents WHERE id = $1', [documentId]);
	const doc = rows[0];
	if (!doc) return;
	await upsertEmbedding({ documentId: doc.id, workspaceId: doc.workspace_id, text: doc.text, chunkIndex: 0, metadata: doc.metadata });
	return { ok: true };
});

console.log('[embedding.worker] listening');


