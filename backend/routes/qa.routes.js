import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import OpenAI from 'openai';
import { config } from '../config/index.js';

const router = Router();
router.post('/', requireAuth, async (req, res) => {
	const { query } = req.body || {};
	if (!query) return res.status(400).json({ error: 'invalid_input' });
	if (!config.openaiApiKey) return res.json({ query, answer: 'LLM not configured (cost-free mode)', sources: [] });
	try {
		const client = new OpenAI({ apiKey: config.openaiApiKey });
		const completion = await client.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{ role: 'system', content: 'You are a concise assistant. If unsure, say you do not know.' },
				{ role: 'user', content: query }
			]
		});
		const answer = completion.choices?.[0]?.message?.content || '';
		return res.json({ query, answer, sources: [] });
	} catch (e) {
		return res.status(500).json({ error: 'llm_failed', details: e?.message });
	}
});
export default router;

