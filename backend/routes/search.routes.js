import { Router } from 'express';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import { semanticSearch } from '../services/search.service.js';

const router = Router();
router.get('/', optionalAuth, async (req, res) => {
	const q = String(req.query.q || '').trim();
	const workspaceId = req.user?.workspaceId || 'public';
	if (!q) return res.json({ query: q, results: [] });
	const results = await semanticSearch({ workspaceId, query: q, topK: 5 });
	return res.json({ query: q, results });
});
export default router;

