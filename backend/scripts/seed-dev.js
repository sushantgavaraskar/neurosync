import 'dotenv/config';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

async function main() {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		await client.query("INSERT INTO workspaces(id, name) VALUES ('ws_local','Local') ON CONFLICT (id) DO NOTHING");
		const hash = await bcrypt.hash('password123', 10);
		await client.query(
			"INSERT INTO users(id, email, password_hash, role, workspace_id) VALUES ('user_local','user@example.com',$1,'admin','ws_local') ON CONFLICT (id) DO NOTHING",
			[hash]
		);
		await client.query('COMMIT');
		console.log('Seeded dev user: user@example.com / password123');
	} catch (e) {
		await client.query('ROLLBACK');
		console.error('Seed failed', e);
		process.exit(1);
	} finally {
		client.release();
	}
}

main();


