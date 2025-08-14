import 'dotenv/config';

const BASE = 'http://localhost:' + (process.env.PORT || 4000);
const API = BASE + '/api';

async function main() {
	const health = await fetch(BASE + '/health');
	console.log('health', health.status);
	const login = await fetch(API + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'user@example.com', password: 'password123' }) });
	console.log('login', login.status);
}

main();


