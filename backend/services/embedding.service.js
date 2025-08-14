import { pipeline } from '@xenova/transformers';
import { config } from '../config/index.js';

let embedderPromise;

async function getEmbedder() {
	if (!embedderPromise) {
		embedderPromise = pipeline('feature-extraction', config.embeddingModel);
	}
	return embedderPromise;
}

export async function embedText(text) {
	const extractor = await getEmbedder();
	const output = await extractor(text, { pooling: 'mean', normalize: true });
	// Convert to plain array
	return Array.from(output.data);
}


