export function chunkText(text, opts = {}) {
	const maxChars = opts.maxChars || 1000;
	const overlap = opts.overlap || 100;
	const chunks = [];
	let i = 0;
	while (i < text.length) {
		const end = Math.min(text.length, i + maxChars);
		const slice = text.slice(i, end);
		chunks.push(slice);
		i = end - overlap;
		if (i < 0) i = 0;
		if (i >= text.length) break;
	}
	return chunks;
}


