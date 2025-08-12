import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/index.js';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export async function login(req, res) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'invalid_input' });

  // TODO: replace with real user lookup and password check
  const { email } = parsed.data;
  const workspaceId = 'workspace_123';
  const userId = 'user_abc';

  const accessToken = jwt.sign({ sub: userId, email, workspaceId }, config.jwtSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ sub: userId, type: 'refresh' }, config.jwtSecret, { expiresIn: '7d' });
  return res.json({ accessToken, refreshToken });
}

export async function refresh(req, res) {
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
}

