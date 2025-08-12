import { Router } from 'express';

const router = Router();
router.get('/metrics', (_req, res) => res.json({ ok: true }));
export default router;

