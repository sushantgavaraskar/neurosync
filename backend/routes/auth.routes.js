import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/index.js';
import { findUserByEmail, verifyPassword } from '../services/auth.service.js';

const router = Router();

const LoginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', async (req, res) => {
	const parsed = LoginSchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });
	const { email, password } = parsed.data;
	const user = await findUserByEmail(email);
	if (!user) return res.status(401).json({ error: 'invalid_credentials' });
	const ok = await verifyPassword(password, user.password_hash);
	if (!ok) return res.status(401).json({ error: 'invalid_credentials' });
	const accessToken = jwt.sign({ sub: user.id, email: user.email, workspaceId: user.workspace_id, role: user.role }, config.jwtSecret, { expiresIn: '15m' });
	const refreshToken = jwt.sign({ sub: user.id, type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });
	return res.json({ accessToken, refreshToken });
});

router.post('/refresh', (req, res) => {
	const token = req.body?.refreshToken;
	if (!token) return res.status(400).json({ error: 'missing_refresh_token' });
	try {
		const payload = jwt.verify(token, config.jwtSecret);
		if (payload.type !== 'refresh') throw new Error('invalid');
		const accessToken = jwt.sign({ sub: payload.sub }, config.jwtSecret, { expiresIn: '15m' });
		return res.json({ accessToken });
	} catch {
		return res.status(401).json({ error: 'invalid_token' });
	}
});

export default router;


