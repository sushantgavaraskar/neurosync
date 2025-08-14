import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export async function findUserByEmail(email) {
	const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
	return rows[0] || null;
}

export async function createUser({ id, email, passwordHash, role, workspaceId }) {
	await pool.query(
		'INSERT INTO users(id, email, password_hash, role, workspace_id) VALUES ($1,$2,$3,$4,$5)',
		[id, email, passwordHash, role, workspaceId]
	);
}

export async function verifyPassword(password, passwordHash) {
	return bcrypt.compare(password, passwordHash);
}


