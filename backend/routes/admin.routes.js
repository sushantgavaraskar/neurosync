import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();
router.get('/metrics', requireAuth, (_req, res) => res.json({ ok: true }));
export default router;

