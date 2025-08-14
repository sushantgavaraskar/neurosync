import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function requireAuth(req, res, next) {
    try {
        const header = req.headers['authorization'] || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : '';
        if (!token) return res.status(401).json({ error: 'unauthorized' });
        const payload = jwt.verify(token, config.jwtSecret);
        req.user = { id: payload.sub, workspaceId: payload.workspaceId, email: payload.email };
        return next();
    } catch {
        return res.status(401).json({ error: 'unauthorized' });
    }
}

export function optionalAuth(req, _res, next) {
    try {
        const header = req.headers['authorization'] || '';
        const token = header.startsWith('Bearer ') ? header.slice(7) : '';
        if (token) {
            const payload = jwt.verify(token, config.jwtSecret);
            req.user = { id: payload.sub, workspaceId: payload.workspaceId, email: payload.email };
        }
    } catch {
        // ignore invalid token
    }
    return next();
}

