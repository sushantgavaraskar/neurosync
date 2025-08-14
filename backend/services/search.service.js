import { pool } from '../config/db.js';
import { embedText } from './embedding.service.js';

export async function semanticSearch({ workspaceId, query, topK = 5 }) {
    let client;
    try {
        client = await pool.connect();
		// Try vector search if embeddings table exists and vector extension enabled
		let results = [];
		try {
			const qVec = await embedText(query);
			const { rows } = await client.query(
				`SELECT id, text, metadata, 1 - (embedding <=> $1::vector) AS score
				 FROM document_embeddings
				 WHERE workspace_id = $2
				 ORDER BY embedding <=> $1::vector
				 LIMIT $3`,
				[qVec, workspaceId, topK]
			);
			results = rows.map((r) => ({ id: r.id, text: r.text, metadata: r.metadata, score: Number(r.score) }));
		} catch {
			// fall back to LIKE search when vector search unavailable
			const likeRows = await client.query(
				`SELECT id, text, metadata FROM documents WHERE workspace_id = $1 AND text ILIKE '%' || $2 || '%' LIMIT $3`,
				[workspaceId, query, topK]
			);
			results = likeRows.rows.map((r) => ({ id: r.id, text: r.text, metadata: r.metadata, score: 0.0 }));
        }
        return results;
    } catch (_e) {
        // Database not available → safe fallback
        return [];
    } finally {
        if (client) client.release?.();
    }
}


